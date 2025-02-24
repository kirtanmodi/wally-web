"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "./InputField";
import { useState, useEffect } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetYear: number;
  suggestedMonthlyInvestment?: number;
  progress?: number;
}

interface InvestmentGoalsProps {
  goals: InvestmentGoal[];
  onAddGoal: (goal: InvestmentGoal) => void;
  onUpdateGoal: (goal: InvestmentGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  expectedReturn: number;
}

const DEFAULT_GOALS = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 500000,
    targetYear: 2,
  },
  {
    id: "2",
    name: "House Down Payment",
    targetAmount: 2000000,
    targetYear: 5,
  },
  {
    id: "3",
    name: "Child's Education",
    targetAmount: 5000000,
    targetYear: 15,
  },
];

export const InvestmentGoals = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  expectedReturn,
}: InvestmentGoalsProps) => {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<InvestmentGoal>>({
    name: "",
    targetAmount: 0,
    targetYear: 1,
  });

  // Calculate suggested monthly investment for a goal
  const calculateSuggestedMonthlyInvestment = (targetAmount: number, years: number, returnRate: number) => {
    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;
    const monthlyInvestment = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.ceil(monthlyInvestment);
  };

  // Update goals with calculations
  useEffect(() => {
    goals.forEach((goal) => {
      const suggestedMonthlyInvestment = calculateSuggestedMonthlyInvestment(
        goal.targetAmount,
        goal.targetYear,
        expectedReturn
      );
      
      if (goal.suggestedMonthlyInvestment !== suggestedMonthlyInvestment) {
        onUpdateGoal({
          ...goal,
          suggestedMonthlyInvestment,
        });
      }
    });
  }, [goals, expectedReturn]);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetYear) {
      return;
    }

    onAddGoal({
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      targetYear: Number(newGoal.targetYear),
      suggestedMonthlyInvestment: calculateSuggestedMonthlyInvestment(
        Number(newGoal.targetAmount),
        Number(newGoal.targetYear),
        expectedReturn
      ),
    });

    setNewGoal({ name: "", targetAmount: 0, targetYear: 1 });
    setShowNewGoalForm(false);
  };

  const handleAddDefaultGoals = () => {
    DEFAULT_GOALS.forEach((goal) => {
      onAddGoal({
        ...goal,
        id: Math.random().toString(36).substr(2, 9),
        suggestedMonthlyInvestment: calculateSuggestedMonthlyInvestment(
          goal.targetAmount,
          goal.targetYear,
          expectedReturn
        ),
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Investment Goals</h2>
        {goals.length === 0 && (
          <button
            onClick={handleAddDefaultGoals}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Sample Goals
          </button>
        )}
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{goal.name}</h3>
                <p className="text-sm text-gray-500">Target: {goal.targetYear} years</p>
              </div>
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <InputField
                label="Target Amount"
                value={goal.targetAmount.toString()}
                onChange={(value) =>
                  onUpdateGoal({ ...goal, targetAmount: Number(value) || 0 })
                }
                suffix="₹"
                min={0}
                placeholder="Enter target amount"
              />

              <InputField
                label="Target Years"
                value={goal.targetYear.toString()}
                onChange={(value) =>
                  onUpdateGoal({ ...goal, targetYear: Number(value) || 1 })
                }
                suffix="Years"
                min={1}
                max={50}
                placeholder="Enter target years"
              />

              {goal.suggestedMonthlyInvestment && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Suggested Monthly Investment:
                    <span className="ml-2 text-blue-600">
                      ₹{goal.suggestedMonthlyInvestment.toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              )}

              {goal.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(goal.progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className="h-full bg-blue-600 rounded-full"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showNewGoalForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 p-4 rounded-xl space-y-4"
          >
            <InputField
              label="Goal Name"
              value={newGoal.name || ""}
              onChange={(value) => setNewGoal({ ...newGoal, name: value })}
              placeholder="Enter goal name"
              type="text"
            />

            <InputField
              label="Target Amount"
              value={(newGoal.targetAmount || 0).toString()}
              onChange={(value) =>
                setNewGoal({ ...newGoal, targetAmount: Number(value) || 0 })
              }
              suffix="₹"
              min={0}
              placeholder="Enter target amount"
            />

            <InputField
              label="Target Years"
              value={(newGoal.targetYear || 1).toString()}
              onChange={(value) =>
                setNewGoal({ ...newGoal, targetYear: Number(value) || 1 })
              }
              suffix="Years"
              min={1}
              max={50}
              placeholder="Enter target years"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewGoalForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showNewGoalForm && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewGoalForm(true)}
          className="flex items-center gap-2 w-full justify-center py-3 border-2
            border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700
            hover:border-gray-400 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add New Goal</span>
        </motion.button>
      )}
    </div>
  );
}; 