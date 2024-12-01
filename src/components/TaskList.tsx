import React, { useState, useMemo } from "react";
import { Task, useTasks } from "../data/clickup.ts";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";

interface TaskListProps {
  listId: string | string[];
}

const TaskList: React.FC<TaskListProps> = ({ listId }: TaskListProps) => {
  const { data: tasks, isLoading, error } = useTasks(listId);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  const handleClick = (taskId: string, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      if (expandedTaskIds.length === tasks?.length) {
        setExpandedTaskIds([]);
      } else {
        setExpandedTaskIds(tasks?.map((f) => f.id) || []);
      }
    } else {
      setExpandedTaskIds((prev: string[]) =>
        prev.includes(taskId)
          ? prev.filter((id) => id !== taskId)
          : [...prev, taskId]
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const getRelatedTasks = (task: Task) => {
    const relationshipField = task.custom_fields.find(
      (field) => field.type === "list_relationship"
    );

    if (relationshipField && relationshipField.value) {
      return relationshipField.value.map((item) => item.id);
    }

    return [];
  };

  return (
    <div>
      {tasks?.map((task) => (
        <div key={task.id}>
          <div
            className="p-2 border-b flex cursor-pointer hover:bg-gray-50"
            onClick={(e) => handleClick(task.id, e)}
            title="Ctrl+Click to toggle all"
          >
            <FaChevronRight
              className={`h-5 w-5 mr-2 mt-1 shrink-0 transition-transform ${
                expandedTaskIds.includes(task.id) ? "transform rotate-90" : ""
              }`}
            />
            <div>
              <div className="float-left whitespace-nowrap mr-2 flex items-center">
                {task.name}
              </div>
              <div className="pl-6 text-sm text-gray-500">
                {task.description}
              </div>
            </div>
            <a
              href={`https://app.clickup.com/t/${task.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
            >
              <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
          {expandedTaskIds.includes(task.id) && (
            <div className="pl-6">
              <TaskList listId={getRelatedTasks(task)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
