import Button from "../../../components/Button/Button";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";

const SecuritySettings = () => {
  return (
    <section className="account-settings-page">
      <div className="headline">
        <h3>Security Settings</h3>
      </div>

      <form className="column-input">
        <PasswordInput placeholder="Old Password" />
        <PasswordInput placeholder="New Password" />
        <PasswordInput placeholder="Confirm New Password" />

        <div className="form-footer">
          <Button theme="primary">Save Updates</Button>
        </div>
      </form>
    </section>
  );
};

export default SecuritySettings;
