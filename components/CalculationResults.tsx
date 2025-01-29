interface SIPCalculation {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  annualizedReturn: number;
}

interface CalculationResultsProps {
  calculation: SIPCalculation;
}

export function CalculationResults({ calculation }: CalculationResultsProps) {
  const results = [
    {
      label: "Total Investment",
      value: calculation.totalInvestment,
      color: "text-gray-900",
    },
    {
      label: "Total Returns",
      value: calculation.totalReturns,
      color: "text-green-600",
    },
    {
      label: "Maturity Value",
      value: calculation.maturityValue,
      color: "text-blue-600",
    },
    {
      label: "Annual Return",
      value: calculation.annualizedReturn,
      color: "text-purple-600",
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {results.map((result) => (
        <div key={result.label} className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">{result.label}</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.isPercentage ? `${result.value}%` : `₹${result.value.toLocaleString()}`}</p>
        </div>
      ))}
    </div>
  );
}
