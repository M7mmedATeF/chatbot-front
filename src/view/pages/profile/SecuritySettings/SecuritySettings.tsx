import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button/Button";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import {
  updateUserPasswordMutation,
  type UpdateUserPasswordVariables,
} from "../../../../services/Mutations/User.gql";
import { useUser } from "../../../../stores/user.store";

// Zod validation schema for password update
const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Old password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  });

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

const SecuritySettings = () => {
  const { updateUser: updateUserStore } = useUser() as any;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updatePassword = useMutation({
    mutationFn: updateUserPasswordMutation,
    onSuccess: (data) => {
      // Update the user store with new data
      updateUserStore(data.updateUserPassword);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Password updated successfully");
      reset(); // Clear the form after success
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while updating the password"
      );
    },
  });

  const onSubmit = (data: UpdatePasswordForm) => {
    const updateData: UpdateUserPasswordVariables = {
      updateUserPasswordInput: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
    };

    updatePassword.mutate(updateData);
  };

  return (
    <section className="account-settings-page">
      <div className="headline">
        <h3>Security Settings</h3>
      </div>

      <form className="column-input" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="oldPassword"
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Old Password"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              value={field.value}
              onChange={field.onChange}
              placeholder="New Password"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Confirm New Password"
              error={error?.message}
            />
          )}
        />

        <div className="form-footer">
          <Button
            theme="primary"
            type="submit"
            disabled={isSubmitting || updatePassword.isPending}
          >
            {isSubmitting || updatePassword.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SecuritySettings;
