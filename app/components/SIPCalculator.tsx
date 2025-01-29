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

interface SIPCalculation {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  annualizedReturn: number;
}

interface YearlyBreakdownItem {
  year: number;
  investment: number;
  interest: number;
  balance: number;
}

export default function SIPCalculator() {
  const dispatch = useDispatch();
  const { monthlyInvestment, expectedReturn, timePeriod, calculation, isCalculating, yearlyBreakdown, error } = useSelector(selectSIPState);

  const calculateYearlyBreakdown = (monthlyAmount: number, returnRate: number, years: number) => {
    const breakdown = [];
    let previousBalance = 0;

    for (let year = 1; year <= years; year++) {
      const yearlyInvestment = monthlyAmount * 12;
      const r = returnRate / 100;
      const balance = previousBalance * (1 + r) + yearlyInvestment * (1 + r / 2);
      const interest = balance - previousBalance - yearlyInvestment;

      breakdown.push({
        year,
        investment: Math.round(yearlyInvestment),
        interest: Math.round(interest),
        balance: Math.round(balance),
      });

      previousBalance = balance;
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-8">
            {/* Input Fields */}
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => dispatch(setMonthlyInvestment(e.target.value))}
                  placeholder="Monthly Investment"
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-blue-400 p-4 outline-none transition-all placeholder-gray-500 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => dispatch(setExpectedReturn(e.target.value))}
                  placeholder="Expected Return"
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-blue-400 p-4 outline-none transition-all placeholder-gray-500 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => dispatch(setTimePeriod(e.target.value))}
                  placeholder="Time Period"
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-blue-400 p-4 outline-none transition-all placeholder-gray-500 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">Years</span>
              </div>

              <button
                onClick={calculateSIP}
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-medium 
                          hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {isCalculating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>Calculating...</span>
                  </div>
                ) : (
                  "Calculate"
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center animate-fade-in">{error}</div>}

            {/* Results */}
            {calculation && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Investment Summary</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                    <p className="text-gray-400 text-sm">Total Investment</p>
                    <p className="text-2xl font-bold font-mono">₹{calculation.totalInvestment.toLocaleString()}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                    <p className="text-gray-400 text-sm">Total Returns</p>
                    <p className="text-2xl font-bold font-mono text-green-400">₹{calculation.totalReturns.toLocaleString()}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                    <p className="text-gray-400 text-sm">Maturity Value</p>
                    <p className="text-2xl font-bold font-mono text-blue-400">₹{calculation.maturityValue.toLocaleString()}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                    <p className="text-gray-400 text-sm">Annual Return</p>
                    <p className="text-2xl font-bold font-mono text-purple-400">{calculation.annualizedReturn}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
