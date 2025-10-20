import "./WorkspaceAgentsList.css";
import { useListAssignAgents } from "../../../../hooks/useListAssignAgents";
import AgentAssignCard from "../../../components/AgentAssignCard/AgentAssignCard";
import Loader from "../../../components/Loader/Loader";
import Input from "../../../components/Input/Input";
import { useMemo, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

const WorkspaceAgentsList = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: agentsData,
    isLoading: isLoadingList,
    refetch,
  } = useListAssignAgents();

  const viewAgents = useMemo(() => {
    return agentsData?.listAssignAgents?.filter((agentItem) => {
      return agentItem.agent.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [agentsData, debouncedSearch]);

  return (
    <section className="workspace-agents section-page sys_container">
      <div className="headline">
        <h2>Workspace Agents</h2>

        <div>
          <Input
            value={search}
            onChange={(e) => setSearch(e)}
            placeholder="Search agents..."
          />
        </div>
      </div>

      <div className="agents-list">
        {isLoadingList ? (
          <div className="loading">
            <Loader />
            Loading agents...
          </div>
        ) : viewAgents?.length || 0 > 0 ? (
          <>
            <div className="agents-list-column">
              {viewAgents
                ?.filter((_, idx: number) => idx % 2 === 0)
                .map((agentItem) => (
                  <AgentAssignCard
                    key={agentItem.agent.id}
                    agentData={agentItem}
                    onUpdate={refetch}
                  />
                ))}
            </div>
            <div className="agents-list-column">
              {viewAgents
                ?.filter((_, idx: number) => idx % 2 === 1)
                .map((agentItem) => (
                  <AgentAssignCard
                    key={agentItem.agent.id}
                    agentData={agentItem}
                    onUpdate={refetch}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>No agents found matching "{debouncedSearch}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkspaceAgentsList;
