import React, { useState } from "react";
import { useFolders } from "../data/clickup.ts";
import { FaChevronRight } from "react-icons/fa";
import ListList from "./ListList.tsx";

interface FolderListProps {
  spaceId: string;
}

const FolderList: React.FC<FolderListProps> = ({
  spaceId,
}: FolderListProps) => {
  const { data: folders, isLoading, error } = useFolders(spaceId);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);

  const handleClick = (folderId: string, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      if (expandedFolderIds.length === folders?.length) {
        setExpandedFolderIds([]);
      } else {
        setExpandedFolderIds(folders?.map((f) => f.id) || []);
      }
    } else {
      setExpandedFolderIds((prev: string[]) =>
        prev.includes(folderId)
          ? prev.filter((id) => id !== folderId)
          : [...prev, folderId]
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {folders?.map((folder) => (
        <div key={folder.id}>
          <div
            className="p-2 border-b flex items-center cursor-pointer hover:bg-gray-50"
            onClick={(e) => handleClick(folder.id, e)}
            title="Ctrl+Click to toggle all"
          >
            <FaChevronRight
              className={`h-5 w-5 mr-2 transition-transform ${
                expandedFolderIds.includes(folder.id)
                  ? "transform rotate-90"
                  : ""
              }`}
            />
            {folder.name}
          </div>
          {expandedFolderIds.includes(folder.id) && (
            <div className="pl-6">
              <ListList folderId={folder.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderList;
