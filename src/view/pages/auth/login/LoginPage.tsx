import Input from "../../../components/Input/Input";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import Button from "../../../components/Button/Button";
import "./LoginPage.css";
import { useRouter as RouterParser } from "../../../../router/useRouter";
import { activeRoutes } from "../../../../router/ActiveRoutes";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../../../../hooks/useFetch";
import { UserLogin } from "../../../../services/Mutations/Auth.service";
import Loader from "../../../components/Loader/Loader";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useUser } from "../../../../stores/user.store";
import { useNavigate } from "react-router";

// (?=.*[!@#$%^&*])
const validation = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d=]{7,}$/,
      "Password must contain at least 7 characters, one letter, one number, and one special character (!@#$%^&*)"
    ),
});

const LoginPage = ({ isAdmin = false }) => {
  const nav = useNavigate();
  const fetch = useFetch();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(validation),
  });

  const { user, setUser }: any = useUser();

  const login = async (formdata: z.infer<typeof validation>) => {
    const response = await fetch(
      UserLogin,
      {
        error: true,
        success: true,
      },
      formdata
    );

    if (response.data) {
      const {
        loginUser: { token, ...userData },
      } = response.data;

      // Set token to cookies
      Cookies.set("TOKEN", token);

      setUser(userData);

      nav("/");
    }

    return response;
  };

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
  });

  return (
    <section className="auth-page">
      <div className="form-box glass-bg">
        <h1>{isAdmin ? "Admin Login" : "Login"}</h1>
        <form onSubmit={handleSubmit((data) => loginUser(data))}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <Input
                placeholder="Email"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <PasswordInput
                placeholder="Password"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />

          {isAdmin ? (
            <div className="form-actions form-actions-end">
              <Button theme="borderd">Login</Button>
            </div>
          ) : (
            <div className="form-actions">
              <Button href="#" className="forgot-password">
                Forgot Password?
              </Button>
              <div className="form-actions form-actions-end">
                <Button
                  href={RouterParser(activeRoutes.auth.register)}
                  theme="borderd"
                >
                  Join us
                </Button>
                <Button type="submit" theme="borderd" disabled={isPending}>
                  {isPending ? <Loader /> : "Login"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
