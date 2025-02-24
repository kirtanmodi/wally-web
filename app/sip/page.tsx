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
  setYearlyIncrement,
  setIsSmartSIP,
} from "@/redux/slices/sipSlice";
import { CalculationLogic } from "@/utils/CalculationLogic";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function SIPCalculator() {
  const dispatch = useDispatch();
  const { monthlyInvestment, expectedReturn, timePeriod, yearlyIncrement, isSmartSIP, calculation, isCalculating, yearlyBreakdown, error } =
    useSelector(selectSIPState);
  const [activeTab, setActiveTab] = useState("calculator");

  const smartSIPControls = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="smartSIP"
          checked={isSmartSIP}
          onChange={(e) => dispatch(setIsSmartSIP(e.target.checked))}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label htmlFor="smartSIP" className="text-sm font-medium text-gray-700">
          Enable Smart SIP (Yearly Increment)
        </label>
      </div>

      {isSmartSIP && (
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

  const calculateSIP = async () => {
    const toastId = toast.loading("Calculating...");

    try {
      dispatch(setError(null));
      dispatch(setIsCalculating(true));

      if (!monthlyInvestment || !expectedReturn || !timePeriod || (isSmartSIP && !yearlyIncrement)) {
        throw new Error("Please fill in all required fields");
      }

      const monthlyAmount = parseFloat(monthlyInvestment);
      const returnRate = parseFloat(expectedReturn);
      const years = parseFloat(timePeriod);
      const increment = isSmartSIP ? parseFloat(yearlyIncrement) : 0;

      CalculationLogic.validateInputs(monthlyAmount, returnRate, years, increment);

      const calculationResult = CalculationLogic.calculateSIP(monthlyAmount, returnRate, years, isSmartSIP, increment);
      dispatch(setCalculation(calculationResult));

      const breakdown = CalculationLogic.calculateYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, increment);
      dispatch(setYearlyBreakdown(breakdown));

      toast.success("Calculation completed successfully!", {
        id: toastId,
      });

      // Automatically switch to results tab after successful calculation
      // setActiveTab("results");
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

  const sipResults = [
    {
      label: "Total Investment",
      value: calculation?.totalInvestment ?? 0,
      color: "text-gray-900",
    },
    {
      label: "Total Returns",
      value: calculation?.totalReturns ?? 0,
      color: "text-green-600",
    },
    {
      label: "Maturity Value",
      value: calculation?.maturityValue ?? 0,
      color: "text-blue-600",
    },
    {
      label: "Annual Return",
      value: calculation?.annualizedReturn ?? 0,
      color: "text-purple-600",
      isPercentage: true,
    },
  ].map((result) => ({
    ...result,
    value: Number.isFinite(result.value) ? result.value : 0,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="">
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

                {smartSIPControls}

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

                {calculation && <CalculationResults results={sipResults} />}
              </div>
            )}

            {activeTab === "results" && yearlyBreakdown && yearlyBreakdown.length > 0 && (
              <YearlyBreakdownTable yearlyBreakdown={yearlyBreakdown} type="sip" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
