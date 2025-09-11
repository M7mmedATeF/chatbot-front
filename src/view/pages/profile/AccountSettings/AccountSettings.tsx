import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Input from "../../../components/Input/Input";
import "./AccountSettings.css";
import Button from "../../../components/Button/Button";
import ImageInput from "../../../components/ImageInput/ImageInput";
import {
  updateUserMutation,
  type UpdateUserVariables,
} from "../../../../services/Mutations/User.gql";
import { useUser } from "../../../../stores/user.store";
import { Controller } from "react-hook-form";
// Zod validation schema
const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

const AccountSettings = () => {
  const { user, updateUser: updateUserStore } = useUser() as any;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateUser = useMutation({
    mutationFn: updateUserMutation,
    onSuccess: (data) => {
      // Update the user store with new data
      updateUserStore(data.updateUser);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Data updated successfully");
      reset({
        name: data.updateUser.name,
        email: data.updateUser.email,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while updating");
    },
  });

  const onSubmit = (data: UpdateUserForm) => {
    const updateData: UpdateUserVariables = {
      updateUserInput: {
        name: data.name,
        email: data.email,
      },
    };

    updateUser.mutate(updateData);
  };

  return (
    <section className="account-settings-page">
      <div className="headline">
        <h3>Account Settings</h3>
      </div>

      <form className="column-input" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-img">
          <ImageInput preview="https://placehold.co/200" onChange={() => {}} />
          <div className="img-specification">
            <p>Upload Profile Image</p>
            <small>Supported Formats: .jpg, .png, .svg, .webp</small>
            <small>Maximum Size: 2MB</small>
            <Button theme="danger">Remove Image</Button>
          </div>
        </div>

        <div>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder="Name"
                error={error?.message}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder="Email"
                type="email"
                error={error?.message}
              />
            )}
          />
        </div>

        <div className="form-footer">
          <Button
            theme="primary"
            type="submit"
            disabled={isSubmitting || updateUser.isPending}
          >
            {isSubmitting || updateUser.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AccountSettings;
