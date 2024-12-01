import React, { useState } from "react";
import { useSpaces } from "../data/clickup.ts";
import { FaChevronRight } from "react-icons/fa";
import FolderList from "./FolderList";

interface SpaceListProps {
  workspaceId: string;
}

const SpaceList: React.FC<SpaceListProps> = ({
  workspaceId,
}: SpaceListProps) => {
  const { data: spaces, isLoading, error } = useSpaces(workspaceId);
  const [expandedSpaceIds, setExpandedSpaceIds] = useState<string[]>([]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (spaceId: string, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      if (expandedSpaceIds.length === spaces?.length) {
        setExpandedSpaceIds([]);
      } else {
        setExpandedSpaceIds(spaces?.map((s) => s.id) || []);
      }
    } else {
      setExpandedSpaceIds((prev) =>
        prev.includes(spaceId)
          ? prev.filter((id) => id !== spaceId)
          : [...prev, spaceId]
      );
    }
  };

  return (
    <div>
      {spaces?.map((space) => (
        <div key={space.id}>
          <div
            className="p-2 border-b flex items-center cursor-pointer hover:bg-gray-50"
            onClick={(e) => handleClick(space.id, e)}
            title="Ctrl+Click to toggle all"
          >
            <FaChevronRight
              className={`h-5 w-5 mr-2 transition-transform ${
                expandedSpaceIds.includes(space.id) ? "transform rotate-90" : ""
              }`}
            />
            {space.name}
          </div>
          {expandedSpaceIds.includes(space.id) && (
            <div className="pl-6">
              <FolderList spaceId={space.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SpaceList;
