import "./ProfileLayout.css";
import Image from "../../components/Image/Image";
import Button from "../../components/Button/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link, Outlet } from "react-router";

const ProfileLayout = () => {
  return (
    <section className="user-profile-page section-page sys_container">
      <aside>
        <div className="glass-bg user-card profile-card">
          <Image
            className="avatar profile-img"
            src="http://placehold.co/60"
            alt="user"
          />
          <h3>John Doe</h3>
          <p>john.doe@chatbot.com</p>
        </div>

        <div className="glass-bg profile-card">
          <div className="headline">
            <h4>My Workspaces</h4>
            <Button>
              <AiOutlineArrowRight />
            </Button>
          </div>

          <ul className="workspaces-list">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Link to={`/workspace/${index}`}>
                  <img
                    className="avatar"
                    src="http://placehold.co/60"
                    alt="workspace"
                  />
                  <div>
                    <p className="name">Workspace {index + 1}</p>
                    <p className="position">
                      {index === 0
                        ? "Owner"
                        : index === 1
                        ? "Moderator"
                        : "Employee"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div>
        <Outlet />
      </div>
    </section>
  );
};

export default ProfileLayout;
