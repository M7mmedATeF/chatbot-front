import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import "./CreateTeam.css";
import Input from "../../../components/Input/Input";
import Textarea from "../../../components/Textarea/Textarea";
import Button from "../../../components/Button/Button";
import Image from "../../../components/Image/Image";
import {
  createTeamMutation,
  type CreateTeamVariables,
} from "../../../../services/Mutations/Workspace.gql";
import { useActiveTeam } from "../../../../stores/team.store";

// Zod validation schema
const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be less than 50 characters"),
  sys_instruction: z
    .string()
    .max(500, "System instructions must be less than 500 characters")
    .optional(),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

const CreateTeam = ({ editMode = false }: { editMode?: boolean }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { wsId } = useParams();
  const { setActiveTeam }: any = useActiveTeam();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      sys_instruction: "",
    },
  });

  const createTeam = useMutation({
    mutationFn: createTeamMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      toast.success("Team created successfully");
      reset();
      // Set the newly created team as active and navigate
      const teamWithDates = {
        ...data.createTeam,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActiveTeam(teamWithDates);
      navigate(`/workspace/${wsId}/team/${data.createTeam.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the team");
    },
  });

  const onSubmit = (data: CreateTeamForm) => {
    const teamData: CreateTeamVariables = {
      createTeamInput: {
        name: data.name,
      },
    };

    createTeam.mutate(teamData);
  };

  return (
    <section className="createWS">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="headline">
          <h3>{editMode ? "Edit Team Information" : "Team Information"}</h3>
        </div>
        <div className="info-box form-box">
          <label htmlFor="image" className="image_input">
            <Image src="https://placehold.co/200" alt="Team" />
            <input type="file" name="image" id="image" accept="image/*" />
          </label>

          <div className="column-input">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Team Name"
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
            disabled={isSubmitting || createTeam.isPending}
          >
            {isSubmitting || createTeam.isPending
              ? "Creating..."
              : "Create Team"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateTeam;
