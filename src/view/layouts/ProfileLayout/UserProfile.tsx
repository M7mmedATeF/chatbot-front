import "./ProfileLayout.css";
import Image from "../../components/Image/Image";
import Button from "../../components/Button/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link, Outlet } from "react-router";
import { useUser } from "../../../stores/user.store";
import { useWorkspaces } from "../../../hooks/useWorkspaces";

const ProfileLayout = () => {
  const { user } = useUser() as any;
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();

  console.log(user);

  return (
    <section className="user-profile-page section-page sys_container">
      <aside>
        <div className="glass-bg user-card profile-card">
          <Image
            className="avatar profile-img"
            src="http://placehold.co/60"
            alt="user"
          />
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

        <div className="glass-bg profile-card">
          <div className="headline">
            <h4>My Workspaces</h4>
            <Button>
              <AiOutlineArrowRight />
            </Button>
          </div>

          <ul className="workspaces-list">
            {workspacesLoading ? (
              <li>Loading workspaces...</li>
            ) : (
              workspaces?.myWorkspaces?.map((workspace) => (
                <li key={workspace.id}>
                  <Link to={`/workspace/${workspace.id}`}>
                    <img
                      className="avatar"
                      src="http://placehold.co/60"
                      alt="workspace"
                    />
                    <div>
                      <p className="name">{workspace.name}</p>
                      <p className="position">Member</p>
                    </div>
                  </Link>
                </li>
              ))
            )}
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
