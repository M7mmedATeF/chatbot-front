import "./UserProfile.css";
import {
  AiOutlineArrowRight,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import { Link } from "react-router";
import Button from "../../../components/Button/Button";

const UserProfile = () => {
  return (
    <div className="glass-bg profile-page profile-routing-page">
      <table className="table">
        <tbody>
          <tr>
            <Link to="settings">
              <th>
                <div className="Entry">
                  <AiOutlineUser size={25} />
                  <p>User Account</p>
                </div>
              </th>
              <td>
                <div className="Entry-value">
                  <div>
                    <p>Update your user account settings.</p>
                    <small>
                      Keep your account updated for a better experience.
                    </small>
                  </div>
                  <Button>
                    <AiOutlineArrowRight size={20} />
                  </Button>
                </div>
              </td>
            </Link>
          </tr>
          <tr>
            <Link to="settings/security">
              <th>
                <div className="Entry">
                  <AiOutlineLock size={25} />
                  <p>Security Settings</p>
                </div>
              </th>
              <td>
                <div className="Entry-value">
                  <div>
                    <p>Update your security settings.</p>
                    <small>
                      Don't share your security information with anyone.
                    </small>
                  </div>
                  <Button>
                    <AiOutlineArrowRight size={20} />
                  </Button>
                </div>
              </td>
            </Link>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
