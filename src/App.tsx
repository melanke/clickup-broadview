import ApiKeyInput from "./components/ApiKeyInput.tsx";
import WorkspaceList from "./components/WorkspaceList.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold my-2">Clickup Broadview</h1>
          <ApiKeyInput />
        </div>
        <WorkspaceList />
        <p className="text-sm text-gray-500">V0.1.0</p>
      </div>
    </QueryClientProvider>
  );
}

export default App;
