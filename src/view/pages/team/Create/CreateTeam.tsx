import "./CreateTeam.css";
import Input from "../../../components/Input/Input";
import Textarea from "../../../components/Textarea/Textarea";
import Button from "../../../components/Button/Button";
import Image from "../../../components/Image/Image";

const CreateTeam = ({ editMode = false }: { editMode?: boolean }) => {
  return (
    <section className="createWS">
      <form>
        <div className="headline">
          <h3>Team Information</h3>
        </div>
        <div className="info-box form-box">
          <label htmlFor="image" className="image_input">
            <Image src="https://placehold.co/200" alt="Team" />
            <input type="file" name="image" id="image" accept="image/*" />
          </label>

          <div className="column-input">
            <Input placeholder="Team Name" />
            <Textarea placeholder="General system instructions" />
          </div>
        </div>

        <div className="form-footer">
          <Button theme="primary">Create Team</Button>
        </div>
      </form>
    </section>
  );
};

export default CreateTeam;
