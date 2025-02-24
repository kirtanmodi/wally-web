"use client";

import { CalculationResults } from "@/components/CalculationResults";
import { InputField } from "@/components/InputField";
import { YearlyBreakdownTable } from "@/components/YearlyBreakdownTable";
import { InvestmentGoals, InvestmentGoal } from "@/components/InvestmentGoals";
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
import {
  selectGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} from "@/redux/slices/goalsSlice";
import { CalculationLogic } from "@/utils/CalculationLogic";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Switch } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { InvestmentCharts } from "@/components/InvestmentCharts";

export default function SIPCalculator() {
  const dispatch = useDispatch();
  const { 
    monthlyInvestment, 
    expectedReturn, 
    timePeriod, 
    yearlyIncrement, 
    isSmartSIP, 
    calculation, 
    isCalculating, 
    yearlyBreakdown, 
    error 
  } = useSelector(selectSIPState);
  
  const goals = useSelector(selectGoals);
  const [activeTab, setActiveTab] = useState("calculator");
  const [isReversed, setIsReversed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const smartSIPControls = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-gray-50 p-4 rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Switch
          checked={isSmartSIP}
          onChange={(checked) => dispatch(setIsSmartSIP(checked))}
          className={`${isSmartSIP ? "bg-blue-600" : ""} transition-colors duration-200`}
        />
        <label className="text-sm font-medium">
          Smart SIP (Yearly Increment)
        </label>
      </div>

      <AnimatePresence>
        {isSmartSIP && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InputField
              label="Yearly Increment"
              value={yearlyIncrement}
              onChange={(value) => dispatch(setYearlyIncrement(value))}
              suffix="%"
              min={0}
              max={100}
              placeholder="Enter yearly increment percentage"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const calculateSIP = async (reversed: boolean = isReversed) => {
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

      const breakdown = reversed
        ? CalculationLogic.calculateReverseYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, increment)
        : CalculationLogic.calculateYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, increment);

      const calculationResult = {
        totalInvestment: breakdown[breakdown.length - 1].totalInvested,
        totalReturns: breakdown[breakdown.length - 1].balance - breakdown[breakdown.length - 1].totalInvested,
        maturityValue: breakdown[breakdown.length - 1].balance,
        annualizedReturn: Math.round((Math.pow(breakdown[breakdown.length - 1].balance / breakdown[breakdown.length - 1].totalInvested, 1 / years) - 1) * 100 * 100) / 100,
      };

      dispatch(setCalculation(calculationResult));
      dispatch(setYearlyBreakdown(breakdown));

      // if (activeTab === "calculator") {
      //   setActiveTab("results");
      // }

      toast.success("Calculation completed successfully!", { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Calculation failed";
      dispatch(setError(errorMessage));
      dispatch(setCalculation(null));
      toast.error(errorMessage, { id: toastId });
    } finally {
      dispatch(setIsCalculating(false));
    }
  };

  const sipResults = [
    {
      label: "Total Investment",
      value: calculation?.totalInvestment ?? 0,
      color: "text-gray-900",
      icon: "💰",
    },
    {
      label: "Total Returns",
      value: calculation?.totalReturns ?? 0,
      color: "text-green-600",
      icon: "📈",
    },
    {
      label: "Maturity Value",
      value: calculation?.maturityValue ?? 0,
      color: "text-blue-600",
      icon: "🎯",
    },
    {
      label: "Annual Return",
      value: calculation?.annualizedReturn ?? 0,
      color: "text-purple-600",
      isPercentage: true,
      icon: "⭐",
    },
  ].map((result) => ({
    ...result,
    value: Number.isFinite(result.value) ? result.value : 0,
  }));

  // Update goal progress when calculation changes
  useEffect(() => {
    if (calculation && yearlyBreakdown) {
      goals.forEach((goal: InvestmentGoal) => {
        const currentValue = yearlyBreakdown[Math.min(goal.targetYear - 1, yearlyBreakdown.length - 1)]?.balance || 0;
        const progress = (currentValue / goal.targetAmount) * 100;
        dispatch(updateGoalProgress({ id: goal.id, progress: Math.min(progress, 100) }));
      });
    }
  }, [calculation, yearlyBreakdown, goals, dispatch]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {["calculator", "goals", "results"].map((tab) => (
                (tab === "results" && !calculation) ? null : (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200
                      ${activeTab === tab 
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "calculator" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
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

                <div className="flex items-center gap-3 p-4 rounded-xl">
                  <Switch
                    checked={isReversed}
                    onChange={(checked) => {
                      setIsReversed(checked);
                      if (calculation) calculateSIP(checked);
                    }}
                    className={isReversed ? "bg-blue-600" : ""}
                  />
                  <span className="text-sm">
                    Reverse Investment Order
                  </span>
                </div>

                {smartSIPControls}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => calculateSIP()}
                  disabled={isCalculating}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6 rounded-xl
                    text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      <span>Calculating...</span>
                    </div>
                  ) : (
                    "Calculate Investment"
                  )}
                </motion.button>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
                      text-red-600 dark:text-red-400 p-4 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {calculation && <CalculationResults results={sipResults} />}
              </motion.div>
            )}

            {activeTab === "goals" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <InvestmentGoals
                  goals={goals}
                  onAddGoal={(goal) => dispatch(addGoal(goal))}
                  onUpdateGoal={(goal) => dispatch(updateGoal(goal))}
                  onDeleteGoal={(goalId) => dispatch(deleteGoal(goalId))}
                  expectedReturn={parseFloat(expectedReturn)}
                />
              </motion.div>
            )}

            {activeTab === "results" && yearlyBreakdown && yearlyBreakdown.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <InvestmentCharts yearlyBreakdown={yearlyBreakdown} />
                <div className="mt-8">
                  <YearlyBreakdownTable
                    yearlyBreakdown={yearlyBreakdown}
                    type="sip"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
