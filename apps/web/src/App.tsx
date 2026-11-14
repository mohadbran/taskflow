import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  message: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    async function checkApi() {
      const response = await fetch("/api/health");

      const data: HealthResponse = await response.json();

      setHealth(data);
    }

    checkApi();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          TaskFlow
        </h1>

        <p className="mt-2 text-gray-600">
          Full-stack TypeScript application
        </p>

        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            API status
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {health?.message ?? "Checking API..."}
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;