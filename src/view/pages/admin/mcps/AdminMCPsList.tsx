import { Fragment, useMemo, useState } from "react";
import "./AdminMCPsList.css";
import Input from "../../../components/Input/Input";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";
import ImageInput from "../../../components/ImageInput/ImageInput";
import { useMCP } from "../../../../hooks/useMCP";
import { useDebounce } from "../../../../hooks/useDebounce";
import ListInput from "../../../components/ListInput/ListInput";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Loader from "../../../components/Loader/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MCPItem } from "../../../../services/Queries/MCPs.gql";
import Dropdown from "../../../components/Dropdown/Dropdown";
import CodeInput from "../../../components/CodeInput/CodeInput";

export type MCPType =
  | "NODE"
  | "PYTHON"
  | "GO"
  | "KOTLIN"
  | "SWIFT"
  | "JAVA"
  | "CS"
  | "RUBY"
  | "RUST"
  | "PHP"
  | "OTHERS";

const createMCPSchema = z.object({
  icon: z.string().nonempty({
    error: "Icon is required",
  }),
  name: z.string().min(1),
  description: z.string().min(3),
  path: z.string().min(1),
  type: z.enum([
    "NODE",
    "PYTHON",
    "GO",
    "KOTLIN",
    "SWIFT",
    "JAVA",
    "CS",
    "RUBY",
    "RUST",
    "PHP",
  ]),
  command: z.string().optional(),
  requirements: z.array(
    z
      .string()
      .regex(/^[A-Z][A-Z0-9_]+$/, {
        message: "Requirements must be a valid string starts with A-Z",
      })
      .min(3, {
        error: "Requirements must be at least 3 character",
      }),
    {
      message: "Requirements must be a valid string starts with A-Z",
    }
  ),
  tools: z
    .array(
      z.object({
        name: z.string().min(3),
        description: z.string().min(3),
      })
    )
    .min(1, {
      error: "Tools must be at least 1 tool",
    }),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, {
      error: "Version must be a valid semver",
    })
    .min(1),
  tabs: z
    .array(
      z.object({
        is_main: z.boolean(),
        code: z.string().min(0),
      })
    )
    .min(1),
});

type CreateMCPFormData = z.infer<typeof createMCPSchema>;

const Environments = [
  "NODE",
  "PYTHON",
  // "GO",
  // "KOTLIN",
  // "SWIFT",
  // "JAVA",
  // "CS",
  // "RUBY",
  // "RUST",
  // "PHP",
  "OTHERS",
];

