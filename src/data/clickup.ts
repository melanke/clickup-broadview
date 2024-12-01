import { useQuery } from "@tanstack/react-query";

export interface Workspace {
  id: string;
  name: string;
}

export interface Space {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface List {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  custom_fields: {
    type: string;
    value?: { id: string }[];
  }[];
}

const fetchWorkspaces = async (): Promise<Workspace[]> => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const response = await fetch("https://api.clickup.com/api/v2/team", {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.teams || [];
};

const fetchSpaces = async (workspaceId: string): Promise<Space[]> => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const response = await fetch(
    `https://api.clickup.com/api/v2/team/${workspaceId}/space?archived=false`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.spaces || [];
};

const fetchFolders = async (spaceId: string): Promise<Folder[]> => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const response = await fetch(
    `https://api.clickup.com/api/v2/space/${spaceId}/folder?archived=false`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.folders || [];
};

const fetchLists = async (folderId: string): Promise<List[]> => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const response = await fetch(
    `https://api.clickup.com/api/v2/folder/${folderId}/list?archived=false`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.lists || [];
};

const fetchTasks = async (listId: string | string[]): Promise<Task[]> => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  if (Array.isArray(listId)) {
    // Se for um array de IDs de tarefas, busca cada tarefa individualmente
    const taskPromises = listId.map(async (taskId) => {
      const response = await fetch(
        `https://api.clickup.com/api/v2/task/${taskId}?custom_task_ids=true&include_subtasks=true`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // A API retorna a tarefa diretamente, sem estar em um array
    });

    return Promise.all(taskPromises);
  } else {
    // Se for um ID de lista, busca todas as tarefas da lista
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?archived=false`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tasks || [];
  }
};

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
  });
};

export const useSpaces = (workspaceId: string) => {
  return useQuery({
    queryKey: ["spaces", workspaceId],
    queryFn: () => fetchSpaces(workspaceId),
  });
};

export const useFolders = (spaceId: string) => {
  return useQuery({
    queryKey: ["folders", spaceId],
    queryFn: () => fetchFolders(spaceId),
  });
};

export const useLists = (folderId: string) => {
  return useQuery({
    queryKey: ["lists", folderId],
    queryFn: () => fetchLists(folderId),
  });
};

export const useTasks = (listId: string | string[]) => {
  return useQuery({
    queryKey: ["tasks", listId],
    queryFn: () => fetchTasks(listId),
  });
};
