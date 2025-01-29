export interface YearlyBreakdownItem {
	year: number;
	actualYear: number;
	monthlyInvestment: number;
	investment: number;
	totalInvested: number;
	interest: number;
	balance: number;
}

export interface SIPCalculation {
	totalInvestment: number;
	totalReturns: number;
	maturityValue: number;
	annualizedReturn: number;
}

export class CalculationLogic {
	static calculateYearlyBreakdown(
		monthlyAmount: number,
		returnRate: number,
		years: number,
		isSmartSIP: boolean = false,
		yearlyIncrement: number = 0
	): YearlyBreakdownItem[] {
		const breakdown: YearlyBreakdownItem[] = [];
		const monthlyRate = returnRate / (12 * 100);
		let runningBalance = 0;
		const startYear = new Date().getFullYear();
		let totalInvestedSoFar = 0;
		let previousYearBalance = 0;
		let currentMonthlyAmount = monthlyAmount;

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

			const interest = yearEndBalance - previousYearBalance - yearlyInvestment;

			breakdown.push({
				year,
				actualYear: startYear + year - 1,
				monthlyInvestment: Math.round(currentMonthlyAmount),
				investment: Math.round(yearlyInvestment),
				totalInvested: Math.round(totalInvestedSoFar),
				interest: Math.round(interest),
				balance: Math.round(yearEndBalance),
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
		yearlyIncrement: number = 0
	): SIPCalculation {
		const breakdown = this.calculateYearlyBreakdown(monthlyAmount, returnRate, years, isSmartSIP, yearlyIncrement);
		const lastYear = breakdown[breakdown.length - 1];

		return {
			totalInvestment: Math.round(lastYear.totalInvested),
			totalReturns: Math.round(lastYear.balance - lastYear.totalInvested),
			maturityValue: Math.round(lastYear.balance),
			annualizedReturn: Math.round((Math.pow(lastYear.balance / lastYear.totalInvested, 1 / years) - 1) * 100 * 100) / 100,
		};
	}

	static validateInputs(monthlyAmount: number, returnRate: number, years: number, yearlyIncrement?: number): void {
		if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
			throw new Error("Monthly investment must be a positive number");
		}
		if (isNaN(returnRate) || returnRate <= 0 || returnRate > 100) {
			throw new Error("Expected return must be between 0 and 100");
		}
		if (isNaN(years) || years <= 0 || years > 50) {
			throw new Error("Time period must be between 0 and 50 years");
		}
		if (yearlyIncrement !== undefined && (isNaN(yearlyIncrement) || yearlyIncrement < 0 || yearlyIncrement > 100)) {
			throw new Error("Yearly increment must be between 0 and 100");
		}
	}
}
