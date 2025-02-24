import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface YearlyBreakdownItem {
	year: number;
	monthlyInvestment: number;
	totalInvested: number;
	balance: number;
	inflationAdjustedBalance?: number;
	actualYear?: number;
	interest?: number;
  investment?: number;

}

export interface SIPCalculation {
	totalInvestment: number;
	totalReturns: number;
	maturityValue: number;
	annualizedReturn: number;
	inflationAdjustedReturns: number;
	inflationAdjustedValue: number;
	realRate: number;
}

export interface SIPState {
	monthlyInvestment: string;
	expectedReturn: string;
	timePeriod: string;
	yearlyIncrement: string;
	isSmartSIP: boolean;
	inflationRate: string;
	calculation: SIPCalculation | null;
	yearlyBreakdown: YearlyBreakdownItem[] | null;
	isCalculating: boolean;
	error: string | null;
}

const initialState: SIPState = {
	monthlyInvestment: "",
	expectedReturn: "",
	timePeriod: "",
	yearlyIncrement: "",
	isSmartSIP: false,
	inflationRate: "6", // Default inflation rate of 6%
	calculation: null,
	yearlyBreakdown: null,
	isCalculating: false,
	error: null,
};

export const sipSlice = createSlice({
	name: "sip",
	initialState,

	reducers: {
		setMonthlyInvestment: (state, action: PayloadAction<string>) => {
			state.monthlyInvestment = action.payload;
		},
		setExpectedReturn: (state, action: PayloadAction<string>) => {
			state.expectedReturn = action.payload;
		},
		setTimePeriod: (state, action: PayloadAction<string>) => {
			state.timePeriod = action.payload;
		},
		setYearlyIncrement: (state, action: PayloadAction<string>) => {
			state.yearlyIncrement = action.payload;
		},
		setIsSmartSIP: (state, action: PayloadAction<boolean>) => {
			state.isSmartSIP = action.payload;
		},
		setInflationRate: (state, action: PayloadAction<string>) => {
			state.inflationRate = action.payload;
		},
		setCalculation: (state, action: PayloadAction<SIPCalculation | null>) => {
			state.calculation = action.payload;
		},
		setYearlyBreakdown: (state, action: PayloadAction<YearlyBreakdownItem[] | null>) => {
			state.yearlyBreakdown = action.payload;
		},
		setIsCalculating: (state, action: PayloadAction<boolean>) => {
			state.isCalculating = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setMonthlyInvestment,
	setExpectedReturn,
	setTimePeriod,
	setYearlyIncrement,
	setIsSmartSIP,
	setInflationRate,
	setCalculation,
	setYearlyBreakdown,
	setIsCalculating,
	setError,
} = sipSlice.actions;

export const selectSIPState = (state: RootState) => state.sip;

export default sipSlice.reducer; 