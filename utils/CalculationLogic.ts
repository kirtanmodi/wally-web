import { YearlyBreakdownItem } from "@/redux/slices/sipSlice";

export interface SIPCalculation {
	totalInvestment: number;
	totalReturns: number;
	maturityValue: number;
	annualizedReturn: number;
}

// export interface YearlyBreakdownItem {
// 	year: number;
// 	monthlyInvestment: number;
// 	totalInvested: number;
// 	balance: number;
// 	inflationAdjustedBalance?: number;
// }

export class CalculationLogic {
	static calculateYearlyBreakdown(
		monthlyAmount: number,
		returnRate: number,
		years: number,
		isSmartSIP: boolean = false,
		yearlyIncrement: number = 0,
		inflationRate: number = 0
	): YearlyBreakdownItem[] {
		const breakdown: YearlyBreakdownItem[] = [];
		const monthlyRate = returnRate / (12 * 100);
		let runningBalance = 0;
		const startYear = new Date().getFullYear();
		let totalInvestedSoFar = 0;
		let previousYearBalance = 0;
		let currentMonthlyAmount = monthlyAmount;
		// const monthlyInflationRate = inflationRate / 12 / 100;

		for (let year = 1; year <= years; year++) {
			if (isSmartSIP && year > 1) {
				currentMonthlyAmount *= (1 + yearlyIncrement / 100);
			}

			const yearlyInvestment = currentMonthlyAmount * 12;
			totalInvestedSoFar += yearlyInvestment;
			let yearEndBalance = 0;

			for (let month = 1; month <= 12; month++) {
				yearEndBalance = (runningBalance + currentMonthlyAmount) * (1 + monthlyRate);
				runningBalance = yearEndBalance;
			}

			const inflationAdjustedBalance = yearEndBalance / Math.pow(1 + inflationRate / 100, year);

			const interest = yearEndBalance - previousYearBalance - yearlyInvestment;

			breakdown.push({
				year,
				actualYear: startYear + year - 1,
				monthlyInvestment: Math.round(currentMonthlyAmount),
				investment: Math.round(yearlyInvestment),
				totalInvested: Math.round(totalInvestedSoFar),
				interest: Math.round(interest),
				balance: Math.round(yearEndBalance),
				inflationAdjustedBalance: Math.round(inflationAdjustedBalance),
			});

			previousYearBalance = yearEndBalance;
			runningBalance = yearEndBalance;
		}

		return breakdown;
	}

	static calculateReverseYearlyBreakdown(
		monthlyAmount: number,
		returnRate: number,
		years: number,
		isSmartSIP: boolean = false,
		yearlyIncrement: number = 0,
		inflationRate: number = 0
	): YearlyBreakdownItem[] {
		// First get the normal order investments to know what amounts we need to reverse
		const normalBreakdown = this.calculateYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, yearlyIncrement, inflationRate);

		// Get all monthly investment amounts in reverse order
		const monthlyInvestments = normalBreakdown
			.map(year => year.monthlyInvestment)
			.reverse();

		const breakdown: YearlyBreakdownItem[] = [];
		const monthlyRate = returnRate / (12 * 100);
		let runningBalance = 0;
		const startYear = new Date().getFullYear();
		let totalInvestedSoFar = 0;
		let previousYearBalance = 0;

		for (let year = 1; year <= years; year++) {
			const currentMonthlyAmount = monthlyInvestments[year - 1];
			const yearlyInvestment = currentMonthlyAmount * 12;
			totalInvestedSoFar += yearlyInvestment;
			let yearEndBalance = 0;

			for (let month = 1; month <= 12; month++) {
				yearEndBalance = (runningBalance + currentMonthlyAmount) * (1 + monthlyRate);
				runningBalance = yearEndBalance;
			}

			const inflationAdjustedBalance = yearEndBalance / Math.pow(1 + inflationRate / 100, year);

			const interest = yearEndBalance - previousYearBalance - yearlyInvestment;

			breakdown.push({
				year,
				actualYear: startYear + year - 1,
				monthlyInvestment: Math.round(currentMonthlyAmount),
				investment: Math.round(yearlyInvestment),
				totalInvested: Math.round(totalInvestedSoFar),
				interest: Math.round(interest),
				balance: Math.round(yearEndBalance),
				inflationAdjustedBalance: Math.round(inflationAdjustedBalance),
			});

			previousYearBalance = yearEndBalance;
			runningBalance = yearEndBalance;
		}

		return breakdown;
	}

	static calculateSIP(
		monthlyAmount: number,
		returnRate: number,
		years: number,
		isSmartSIP: boolean = false,
		yearlyIncrement: number = 0,
		inflationRate: number = 0
	): SIPCalculation {
		const breakdown = this.calculateYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, yearlyIncrement, inflationRate);
		const lastYear = breakdown[breakdown.length - 1];

		return {
			totalInvestment: Math.round(lastYear.totalInvested),
			totalReturns: Math.round(lastYear.balance - lastYear.totalInvested),
			maturityValue: Math.round(lastYear.balance),
			annualizedReturn: Math.round((Math.pow(lastYear.balance / lastYear.totalInvested, 1 / years) - 1) * 100 * 100) / 100,
		};
	}

	static validateInputs(
		monthlyInvestment: number,
		returnRate: number,
		years: number,
		yearlyIncrement: number = 0,
		inflationRate: number = 0
	) {
		if (monthlyInvestment <= 0) {
			throw new Error("Monthly investment must be greater than 0");
		}
		if (returnRate <= 0) {
			throw new Error("Expected return rate must be greater than 0");
		}
		if (years <= 0) {
			throw new Error("Time period must be greater than 0");
		}
		if (yearlyIncrement < 0) {
			throw new Error("Yearly increment cannot be negative");
		}
		if (inflationRate < 0) {
			throw new Error("Inflation rate cannot be negative");
		}
	}

	static calculateRealRate(nominalRate: number, inflationRate: number): number {
		return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
	}
}
