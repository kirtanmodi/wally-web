"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setMonthlyInvestment,
  setExpectedReturn,
  setTimePeriod,
  setCalculation,
  setYearlyBreakdown,
  setIsCalculating,
  setError,
  selectSIPState,
} from "@/redux/slices/sipSlice";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { InputField } from "@/components/InputField";
import { CalculationResults } from "@/components/CalculationResults";
import { YearlyBreakdownTable } from "@/components/YearlyBreakdownTable";

// interface SIPCalculation {
//   totalInvestment: number;
//   totalReturns: number;
//   maturityValue: number;
//   annualizedReturn: number;
// }

interface YearlyBreakdownItem {
  year: number;
  actualYear: number;
  investment: number;
  totalInvested: number;
  interest: number;
  balance: number;
}

interface DataType extends YearlyBreakdownItem {
  key: string;
}

export default function SIPCalculator() {
  const dispatch = useDispatch();
  const { monthlyInvestment, expectedReturn, timePeriod, calculation, isCalculating, yearlyBreakdown, error } = useSelector(selectSIPState);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateYearlyBreakdown = (monthlyAmount: number, returnRate: number, years: number) => {
    const breakdown: YearlyBreakdownItem[] = [];
    const monthlyRate = returnRate / (12 * 100);
    let runningBalance = 0;
    const startYear = new Date().getFullYear();
    let totalInvestedSoFar = 0;
    let previousYearBalance = 0;

    for (let year = 1; year <= years; year++) {
      const yearlyInvestment = monthlyAmount * 12;
      totalInvestedSoFar += yearlyInvestment;
      let yearEndBalance = 0;

      // Calculate month-by-month for accurate compounding
      for (let month = 1; month <= 12; month++) {
        yearEndBalance = (runningBalance + monthlyAmount) * (1 + monthlyRate);
        runningBalance = yearEndBalance;
      }

      // Calculate returns as the difference between current balance and (previous balance + current year investment)
      const interest = yearEndBalance - previousYearBalance - yearlyInvestment;

      breakdown.push({
        year,
        actualYear: startYear + year - 1,
        investment: Math.round(yearlyInvestment),
        totalInvested: Math.round(totalInvestedSoFar),
        interest: Math.round(interest),
        balance: Math.round(yearEndBalance),
      });

      previousYearBalance = yearEndBalance;
      runningBalance = yearEndBalance;
    }

    dispatch(setYearlyBreakdown(breakdown));
  };

  const calculateSIP = async () => {
    try {
      dispatch(setError(null));
      dispatch(setIsCalculating(true));

      // Input validation
      if (!monthlyInvestment || !expectedReturn || !timePeriod) {
        throw new Error("Please fill in all required fields");
      }

      const monthlyAmount = parseFloat(monthlyInvestment);
      const returnRate = parseFloat(expectedReturn);
      const years = parseFloat(timePeriod);

      // Validate input ranges
      if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
        throw new Error("Monthly investment must be a positive number");
      }
      if (isNaN(returnRate) || returnRate <= 0 || returnRate > 100) {
        throw new Error("Expected return must be between 0 and 100");
      }
      if (isNaN(years) || years <= 0 || years > 50) {
        throw new Error("Time period must be between 0 and 50 years");
      }

      // Calculate monthly rate and total months
      const monthlyRate = returnRate / (12 * 100);
      const totalMonths = years * 12;

      // Calculate maturity value using SIP formula
      const maturityValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

      const totalInvestment = monthlyAmount * totalMonths;
      const totalReturns = maturityValue - totalInvestment;
      const annualizedReturn = (Math.pow(maturityValue / totalInvestment, 1 / years) - 1) * 100;

      dispatch(
        setCalculation({
          totalInvestment: Math.round(totalInvestment),
          totalReturns: Math.round(totalReturns),
          maturityValue: Math.round(maturityValue),
          annualizedReturn: Math.round(annualizedReturn * 100) / 100,
        })
      );

      // Calculate yearly breakdown
      calculateYearlyBreakdown(monthlyAmount, returnRate, years);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Calculation failed"));
      dispatch(setCalculation(null));
    } finally {
      dispatch(setIsCalculating(false));
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Year",
      dataIndex: "actualYear",
      key: "actualYear",
      align: "center",
      render: (value: number, record: DataType, index: number) => {
        const date = new Date();
        date.setFullYear(record.actualYear);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return `${formattedDate} (Year ${index + 1})`;
      },
      fixed: "left",
    },
    {
      title: "Investment Amount",
      dataIndex: "investment",
      key: "investment",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Total Invested",
      dataIndex: "totalInvested",
      key: "totalInvested",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Returns",
      dataIndex: "interest",
      key: "interest",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "calculator" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Calculator
              </button>
              {calculation && (
                <button
                  onClick={() => setActiveTab("results")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "results" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Results
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "calculator" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <InputField
                    label="Monthly Investment"
                    value={monthlyInvestment}
                    onChange={(value) => dispatch(setMonthlyInvestment(value))}
                    suffix="₹"
                    min={0}
                    placeholder="Enter monthly investment amount"
                  />

                  <InputField
                    label="Expected Return"
                    value={expectedReturn}
                    onChange={(value) => dispatch(setExpectedReturn(value))}
                    suffix="%"
                    min={0}
                    max={100}
                    placeholder="Enter expected return rate"
                  />

                  <InputField
                    label="Time Period"
                    value={timePeriod}
                    onChange={(value) => dispatch(setTimePeriod(value))}
                    suffix="Years"
                    min={0}
                    max={50}
                    placeholder="Enter investment duration"
                  />
                </div>

                <button
                  onClick={calculateSIP}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-sm font-medium 
                            hover:bg-blue-700 transition-colors duration-200 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                      <span>Calculating...</span>
                    </div>
                  ) : (
                    "Calculate"
                  )}
                </button>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">{error}</div>}

                {calculation && <CalculationResults calculation={calculation} />}
              </div>
            )}

            {activeTab === "results" && yearlyBreakdown && yearlyBreakdown.length > 0 && <YearlyBreakdownTable yearlyBreakdown={yearlyBreakdown} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS in the same file
