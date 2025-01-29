import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define strict types for the calculations
interface YearlyBreakdown {
  year: number;
  investment: number;
  interest: number;
  balance: number;
}

interface SIPCalculation {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  annualizedReturn: number;
}

interface SIPState {
  monthlyInvestment: string;
  expectedReturn: string;
  timePeriod: string;
  yearlyBreakdown: YearlyBreakdown[];
  calculation: SIPCalculation | null;
  isCalculating: boolean;
  error: string | null;
}

// Define initial state with proper types
const initialState: SIPState = {
  monthlyInvestment: "5000",
  expectedReturn: "10",
  timePeriod: "10",
  yearlyBreakdown: [],
  calculation: null,
  isCalculating: false,
  error: null,
};

const sipSlice = createSlice({
  name: "sip",
  initialState,
  reducers: {
    setMonthlyInvestment: (state, action: PayloadAction<string>) => {
      state.monthlyInvestment = action.payload;
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
    setCalculation: (state, action: PayloadAction<SIPCalculation | null>) => {
      state.calculation = action.payload;
    },
    setYearlyBreakdown: (state, action: PayloadAction<YearlyBreakdown[]>) => {
      state.yearlyBreakdown = action.payload;
    },
    setIsCalculating: (state, action: PayloadAction<boolean>) => {
      state.isCalculating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.calculation = null;
    },
    resetCalculator: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setMonthlyInvestment,
  setExpectedReturn,
  setTimePeriod,
  setCalculation,
  setYearlyBreakdown,
  setIsCalculating,
  setError,
  resetCalculator,
} = sipSlice.actions;

// Export reducer
export default sipSlice.reducer;

// Selector functions for easy state access
export const selectSIPState = (state: { sip: SIPState }) => state.sip;
export const selectCalculation = (state: { sip: SIPState }) => state.sip.calculation;
export const selectYearlyBreakdown = (state: { sip: SIPState }) => state.sip.yearlyBreakdown;
