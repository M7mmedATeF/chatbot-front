import { useMemo, useState } from "react";
import Input from "../../../components/Input/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgentDisplayCard from "../../../components/AgentDisplayCard/AgentDisplayCard";
import Modal from "../../../components/Modal/Modal";
import ImageInput from "../../../components/ImageInput/ImageInput";
import { useAgents } from "../../../../hooks/useAgents";
import { useDebounce } from "../../../../hooks/useDebounce";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../components/Loader/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Textarea from "../../../components/Textarea/Textarea";
import { useCreateAgent } from "../../../../hooks/useCreateAgent";
import { useUpdateAgent } from "../../../../hooks/useUpdateAgent";
import { useListMCPs } from "../../../../hooks/useListMCPs";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown/MultiSelectDropdown";
import type { AgentItem } from "../../../../services/Queries/Agents.gql";
import { toast } from "react-toastify";

const createAgentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  icon: z.string().min(1, "Icon is required"),
  version: z
    .string()
    .min(1, "Version is required")
    .regex(/^\d+\.\d+\.\d+$/, "Version must be in format X.X.X (e.g., 1.0.0)"),
  sys_instruction: z
    .string()
    .min(10, "System instruction must be at least 10 characters"),
  AgentMcpIds: z.array(z.number()).min(1, "At least one MCP tool is required"),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

const AdminAgentsList = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);

  const { data, isLoading } = useAgents();
  const { data: mcpsData, isLoading: isLoadingMCPs } = useListMCPs();
  const { mutate: createAgent, isPending: isCreating } = useCreateAgent();
  const { mutate: updateAgent, isPending: isUpdating } = useUpdateAgent();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      icon: "",
      version: "",
      sys_instruction: "",
      AgentMcpIds: [],
    },
  });

  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);

  const onSubmit = async (formData: CreateAgentFormData) => {
    if (editingAgent) {
      // Update mode
      const originalMcpIds = editingAgent.AgentTools.map((tool) => tool.id);
      const newMcpIds = formData.AgentMcpIds;

      const newAgentTools = newMcpIds.filter(
        (id) => !originalMcpIds.includes(id)
      );
      const deleteAgentTools = originalMcpIds.filter(
        (id) => !newMcpIds.includes(id)
      );

      updateAgent(
        {
          id: editingAgent.id,
          input: {
            name:
              formData.name !== editingAgent.name ? formData.name : undefined,
            icon:
              formData.icon !== editingAgent.icon ? formData.icon : undefined,
            version:
              formData.version !== editingAgent.version
                ? formData.version
                : undefined,
            sys_instruction:
              formData.sys_instruction !== editingAgent.sys_instruction
                ? formData.sys_instruction
                : undefined,
            newAgentTools: newAgentTools.length > 0 ? newAgentTools : undefined,
            deleteAgentTools:
              deleteAgentTools.length > 0 ? deleteAgentTools : undefined,
          },
        },
        {
          onSuccess: (data) => {
            console.log("Agent updated successfully:", data.updateAgent);
            toast.success("Agent updated successfully");
            setShowModal(false);
            setEditingAgent(null);
            reset();
          },
          onError: (error) => {
            console.error("Failed to update agent:", error);
            toast.error("Failed to update agent. Please try again.");
          },
        }
      );
    } else {
      // Create mode
      createAgent(formData, {
        onSuccess: (data) => {
          console.log("Agent created successfully:", data.createAgent);
          toast.success("Agent created successfully");
          setShowModal(false);
          reset();
        },
        onError: (error) => {
          console.error("Failed to create agent:", error);
          toast.error("Failed to create agent. Please try again.");
        },
      });
    }
  };

  const openCreateModal = () => {
    setEditingAgent(null);
    reset();
    setShowModal(true);
  };

  const openEditModal = (agent: AgentItem) => {
    setEditingAgent(agent);
    reset({
      name: agent.name,
      icon: agent.icon,
      version: agent.version,
      sys_instruction: agent.sys_instruction,
      AgentMcpIds: agent.AgentTools.map((tool) => tool.id),
    });
    setShowModal(true);
  };

  // Filter Agents based on debounced search
  const filteredAgents = useMemo(() => {
    const agents = data?.agents || [];
    return agents.filter((agent) => {
      if (!debouncedSearch.trim()) return true;

      const searchLower = debouncedSearch.toLowerCase();
      return (
        agent.name.toLowerCase().includes(searchLower) ||
        agent.sys_instruction.toLowerCase().includes(searchLower) ||
        agent.status.toLowerCase().includes(searchLower) ||
        agent.AgentTools.some(
          (mcpTool) =>
            mcpTool.name.toLowerCase().includes(searchLower) ||
            mcpTool.description.toLowerCase().includes(searchLower) ||
            mcpTool.Tools.some((tool) =>
              tool.name.toLowerCase().includes(searchLower)
            )
        )
      );
    });
  }, [data?.agents, debouncedSearch]);

  return (
    <section className="admin-agents section-page sys_container">
      <div className="headline">
        <div>
          <h2>System Agents</h2>
          <p>Manage all Agents in the system</p>
        </div>

        <div className="actions">
          <Button theme="primary" onClick={openCreateModal}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Create Agent</span>
          </Button>
        </div>
      </div>

      <div className="search-section">
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(value: string) => {
            setSearch(value);
          }}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center gap-2 w-full glass-bg">
          <Loader />
          Loading...
        </div>
      )}

      <div className="agents-list">
        {filteredAgents?.map((agent) => (
          <AgentDisplayCard
            key={agent.id}
            agent={agent}
            onEdit={openEditModal}
          />
        ))}

        {filteredAgents?.length === 0 && debouncedSearch.trim() && (
          <div className="no-results">
            <p>No Agents found matching "{debouncedSearch}"</p>
          </div>
        )}

        {filteredAgents?.length === 0 &&
          !debouncedSearch.trim() &&
          !isLoading && (
            <div className="no-results">
              <p>No Agents available</p>
            </div>
          )}
      </div>

      <Modal
        open={showModal}
        title={editingAgent ? "Edit Agent" : "Create New Agent"}
        onClose={() => {
          setShowModal(false);
          setEditingAgent(null);
        }}
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
                  <p>Upload Agent Icon</p>
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
                  label="Agent Name"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="e.g., Notion-Agent"
                />
              )}
            />

            <Controller
              control={control}
              name="version"
              render={({ field, fieldState }) => (
                <Input
                  label="Version"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="e.g., 1.0.0"
                />
              )}
            />

            <div className="full-w">
              <Controller
                control={control}
                name="sys_instruction"
                render={({ field, fieldState }) => (
                  <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    placeholder="Enter system instructions for the agent..."
                    rows={6}
                  ></Textarea>
                )}
              />
            </div>

            <div className="full-w">
              <Controller
                control={control}
                name="AgentMcpIds"
                render={({ field, fieldState }) => (
                  <MultiSelectDropdown
                    label="Select MCP Tools"
                    placeholder="Select MCP tools for this agent..."
                    options={mcpsData?.mcps || []}
                    selectedIds={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    disabled={isLoadingMCPs}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              theme="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingAgent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              theme="primary"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader />
              ) : editingAgent ? (
                "Update Agent"
              ) : (
                "Create Agent"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default AdminAgentsList;
