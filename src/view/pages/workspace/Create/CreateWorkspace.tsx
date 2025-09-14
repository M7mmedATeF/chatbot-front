import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import "./CreateWorkspace.css";
import Input from "../../../components/Input/Input";
import Textarea from "../../../components/Textarea/Textarea";
import Button from "../../../components/Button/Button";
import ImageInput from "../../../components/ImageInput/ImageInput";
import {
  createWorkspaceMutation,
  updateWorkspaceMutation,
  type CreateWorkspaceVariables,
  type UpdateWorkspaceVariables,
} from "../../../../services/Mutations/Workspace.gql";
import {
  fetchWorkspace,
  type WorkspaceResponse,
} from "../../../../services/Queries/Workspaces.gql";
import { useActiveWorkspace } from "../../../../stores/workspace.store";

// Zod validation schema
const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be less than 50 characters"),
  sys_instruction: z
    .string()
    .max(500, "System instructions must be less than 500 characters")
    .optional(),
});

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

const CreateWorkspace = ({ editMode = false }: { editMode?: boolean }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { wsId } = useParams<{ wsId?: string }>();

  const { setActiveWorkspace }: any = useActiveWorkspace();

  // Set workspace in session storage when wsId changes (for edit mode)
  useEffect(() => {
    if (editMode && wsId) {
      const workspaceData = { state: { id: wsId } };
      sessionStorage.setItem("workspace", JSON.stringify(workspaceData));
    }
  }, [editMode, wsId]);

  // Fetch workspace data for edit mode
  const { data: workspaceData, isLoading: isLoadingWorkspace } =
    useQuery<WorkspaceResponse>({
      queryKey: ["workspace", wsId],
      queryFn: fetchWorkspace,
      enabled: editMode && !!wsId,
    });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      sys_instruction: "",
    },
  });

  // Update form when workspace data is loaded
  useEffect(() => {
    if (workspaceData?.workspace) {
      reset({
        name: workspaceData.workspace.name,
        sys_instruction: workspaceData.workspace.sys_instruction || "",
      });
    }
  }, [workspaceData, reset]);

  const createWorkspace = useMutation({
    mutationFn: createWorkspaceMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace created successfully");
      reset();
      // Navigate to the newly created workspace
      setActiveWorkspace(data.createWorkspace);
      navigate(`/workspace/${data.createWorkspace.id}`);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while creating the workspace"
      );
    },
  });

  const updateWorkspace = useMutation({
    mutationFn: updateWorkspaceMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", wsId] });
      toast.success("Workspace updated successfully");
      // Navigate back to workspace
      setActiveWorkspace(data.updateWorkspace);
      navigate(`/workspace/${data.updateWorkspace.id}`);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while updating the workspace"
      );
    },
  });

  const onSubmit = (data: CreateWorkspaceForm) => {
    if (editMode) {
      const workspaceData: UpdateWorkspaceVariables = {
        updateWorkspaceInput: {
          name: data.name,
          sys_instruction: data.sys_instruction || null,
        },
      };
      updateWorkspace.mutate(workspaceData);
    } else {
      const workspaceData: CreateWorkspaceVariables = {
        createWorkspaceInput: {
          name: data.name,
          sys_instruction: data.sys_instruction || null,
        },
      };
      createWorkspace.mutate(workspaceData);
    }
  };

  return (
    <section className="createWS section-page sys_container">
      <h2>{editMode ? "Edit Workspace" : "Create Workspace"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="headline">
          <h3>Workspace Information</h3>
        </div>
        <div className="info-box form-box">
          <ImageInput />

          <div className="column-input">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Workspace Name"
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="sys_instruction"
              render={({ field, fieldState: { error } }) => (
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="General system instructions (optional)"
                  error={error?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="form-footer">
          <Button
            theme="primary"
            type="submit"
            disabled={
              isSubmitting ||
              createWorkspace.isPending ||
              updateWorkspace.isPending ||
              isLoadingWorkspace
            }
          >
            {isLoadingWorkspace
              ? "Loading..."
              : isSubmitting ||
                createWorkspace.isPending ||
                updateWorkspace.isPending
              ? editMode
                ? "Updating..."
                : "Creating..."
              : editMode
              ? "Update Workspace"
              : "Create Workspace"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateWorkspace;
