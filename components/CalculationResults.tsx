interface CalculationResultItem {
  label: string;
  value: number;
  color: string;
  isPercentage?: boolean;
}

interface CalculationResultsProps {
  results: CalculationResultItem[];
}

export function CalculationResults({ results }: CalculationResultsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {results.map((result) => {
        // Handle undefined or null values
        if (!result || typeof result.value === "undefined") {
          return (
            <div key={`error-${Math.random()}`} className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-600">Error: Invalid data</p>
            </div>
          );
        }

        // Format the value with proper number handling
        const formattedValue = (() => {
          try {
            if (result.isPercentage) {
              return `${Number(result.value).toFixed(2)}%`;
            }
            return `₹${Number(result.value).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })}`;
          } catch (error) {
            return "Error formatting value";
          }
        })();

        return (
          <div key={result.label} className="bg-gray-50 p-4 rounded-md hover:shadow-md transition-shadow duration-200">
            <p className="text-sm text-gray-600 mb-1">{result.label}</p>
            <p className={`text-lg font-semibold ${result.color || "text-gray-900"}`}>{formattedValue}</p>
          </div>
        );
      })}
    </div>
  );
}
