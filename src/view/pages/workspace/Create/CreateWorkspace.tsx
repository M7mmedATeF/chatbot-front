import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import "./CreateWorkspace.css";
import Input from "../../../components/Input/Input";
import Textarea from "../../../components/Textarea/Textarea";
import Button from "../../../components/Button/Button";
import ImageInput from "../../../components/ImageInput/ImageInput";
import {
  createWorkspaceMutation,
  type CreateWorkspaceVariables,
} from "../../../../services/Mutations/Workspace.gql";
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

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { setActiveWorkspace }: any = useActiveWorkspace();

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

  const onSubmit = (data: CreateWorkspaceForm) => {
    const workspaceData: CreateWorkspaceVariables = {
      createWorkspaceInput: {
        name: data.name,
        sys_instruction: data.sys_instruction || null,
      },
    };

    createWorkspace.mutate(workspaceData);
  };

  return (
    <section className="createWS section-page sys_container">
      <h2>Create Workspace</h2>
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
            disabled={isSubmitting || createWorkspace.isPending}
          >
            {isSubmitting || createWorkspace.isPending
              ? "Creating..."
              : "Create Workspace"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateWorkspace;
