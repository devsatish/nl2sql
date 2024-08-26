import React from "react";
import { QueryResult } from "../types";

interface ResultDisplayProps {
  result: QueryResult | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const isTableData =
    Array.isArray(result.result) &&
    result.result.length > 0 &&
    typeof result.result[0] === "object";

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900">Query Result:</h2>
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Generated SQL Query
          </h3>
          <div className="mt-2 max-w-2xl text-sm text-gray-500">
            <pre className="whitespace-pre-wrap">{result.query}</pre>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Result
          </h3>
          <div className="mt-2 max-w-2xl text-sm text-gray-500">
            {isTableData ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(result.result[0]).map((key) => (
                        <th
                          key={key}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.result.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
