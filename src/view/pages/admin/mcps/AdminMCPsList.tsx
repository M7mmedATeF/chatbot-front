import { useMemo, useState } from "react";
import "./AdminMCPsList.css";
import Input from "../../../components/Input/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentCard from "../../../components/AgentCard/AgentCard";
import Modal from "../../../components/Modal/Modal";
import ImageInput from "../../../components/ImageInput/ImageInput";
import { useMCP } from "../../../../hooks/useMCP";
import { useDebounce } from "../../../../hooks/useDebounce";
import ListInput from "../../../components/ListInput/ListInput";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../components/Loader/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MCPItem } from "../../../../services/Queries/MCPs.gql";

const createMCPSchema = z.object({
  icon: z.string().nonempty({
    error: "Icon is required",
  }),
  name: z.string().min(1),
  description: z.string().min(3),
  path: z.string().min(1).endsWith(".js", {
    error: "Path must end with .js",
  }),
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
      z.string().min(3, {
        error: "Tools must be at least 3 character",
      }),
      {
        message: "Tools must be a valid string starts with A-Z",
      }
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
});

type CreateMCPFormData = z.infer<typeof createMCPSchema>;

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
  } = useForm<CreateMCPFormData>({
    resolver: zodResolver(createMCPSchema),
  });

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
    currentTools: string[],
    originalTools: { id: number; name: string; description?: string }[]
  ) => {
    const originalToolStrings = originalTools.map(
      (t) => `${t.name}: ${t.description || ""}`
    );

    // Find tools to delete (exist in original but not in current)
    const deleteTools = originalTools
      .filter((t) => {
        const toolString = `${t.name}: ${t.description || ""}`;
        return !currentTools.includes(toolString);
      })
      .map((t) => t.id);

    // Find new tools (exist in current but not in original)
    const newTools = currentTools
      .filter((t) => !originalToolStrings.includes(t))
      .map((t) => ({
        name: t.split(":")?.[0]?.trim() || "",
        description: t.split(":")?.[1]?.trim() || "",
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
            name: t.split(":")?.[0].trim() || "",
            description: t.split(":")?.[1]?.trim() || "",
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
    reset({
      icon: mcp?.icon || "",
      name: mcp?.name || "",
      description: mcp?.description || "",
      path: mcp?.path || "",
      requirements: mcp?.Requirements?.map((r) => r.key || "") || [],
      tools: mcp?.Tools?.map((t) => `${t.name}: ${t.description || ""}`) || [],
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

          <Controller
            control={control}
            name="path"
            render={({ field, fieldState }) => (
              <Input
                label="Path"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="eg: notion_MCP/notion_mcp.js"
              />
            )}
          />

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
                  fieldState.error?.message || errors.requirements?.[0]?.message
                }
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={[]}
            name="tools"
            render={({ field, fieldState }) => (
              <ListInput
                label="Tools"
                placeholder="Tool Name: Tool Description"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message || errors.tools?.[0]?.message}
              />
            )}
          />

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
