import Input from "../../../components/Input/Input";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import Button from "../../../components/Button/Button";
import "./LoginPage.css";
import { useRouter } from "../../../../router/useRouter";
import { activeRoutes } from "../../../../router/ActiveRoutes";

const LoginPage = ({ isAdmin = false }) => {
  const REGISTER_ROUTE = useRouter(activeRoutes.auth.register);
  return (
    <section className="auth-page">
      <div className="form-box glass-bg">
        <h1>{isAdmin ? "Admin Login" : "Login"}</h1>
        <form>
          <Input placeholder="Email" />
          <PasswordInput placeholder="Password" />
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
                <Button href={REGISTER_ROUTE} theme="borderd">
                  Join us
                </Button>
                <Button theme="borderd">Login</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
