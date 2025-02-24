"use client";

import { YearlyBreakdownItem } from "@/redux/slices/sipSlice";
// export interface YearlyBreakdownItem {
// 	year: number;
// 	monthlyInvestment: number;
// 	totalInvested: number;
// 	balance: number;
// 	inflationAdjustedBalance?: number;
// }
interface YearlyBreakdownTableProps {
  yearlyBreakdown: YearlyBreakdownItem[];
  type: "sip" | "swp";
}

export const YearlyBreakdownTable = ({ yearlyBreakdown, type }: YearlyBreakdownTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monthly {type === "sip" ? "Investment" : "Withdrawal"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total {type === "sip" ? "Invested" : "Withdrawn"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inflation Adjusted Balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {yearlyBreakdown.map((item) => (
            <tr key={item.year} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.year}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.monthlyInvestment)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.totalInvested)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.balance)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.inflationAdjustedBalance || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
