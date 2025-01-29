"use client";

import { CalculationResults } from "@/components/CalculationResults";
import { InputField } from "@/components/InputField";
import { YearlyBreakdownTable } from "@/components/YearlyBreakdownTable";
import {
  selectSWPState,
  setCalculation,
  setError,
  setExpectedReturn,
  setInitialInvestment,
  setIsCalculating,
  setMonthlyWithdrawal,
  setTimePeriod,
  setYearlyBreakdown,
  setYearlyIncrement,
  setIsSmartSWP,
} from "@/redux/slices/swpSlice";
import { SWPCalculationLogic } from "@/utils/SWPCalculationLogic";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function SWPCalculator() {
  const dispatch = useDispatch();
  const {
    initialInvestment,
    monthlyWithdrawal,
    expectedReturn,
    timePeriod,
    yearlyIncrement,
    isSmartSWP,
    calculation,
    isCalculating,
    yearlyBreakdown,
    error,
  } = useSelector(selectSWPState);
  const [activeTab, setActiveTab] = useState("calculator");

  const smartSWPControls = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="smartSWP"
          checked={isSmartSWP}
          onChange={(e) => dispatch(setIsSmartSWP(e.target.checked))}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label htmlFor="smartSWP" className="text-sm font-medium text-gray-700">
          Enable Smart SWP (Yearly Increment in Withdrawal)
        </label>
      </div>

      {isSmartSWP && (
        <InputField
          label="Yearly Increment"
          value={yearlyIncrement}
          onChange={(value) => dispatch(setYearlyIncrement(value))}
          suffix="%"
          min={0}
          max={100}
          placeholder="Enter yearly increment percentage"
        />
      )}
    </div>
  );

  const calculateSWP = async () => {
    const toastId = toast.loading("Calculating...");

    try {
      dispatch(setError(null));
      dispatch(setIsCalculating(true));

      if (!initialInvestment || !monthlyWithdrawal || !expectedReturn || !timePeriod || (isSmartSWP && !yearlyIncrement)) {
        throw new Error("Please fill in all required fields");
      }

      const principal = parseFloat(initialInvestment);
      const withdrawal = parseFloat(monthlyWithdrawal);
      const returnRate = parseFloat(expectedReturn);
      const years = parseFloat(timePeriod);
      const increment = isSmartSWP ? parseFloat(yearlyIncrement) : 0;

      SWPCalculationLogic.validateInputs(principal, withdrawal, returnRate, years, increment);

      const calculationResult = SWPCalculationLogic.calculateSWP(principal, withdrawal, returnRate, years, isSmartSWP, increment);
      dispatch(setCalculation(calculationResult));

      const breakdown = SWPCalculationLogic.calculateYearlyBreakdown(principal, withdrawal, returnRate, years, isSmartSWP, increment);
      dispatch(setYearlyBreakdown(breakdown));

      toast.success("Calculation completed successfully!", {
        id: toastId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Calculation failed";
      dispatch(setError(errorMessage));
      dispatch(setCalculation(null));

      toast.error(errorMessage, {
        id: toastId,
      });
    } finally {
      dispatch(setIsCalculating(false));
    }
  };

  const swpResults = [
    {
      label: "Initial Investment",
      value: calculation?.initialInvestment ?? 0,
      color: "text-gray-900",
    },
    {
      label: "Total Withdrawals",
      value: calculation?.totalWithdrawals ?? 0,
      color: "text-red-600",
    },
    {
      label: "Remaining Balance",
      value: calculation?.remainingBalance ?? 0,
      color: "text-blue-600",
    },
    {
      label: "Effective Return",
      value: calculation?.effectiveReturn ?? 0,
      color: "text-purple-600",
      isPercentage: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md">
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <InputField
                    label="Initial Investment"
                    value={initialInvestment}
                    onChange={(value) => dispatch(setInitialInvestment(value))}
                    suffix="₹"
                    min={0}
                    placeholder="Enter initial investment amount"
                  />

                  <InputField
                    label="Monthly Withdrawal"
                    value={monthlyWithdrawal}
                    onChange={(value) => dispatch(setMonthlyWithdrawal(value))}
                    suffix="₹"
                    min={0}
                    placeholder="Enter monthly withdrawal amount"
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
                    placeholder="Enter withdrawal duration"
                  />
                </div>

                {smartSWPControls}

                <button
                  onClick={calculateSWP}
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

                {calculation && <CalculationResults results={swpResults} />}
              </div>
            )}

            {activeTab === "results" && yearlyBreakdown && yearlyBreakdown.length > 0 && <YearlyBreakdownTable yearlyBreakdown={yearlyBreakdown} />}
          </div>
        </div>
      </div>
    </div>
  );
}
