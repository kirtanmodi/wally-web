export interface YearlyBreakdownItem {
	year: number;
	actualYear: number;
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
	static calculateYearlyBreakdown(monthlyAmount: number, returnRate: number, years: number): YearlyBreakdownItem[] {
		const breakdown: YearlyBreakdownItem[] = [];
		const monthlyRate = returnRate / (12 * 100);
		let runningBalance = 0;
		const startYear = new Date().getFullYear();
		let totalInvestedSoFar = 0;
		let previousYearBalance = 0;

		for (let year = 1; year <= years; year++) {
			const yearlyInvestment = monthlyAmount * 12;
			totalInvestedSoFar += yearlyInvestment;
			let yearEndBalance = 0;

			// Calculate month-by-month for accurate compounding
			for (let month = 1; month <= 12; month++) {
				yearEndBalance = (runningBalance + monthlyAmount) * (1 + monthlyRate);
				runningBalance = yearEndBalance;
			}

			const interest = yearEndBalance - previousYearBalance - yearlyInvestment;

			breakdown.push({
				year,
				actualYear: startYear + year - 1,
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

	static calculateSIP(monthlyAmount: number, returnRate: number, years: number): SIPCalculation {
		const monthlyRate = returnRate / (12 * 100);
		const totalMonths = years * 12;

		const maturityValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
		const totalInvestment = monthlyAmount * totalMonths;
		const totalReturns = maturityValue - totalInvestment;
		const annualizedReturn = (Math.pow(maturityValue / totalInvestment, 1 / years) - 1) * 100;

		return {
			totalInvestment: Math.round(totalInvestment),
			totalReturns: Math.round(totalReturns),
			maturityValue: Math.round(maturityValue),
			annualizedReturn: Math.round(annualizedReturn * 100) / 100,
		};
	}

	static validateInputs(monthlyAmount: number, returnRate: number, years: number): void {
		if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
			throw new Error("Monthly investment must be a positive number");
		}
		if (isNaN(returnRate) || returnRate <= 0 || returnRate > 100) {
			throw new Error("Expected return must be between 0 and 100");
		}
		if (isNaN(years) || years <= 0 || years > 50) {
			throw new Error("Time period must be between 0 and 50 years");
		}
	}
}
