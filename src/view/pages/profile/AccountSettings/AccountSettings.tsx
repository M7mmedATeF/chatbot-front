import Input from "../../../components/Input/Input";
import "./AccountSettings.css";
import Button from "../../../components/Button/Button";
import ImageInput from "../../../components/ImageInput/ImageInput";

const AccountSettings = () => {
  return (
    <section className="account-settings-page">
      <div className="headline">
        <h3>Account Settings</h3>
      </div>

      <form className="column-input">
        <div className="profile-img">
          <ImageInput preview="https://placehold.co/200" onChange={() => {}} />
          <div className="img-specification">
            <p>Upload a profile image</p>
            <small>Accepts: .jpg, .png, .svg, .webp</small>
            <small>Max size: 2MB</small>
            <Button theme="danger">Remove Image</Button>
          </div>
        </div>
        <Input placeholder="Name" />

        <div className="form-footer">
          <Button theme="primary">Save Updates</Button>
        </div>
      </form>
    </section>
  );
};

export default AccountSettings;
