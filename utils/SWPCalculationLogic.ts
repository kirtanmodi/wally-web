export interface SWPCalculation {
	initialInvestment: number;
	totalWithdrawals: number;
	remainingBalance: number;
	effectiveReturn: number;
}

export class SWPCalculationLogic {
	static validateInputs(
		principal: number,
		withdrawal: number,
		returnRate: number,
		years: number,
		yearlyIncrement?: number
	): void {
		if (isNaN(principal) || principal <= 0) {
			throw new Error("Initial investment must be a positive number");
		}
		if (isNaN(withdrawal) || withdrawal <= 0) {
			throw new Error("Monthly withdrawal must be a positive number");
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

	static calculateYearlyBreakdown(
		principal: number,
		withdrawal: number,
		returnRate: number,
		years: number,
		isSmartSWP: boolean = false,
		yearlyIncrement: number = 0
	): any[] {
		const breakdown = [];
		const monthlyRate = returnRate / (12 * 100);
		let runningBalance = principal;
		const startYear = new Date().getFullYear();
		let currentMonthlyWithdrawal = withdrawal;

		for (let year = 1; year <= years; year++) {
			if (isSmartSWP && year > 1) {
				currentMonthlyWithdrawal *= (1 + yearlyIncrement / 100);
			}

			let yearEndBalance = runningBalance;
			let yearlyWithdrawals = 0;

			for (let month = 1; month <= 12; month++) {
				// First add monthly returns
				yearEndBalance *= (1 + monthlyRate);

				// Then subtract withdrawal
				if (yearEndBalance >= currentMonthlyWithdrawal) {
					yearEndBalance -= currentMonthlyWithdrawal;
					yearlyWithdrawals += currentMonthlyWithdrawal;
				} else {
					yearlyWithdrawals += yearEndBalance;
					yearEndBalance = 0;
					break;
				}
			}

			breakdown.push({
				year,
				actualYear: startYear + year - 1,
				monthlyWithdrawal: Math.round(currentMonthlyWithdrawal),
				totalWithdrawals: Math.round(yearlyWithdrawals),
				balance: Math.round(yearEndBalance),
			});

			if (yearEndBalance <= 0) break;
			runningBalance = yearEndBalance;
		}

		return breakdown;
	}

	static calculateSWP(
		principal: number,
		withdrawal: number,
		returnRate: number,
		years: number,
		isSmartSWP: boolean = false,
		yearlyIncrement: number = 0
	): SWPCalculation {
		const breakdown = this.calculateYearlyBreakdown(principal, withdrawal, returnRate, years, isSmartSWP, yearlyIncrement);
		const lastYear = breakdown[breakdown.length - 1];

		const totalWithdrawals = breakdown.reduce((sum, year) => sum + year.totalWithdrawals, 0);
		const effectiveReturn = ((lastYear.balance / principal - 1) * 100);

		return {
			initialInvestment: principal,
			totalWithdrawals,
			remainingBalance: lastYear.balance,
			effectiveReturn: Math.round(effectiveReturn * 100) / 100,
		};
	}
} 