const AdminMCPsList = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState<MCPItem | boolean>(false);
  const [showDelete, setShowDelete] = useState<MCPItem | boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalMCP, setOriginalMCP] = useState<MCPItem | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateMCPFormData>({
    resolver: zodResolver(createMCPSchema),
    defaultValues: {
      tools: [{ name: "", description: "" }],
      tabs: [{ code: "", is_main: true }],
      requirements: [],
      type: "NODE" as const,
      icon: "",
      name: "",
      description: "",
      path: "",
      version: "",
    },
  });
  const FormValues = watch();

  const {
    mcps,
    isLoadingList,
    createMCPAsync,
    isCreating,
    updateMCPAsync,
    isUpdating,
    deleteMCPAsync,
  } = useMCP();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);

  // Filter MCPs based on debounced search
  const filteredMCPs = useMemo(() => {
    return mcps?.filter((mcp) => {
      if (!debouncedSearch.trim()) return true;

      const searchLower = debouncedSearch.toLowerCase();
      return (
        mcp.name.toLowerCase().includes(searchLower) ||
        mcp.description.toLowerCase().includes(searchLower) ||
        mcp.path.toLowerCase().includes(searchLower) ||
        mcp.version.toLowerCase().includes(searchLower) ||
        mcp.Tools.some((tool) =>
          tool.name.toLowerCase().includes(searchLower)
        ) ||
        mcp.Requirements.some((req) =>
          req.key.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [mcps, debouncedSearch]);

  // Helper function to process requirements deletions and additions
  const processRequirementsChanges = (
    currentRequirements: string[],
    originalRequirements: { id: number; key: string }[]
  ) => {
    const originalKeys = originalRequirements.map((r) => r.key);

    // Find requirements to delete (exist in original but not in current)
    const deleteRequirements = originalRequirements
      .filter((r) => !currentRequirements.includes(r.key))
      .map((r) => r.id);

    // Find new requirements (exist in current but not in original)
    const newRequirements = currentRequirements.filter(
      (r) => !originalKeys.includes(r)
    );

    return {
      delete_requirements: deleteRequirements,
      new_requirements: newRequirements,
    };
  };

  // Helper function to process tools deletions and additions
  const processToolsChanges = (
    currentTools: { name: string; description: string }[],
    originalTools: { id: number; name: string; description?: string }[]
  ) => {
    const originalToolStrings = originalTools.map(
      (t) => `${t.name}: ${t.description || ""}`
    );

    const currentToolStrings = currentTools.map(
      (t) => `${t.name}: ${t.description || ""}`
    );

    // Find tools to delete (exist in original but not in current)
    const deleteTools = originalTools
      .filter((t) => {
        const toolString = `${t.name}: ${t.description || ""}`;
        return !currentToolStrings.includes(toolString);
      })
      .map((t) => t.id);

    // Find new tools (exist in current but not in original)
    const newTools = currentTools
      .filter((t) => !originalToolStrings.includes(t.name))
      .map((t) => ({
        name: t.name.trim() || "",
        description: t.description.trim() || "",
      }));

    return {
      delete_tools: deleteTools,
      new_tools: newTools,
    };
  };

  const onSubmit = async (formdata: CreateMCPFormData) => {
    try {
      if (editMode && originalMCP) {
        // Update mode - process changes
        const requirementsChanges = processRequirementsChanges(
          formdata.requirements,
          originalMCP.Requirements || []
        );

        const toolsChanges = processToolsChanges(
          formdata.tools,
          originalMCP.Tools || []
        );

        await updateMCPAsync(originalMCP.id, {
          icon: formdata.icon !== originalMCP.icon ? formdata.icon : undefined,
          name: formdata.name !== originalMCP.name ? formdata.name : undefined,
          description:
            formdata.description !== originalMCP.description
              ? formdata.description
              : undefined,
          path: formdata.path !== originalMCP.path ? formdata.path : undefined,
          version:
            formdata.version !== originalMCP.version
              ? formdata.version
              : undefined,
          delete_requirements:
            requirementsChanges.delete_requirements.length > 0
              ? requirementsChanges.delete_requirements
              : undefined,
          new_requirements:
            requirementsChanges.new_requirements.length > 0
              ? requirementsChanges.new_requirements
              : undefined,
          delete_tools:
            toolsChanges.delete_tools.length > 0
              ? toolsChanges.delete_tools
              : undefined,
          new_tools:
            toolsChanges.new_tools.length > 0
              ? toolsChanges.new_tools
              : undefined,
        });
      } else {
        // Create mode
        await createMCPAsync({
          icon: formdata.icon,
          name: formdata.name,
          description: formdata.description,
          path: formdata.path,
          requirements: formdata.requirements,
          tools: formdata.tools.map((t) => ({
            name: t.name.trim() || "",
            description: t.description.trim() || "",
          })),
          version: formdata.version,
        });
      }
    } catch (error) {
      console.error(`Failed to ${editMode ? "update" : "create"} MCP:`, error);
    } finally {
      setShowCreate(false);
    }
  };

  const openForm = (mcp?: MCPItem) => {
    console.log(mcp);
    reset({
      icon: mcp?.icon || "",
      name: mcp?.name || "",
      description: mcp?.description || "",
      path: mcp?.path || "",
      requirements: mcp?.Requirements?.map((r) => r.key || "") || [],
      type: (mcp?.type as any) || "NODE",
      command: mcp?.command || "",
      tools: mcp?.Tools.map((t) => ({
        name: t.name.split(": ")?.[0] || "",
        description: t.name.split(": ")?.[1] || "",
      })) || [{ name: "", description: "" }],
      version: mcp?.version || "",
    });
    setShowCreate(mcp || true);
    setEditMode(!!mcp);
    setOriginalMCP(mcp || null);
  };

  const handleDelete = async (mcp: MCPItem) => {
    if (!mcp) return;

    try {
      setShowDelete(mcp);
    } catch (error) {
      console.error("Failed to delete MCP:", error);
    }
  };

  const deleteMCP = async (mcp: MCPItem) => {
    await deleteMCPAsync(mcp.id);
    setShowDelete(false);
  };

  const {
    fields: tools,
    append: addTool,
    remove: removeTool,
  } = useFieldArray({
    control,
    name: "tools",
    shouldUnregister: true,
  });

  return (
    <section className="admin-agents section-page sys_container">
      <div className="headline">
        <div>
          <h2>System MCPs</h2>
          <p>Manage all MCPs in the system</p>
        </div>

        <div className="actions">
          <Button theme="primary" onClick={() => openForm()}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Create MCP</span>
          </Button>
        </div>
      </div>

      <div className="search-section">
        <Input
          placeholder="Search mcps..."
          value={search}
          onChange={(value: string) => {
            setSearch(value);
          }}
        />
      </div>

      {isLoadingList && (
        <div className="flex justify-center items-center gap-2 w-full glass-bg">
          <Loader />
          Loading...
        </div>
      )}

      <div className="agents-list">
        {filteredMCPs?.map((mcp, index) => (
          <AgentCard
            key={index}
            mcp={{
              ...mcp,
              icon: mcp.icon,
              name: mcp.name,
              description: mcp.description,
              Tools: mcp.Tools.map((t) => ({
                id: t.id,
                name: `${t.name}: ${t.description}`,
              })),
              Requirements: mcp.Requirements.map((requirement) => ({
                id: requirement.id,
                key: requirement.key,
              })),
            }}
            onDelete={(mcp) => handleDelete(mcp)}
            onUpdate={(mcp) => openForm(mcp)}
            editMode
            editType="CONTROLS"
          />
        ))}

        {filteredMCPs?.length === 0 && debouncedSearch.trim() && (
          <div className="no-results">
            <p>No MCPs found matching "{debouncedSearch}"</p>
          </div>
        )}
      </div>

      <Modal
        open={!!showCreate}
        title={editMode ? "Edit MCP" : "Create New MCP"}
        onClose={() => setShowCreate(false)}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="create-agent-form">
          <Controller
            control={control}
            name="icon"
            render={({ field, fieldState }) => (
              <div className="mcp-image-input">
                <ImageInput
                  accept=".jpg, .jpeg, .png, .svg, .webp"
                  value={field.value}
                  onChange={field.onChange}
                />
                <div className="info-box">
                  <p>Upload a MCP image</p>
                  <small>Accepts: .jpg, .jpeg, .png, .svg, .webp</small>
                  <br />
                  <small>Max size: 1MB</small>
                  <br />
                  {fieldState.error?.message && (
                    <small className="text-red-500">
                      {fieldState.error?.message}
                    </small>
                  )}
                </div>
              </div>
            )}
          />

          <div className="form-columns-splitting">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="MCP Name"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="eg: Notion, Shopify, etc."
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Input
                  label="Description"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="eg: Control notion account"
                />
              )}
            />

            <div className="form-columns-splitting">
              <Controller
                control={control}
                name="type"
                render={({ field, fieldState }) => (
                  <Dropdown
                    label="Mcp Environment"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    options={Environments}
                    placeholder="eg: NODE, PYTHON, GO, etc."
                  />
                )}
              />

              {(FormValues.type as string) === "OTHERS" && (
                <Controller
                  control={control}
                  name="command"
                  shouldUnregister
                  render={({ field, fieldState }) => (
                    <Input
                      label="Mcp Environment Code"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="eg: uv.py, go.mod, etc."
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
            </div>

            <Controller
              control={control}
              name="version"
              render={({ field, fieldState }) => (
                <Input
                  label="Version"
                  placeholder="0.1.0"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="full-w">
              <Controller
                control={control}
                defaultValue={[]}
                name="requirements"
                render={({ field, fieldState }) => (
                  <ListInput
                    label="Requirements"
                    placeholder="eg: NOTION_API_KEY,NOTION_VERSION"
                    value={field.value}
                    onChange={field.onChange}
                    Uppercase
                    NoSpaces
                    error={
                      fieldState.error?.message ||
                      errors.requirements?.[0]?.message
                    }
                  />
                )}
              />
            </div>

            {tools.map((tool, index) => (
              <Fragment key={tool.id}>
                <Controller
                  control={control}
                  name={`tools.${index}.name`}
                  render={({ field, fieldState }) => (
                    <Input
                      label={`Tool Name [${index + 1}]`}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      placeholder="eg: Tool Name"
                    />
                  )}
                />
                <div className="tool-list-input">
                  <Controller
                    control={control}
                    name={`tools.${index}.description`}
                    render={({ field, fieldState }) => (
                      <Input
                        label={`Tool Description [${index + 1}]`}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="eg: Tool Description"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  {index === tools.length - 1 ? (
                    <Button
                      theme="primary"
                      onClick={() => addTool({ name: "", description: "" })}
                      tabIndex={-1}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  ) : (
                    <Button
                      theme="danger"
                      onClick={() => removeTool(index)}
                      tabIndex={-1}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
                </div>
              </Fragment>
            ))}

            <div className="full-w">
              <CodeInput control={control} name="tabs" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              theme="primary"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader />
              ) : editMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!showDelete}
        title={`Delete MCP ${originalMCP?.name}`}
        onClose={() => setShowDelete(false)}
        onSave={() => deleteMCP(showDelete as MCPItem)}
      >
        <div>
          <p>Are you sure you want to delete {originalMCP?.name}?</p>
        </div>
      </Modal>
    </section>
  );
};

export default AdminMCPsList;
