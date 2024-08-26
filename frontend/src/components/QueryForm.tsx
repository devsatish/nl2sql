import React, { useState } from "react";

interface QueryFormProps {
  onSubmit: (query: string) => Promise<void>;
  isLoading: boolean;
}

const cannedQueries = [
  {
    label: "What are the tables in the database",
    query: "List tables in the database",
  },
];

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim().length === 0) {
      setInputError("Please enter a query");
      return;
    }
    setInputError(null);
    onSubmit(query);
  };

  const handleCannedQuery = (cannedQuery: string) => {
    setQuery(cannedQuery);
    setInputError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {cannedQueries.map((cq, index) => (
          <button
            key={index}
            onClick={() => handleCannedQuery(cq.query)}
            className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cq.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700"
          >
            Enter a query to interact with the movie store database:
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setInputError(null);
            }}
            className={`mt-1 block w-full border ${
              inputError ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            rows={4}
            required
          />
          {inputError && (
            <p className="mt-2 text-sm text-red-600">{inputError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? <>Processing...</> : "Submit Query"}
        </button>
      </form>
    </div>
  );
};

export default QueryForm;
