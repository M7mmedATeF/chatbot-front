import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import "./RoomLayout.css";
import bot from "../../../assets/images/bot.png";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import {
  AiOutlinePlus,
  AiOutlineRobot,
  AiOutlineSetting,
} from "react-icons/ai";

const RoomLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const { wsId, teamId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  return (
    <main className="room-layout">
      <div className="rooms-sidebar glass-bg">
        <div className="headline">
          <h1>Rooms</h1>

          <div className="actions">
            <Button
              href={`/workspace/${wsId}/team/${teamId}/agents`}
              className="tooltip tooltip-bottom"
              data-tooltip="Team Agents"
            >
              <AiOutlineRobot />
            </Button>

            <Button
              className="tooltip tooltip-bottom"
              data-tooltip="Team Settings"
              onClick={() =>
                setSearchParams({ edit: "team" }, { replace: true })
              }
            >
              <AiOutlineSetting />
            </Button>
          </div>
        </div>

        <div className="search-area">
          <Input className="search-input" placeholder="Search for a room" />
          <Button theme="borderd" onClick={() => setShowCreate(true)}>
            <AiOutlinePlus size={18} />
          </Button>
        </div>

        <div className="rooms-list">
          {Array.from({ length: 10 }).map((_, index) => (
            <div>
              <NavLink to={`room/${index}`} className="room-item">
                Lorem ipsum dolor sit amet consectetur
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      <div className="view-area">
        <Outlet />
      </div>

      <Modal
        open={showCreate}
        title="Create Room"
        onClose={() => setShowCreate(false)}
        onSave={() => {
          setShowCreate(false);
          nav(`room/0`);
        }}
        size="sm"
      >
        <Input
          value={name}
          onChange={(e: any) => setName(e)}
          placeholder="Room Name"
        />
      </Modal>
    </main>
  );
};

export const SelectRoom = () => {
  return (
    <>
      <div className="select-workspace-area">
        <img src={bot} alt="bot" />
        <h1>Let's Start Conversation</h1>
        <p>Select a room to start your conversation</p>
      </div>
    </>
  );
};

export default RoomLayout;
