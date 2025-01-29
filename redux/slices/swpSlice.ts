import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface YearlyBreakdownItem {
	year: number;
	actualYear: number;
	monthlyWithdrawal: number;
	totalWithdrawals: number;
	balance: number;
}

interface SWPCalculation {
	initialInvestment: number;
	totalWithdrawals: number;
	remainingBalance: number;
	effectiveReturn: number;
}

interface SWPState {
	initialInvestment: string;
	monthlyWithdrawal: string;
	expectedReturn: string;
	timePeriod: string;
	yearlyIncrement: string;
	isSmartSWP: boolean;
	yearlyBreakdown: YearlyBreakdownItem[];
	calculation: SWPCalculation | null;
	isCalculating: boolean;
	error: string | null;
}

const initialState: SWPState = {
	initialInvestment: "1000000",
	monthlyWithdrawal: "5000",
	expectedReturn: "10",
	timePeriod: "10",
	yearlyIncrement: "10",
	isSmartSWP: false,
	yearlyBreakdown: [],
	calculation: null,
	isCalculating: false,
	error: null,
};

const swpSlice = createSlice({
	name: "swp",
	initialState,
	reducers: {
		setInitialInvestment: (state, action: PayloadAction<string>) => {
			state.initialInvestment = action.payload;
			state.error = null;
		},
		setMonthlyWithdrawal: (state, action: PayloadAction<string>) => {
			state.monthlyWithdrawal = action.payload;
			state.error = null;
		},
		setExpectedReturn: (state, action: PayloadAction<string>) => {
			state.expectedReturn = action.payload;
			state.error = null;
		},
		setTimePeriod: (state, action: PayloadAction<string>) => {
			state.timePeriod = action.payload;
			state.error = null;
		},
		setYearlyIncrement: (state, action: PayloadAction<string>) => {
			state.yearlyIncrement = action.payload;
			state.error = null;
		},
		setIsSmartSWP: (state, action: PayloadAction<boolean>) => {
			state.isSmartSWP = action.payload;
			state.error = null;
		},
		setCalculation: (state, action: PayloadAction<SWPCalculation | null>) => {
			state.calculation = action.payload;
		},
		setYearlyBreakdown: (state, action: PayloadAction<YearlyBreakdownItem[]>) => {
			state.yearlyBreakdown = action.payload;
		},
		setIsCalculating: (state, action: PayloadAction<boolean>) => {
			state.isCalculating = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
			state.calculation = null;
		},
		resetCalculator: () => initialState,
	},
});

export const {
	setInitialInvestment,
	setMonthlyWithdrawal,
	setExpectedReturn,
	setTimePeriod,
	setYearlyIncrement,
	setIsSmartSWP,
	setCalculation,
	setYearlyBreakdown,
	setIsCalculating,
	setError,
	resetCalculator,
} = swpSlice.actions;

export const selectSWPState = (state: { swp: SWPState }) => state.swp;
export default swpSlice.reducer; 