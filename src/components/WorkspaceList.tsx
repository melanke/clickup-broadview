import React, { useState } from "react";
import { useWorkspaces } from "../data/clickup.ts";
import { FaChevronRight } from "react-icons/fa";
import SpaceList from "./SpaceList.tsx";

const WorkspaceList: React.FC = () => {
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const [expandedWorkspaceIds, setExpandedWorkspaceIds] = useState<string[]>(
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (workspaceId: string, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      if (expandedWorkspaceIds.length === workspaces?.length) {
        setExpandedWorkspaceIds([]);
      } else {
        setExpandedWorkspaceIds(workspaces?.map((w) => w.id) || []);
      }
    } else {
      setExpandedWorkspaceIds((prev: string[]) =>
        prev.includes(workspaceId)
          ? prev.filter((id) => id !== workspaceId)
          : [...prev, workspaceId]
      );
    }
  };

  return (
    <div>
      {workspaces?.map((workspace) => (
        <div key={workspace.id}>
          <div
            className="p-2 border-b flex items-center cursor-pointer hover:bg-gray-50"
            onClick={(e) => handleClick(workspace.id, e)}
            title="Ctrl+Click to toggle all"
          >
            <FaChevronRight
              className={`h-5 w-5 mr-2 transition-transform ${
                expandedWorkspaceIds.includes(workspace.id)
                  ? "transform rotate-90"
                  : ""
              }`}
            />
            {workspace.name}
          </div>
          {expandedWorkspaceIds.includes(workspace.id) && (
            <div className="pl-6">
              <SpaceList workspaceId={workspace.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkspaceList;
