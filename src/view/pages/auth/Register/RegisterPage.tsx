import Input from "../../../components/Input/Input";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import Button from "../../../components/Button/Button";
import { RouteParser } from "../../../../router/RouteParser";
import { activeRoutes } from "../../../../router/ActiveRoutes";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../../../../hooks/useFetch";
import { UserRegister } from "../../../../services/Mutations/Auth.service";
import Cookies from "js-cookie";
import { useUser } from "../../../../stores/user.store";
import { useNavigate } from "react-router";
import Loader from "../../../components/Loader/Loader";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d=!@#$%^&*()_+]{7,}$/,
        "Password must contain at least 7 characters, one letter, one number, and one special character (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const nav = useNavigate();
  const fetch = useFetch();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { setUser }: any = useUser();

  const register = async (formdata: z.infer<typeof registerSchema>) => {
    console.log("formdata", formdata);

    const response = await fetch(
      UserRegister,
      {
        error: true,
        success: true,
      },
      {
        name: formdata.name,
        email: formdata.email,
        password: formdata.password,
      }
    );

    if (response.data) {
      const { token, ...userData } = response.data.registerUser;

      // Set token to cookies
      Cookies.set("USER", JSON.stringify(userData));
      Cookies.set("TOKEN", token);

      setUser(userData);

      // Navigate to dashboard
      nav("/");
    }

    return response;
  };

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
  });

  return (
    <section className="auth-page">
      <div className="form-box glass-bg">
        <h1>Register</h1>
        <form onSubmit={handleSubmit((data) => registerUser(data))}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                placeholder="Name"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                placeholder="Email"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                placeholder="Password"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                placeholder="Confirm Password"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <div className="form-actions">
            <Button
              href={RouteParser(activeRoutes.auth.login)}
              className="forgot-password"
            >
              Already have an account?
            </Button>

            <Button theme="borderd" type="submit" disabled={isPending}>
              {isPending && <Loader />}
              {isPending ? "Registering" : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
