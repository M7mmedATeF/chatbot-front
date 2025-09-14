import Input from "../../../components/Input/Input";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import Button from "../../../components/Button/Button";
import { RouteParser } from "../../../../router/RouteParser";
import { activeRoutes } from "../../../../router/ActiveRoutes";

const RegisterPage = () => {
  return (
    <section className="auth-page">
      <div className="form-box glass-bg">
        <h1>Register</h1>
        <form>
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <PasswordInput placeholder="Password" />
          <PasswordInput placeholder="Confirm Password" />
          <div className="form-actions">
            <Button
              href={RouteParser(activeRoutes.auth.login)}
              className="forgot-password"
            >
              Already have an account?
            </Button>

            <Button theme="borderd">Register</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
