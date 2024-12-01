import React, { useState } from "react";
import { useLists } from "../data/clickup.ts";
import { FaChevronRight } from "react-icons/fa";
import TaskList from "./TaskList.tsx";

interface ListListProps {
  folderId: string;
}

const ListList: React.FC<ListListProps> = ({ folderId }: ListListProps) => {
  const { data: lists, isLoading, error } = useLists(folderId);
  const [expandedListIds, setExpandedListIds] = useState<string[]>([]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleClick = (listId: string, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      if (expandedListIds.length === lists?.length) {
        setExpandedListIds([]);
      } else {
        setExpandedListIds(lists?.map((l) => l.id) || []);
      }
    } else {
      setExpandedListIds((prev: string[]) =>
        prev.includes(listId)
          ? prev.filter((id) => id !== listId)
          : [...prev, listId]
      );
    }
  };

  return (
    <div>
      {lists?.map((list) => (
        <div key={list.id}>
          <div
            className="p-2 border-b flex items-center cursor-pointer hover:bg-gray-50"
            onClick={(e) => handleClick(list.id, e)}
            title="Ctrl+Click to toggle all"
          >
            <FaChevronRight
              className={`h-5 w-5 mr-2 transition-transform ${
                expandedListIds.includes(list.id) ? "transform rotate-90" : ""
              }`}
            />
            {list.name}
          </div>
          {expandedListIds.includes(list.id) && (
            <div className="pl-6">
              <TaskList listId={list.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListList;
