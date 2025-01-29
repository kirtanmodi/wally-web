"use client";

import { CalculationResults } from "@/components/CalculationResults";
import { InputField } from "@/components/InputField";
import { YearlyBreakdownTable } from "@/components/YearlyBreakdownTable";
import {
  selectSIPState,
  setCalculation,
  setError,
  setExpectedReturn,
  setIsCalculating,
  setMonthlyInvestment,
  setTimePeriod,
  setYearlyBreakdown,
} from "@/redux/slices/sipSlice";
import { CalculationLogic } from "@/utils/CalculationLogic";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SIPCalculator() {
  const dispatch = useDispatch();
  const { monthlyInvestment, expectedReturn, timePeriod, calculation, isCalculating, yearlyBreakdown, error } = useSelector(selectSIPState);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateSIP = async () => {
    try {
      dispatch(setError(null));
      dispatch(setIsCalculating(true));

      if (!monthlyInvestment || !expectedReturn || !timePeriod) {
        throw new Error("Please fill in all required fields");
      }

      const monthlyAmount = parseFloat(monthlyInvestment);
      const returnRate = parseFloat(expectedReturn);
      const years = parseFloat(timePeriod);

      CalculationLogic.validateInputs(monthlyAmount, returnRate, years);

      const calculationResult = CalculationLogic.calculateSIP(monthlyAmount, returnRate, years);
      dispatch(setCalculation(calculationResult));

      const breakdown = CalculationLogic.calculateYearlyBreakdown(monthlyAmount, returnRate, years);
      dispatch(setYearlyBreakdown(breakdown));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : "Calculation failed"));
      dispatch(setCalculation(null));
    } finally {
      dispatch(setIsCalculating(false));
    }
  };

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
