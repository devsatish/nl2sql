import React, { useState } from "react";
import Header from "./components/Header";
import QueryForm from "./components/QueryForm";
import ResultDisplay from "./components/ResultDisplay";
import { QueryResult } from "./types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const App: React.FC = () => {
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/nl2sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data: QueryResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <QueryForm onSubmit={handleSubmit} isLoading={isLoading} />
                <ResultDisplay result={result} error={error} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
