import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { InvestmentGoal } from "@/components/InvestmentGoals";

interface GoalsState {
	goals: InvestmentGoal[];
}

const initialState: GoalsState = {
	goals: [],
};

export const goalsSlice = createSlice({
	name: "goals",
	initialState,
	reducers: {
		addGoal: (state, action: PayloadAction<InvestmentGoal>) => {
			state.goals.push(action.payload);
		},
		updateGoal: (state, action: PayloadAction<InvestmentGoal>) => {
			const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
			if (index !== -1) {
				state.goals[index] = action.payload;
			}
		},
		deleteGoal: (state, action: PayloadAction<string>) => {
			state.goals = state.goals.filter((goal) => goal.id !== action.payload);
		},
		updateGoalProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
			const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
			if (index !== -1) {
				state.goals[index].progress = action.payload.progress;
			}
		},
	},
});

export const { addGoal, updateGoal, deleteGoal, updateGoalProgress } = goalsSlice.actions;

export const selectGoals = (state: RootState) => state.goals.goals;

export default goalsSlice.reducer; 