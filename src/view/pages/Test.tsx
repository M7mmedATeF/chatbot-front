import Button from "../components/Button/Button";
import Checkbox from "../components/Checkbox/Checkbox";
import Input from "../components/Input/Input";
import Loader from "../components/Loader/Loader";
import FileInput from "../components/FileInput/FileInput";
import RadioButton from "../components/RadioButton/RadioButton";
import PasswordInput from "../components/PasswordInput/PasswordInput";

const Test = () => {
  return (
    <table className="test">
      <tr>
        <td>Button:</td>
        <td>
          <Button>None</Button>
        </td>
        <td>
          <Button theme="borderd">borderd</Button>
        </td>
        <td>
          <Button theme="primary">Primary</Button>
        </td>
        <td>
          <Button theme="secondary">Secondary</Button>
        </td>
        <td>
          <Button theme="success">Success</Button>
        </td>
        <td>
          <Button theme="warning">Warning</Button>
        </td>
        <td>
          <Button theme="danger">Danger</Button>
        </td>
      </tr>
      <tr>
        <td>Checkbox:</td>
        <td>
          <Checkbox>None</Checkbox>
        </td>
        <td>
          <Checkbox theme="primary">Primary</Checkbox>
        </td>
        <td>
          <Checkbox theme="secondary">Secondary</Checkbox>
        </td>
        <td>
          <Checkbox theme="success">Success</Checkbox>
        </td>
        <td>
          <Checkbox theme="warning">Warning</Checkbox>
        </td>
        <td>
          <Checkbox theme="danger">Danger</Checkbox>
        </td>
      </tr>
      <tr>
        <td>RadioButton:</td>
        <td>
          <RadioButton name="radio">None</RadioButton>
        </td>
        <td>
          <RadioButton name="radio" theme="primary">
            Primary
          </RadioButton>
        </td>
        <td>
          <RadioButton name="radio" theme="secondary">
            Secondary
          </RadioButton>
        </td>
        <td>
          <RadioButton name="radio" theme="success">
            Success
          </RadioButton>
        </td>
        <td>
          <RadioButton name="radio" theme="warning">
            Warning
          </RadioButton>
        </td>
        <td>
          <RadioButton name="radio" theme="danger">
            Danger
          </RadioButton>
        </td>
      </tr>
      <tr>
        <td>PasswordInput:</td>
        <td>
          <PasswordInput placeholder="Password" />
        </td>
      </tr>
      <tr>
        <td>Input:</td>
        <td>
          <Input placeholder="Input" />
        </td>
      </tr>
      <tr>
        <td>Loader:</td>
        <td>
          <Loader />
        </td>
      </tr>
      <tr>
        <td>FileInput:</td>
        <td>
          <FileInput placeholder="File Input" />
        </td>
      </tr>
    </table>
  );
};

export default Test;
