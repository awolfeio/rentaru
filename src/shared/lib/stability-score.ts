
import { RAW_FINANCIAL_DATA } from "./financial-data";

// Helper for standard deviation and mean
const getStats = (arr: number[]) => {
    const n = arr.length;
    if (n === 0) return { mean: 0, stdDev: 0 };
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    return { mean, stdDev: Math.sqrt(variance) };
};

// Helper for linear regression slope
const getSlope = (values: number[]) => {
    const n = values.length;
    if (n < 2) return 0;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, i) => a + i * y[i], 0);
    const sumXX = x.reduce((a, i) => a + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
};

export function calculateStabilityScore(data = RAW_FINANCIAL_DATA) {
    // 1. Cash Flow Volatility (30%)
    // Net Cash = Collected - Maintenance
    const netCashFlows = data.map(d => d.collected - d.maintenance);
    const { mean: cashMean, stdDev: cashStdDev } = getStats(netCashFlows);
    const cv = cashMean ? cashStdDev / cashMean : 0;
    // Map CV: 0.0 -> 100, 0.3 -> 0 (High volatility assumes anything > 30% variation is unstable)
    const volatilityScore = Math.max(0, Math.min(100, 100 * (1 - (cv / 0.3))));

    // 2. Collection Reliability (25%)
    // Average collection rate
    const collectionRates = data.map(d => {
        const total = d.collected + d.pending + d.overdue;
        return total > 0 ? d.collected / total : 1;
    });
    const { mean: avgCollectionRate } = getStats(collectionRates);
    const collectionScore = avgCollectionRate * 100;

    // 3. Expense Predictability (20%)
    // Variance of Expense Ratio (Maintenance / Collected)
    const expenseRatios = data.map(d => d.collected > 0 ? d.maintenance / d.collected : 0);
    const { stdDev: expStdDev } = getStats(expenseRatios);
    // Map StdDev: 0.0 -> 100, 0.2 -> 0 (If expense ratio fluctuates by 20%, that's bad)
    const expenseScore = Math.max(0, Math.min(100, 100 * (1 - (expStdDev / 0.15))));

    // 4. Vacancy Pressure (15%)
    // Average Vacancy Rate (Vacancy / Potential)
    const vacancyRates = data.map(d => {
        const potential = d.collected + d.pending + d.overdue + d.vacancy;
        return potential > 0 ? d.vacancy / potential : 0;
    });
    const { mean: avgVacancyRate } = getStats(vacancyRates);
    // Score = (1 - vacancyRate) * 100
    const vacancyScore = (1 - avgVacancyRate) * 100;

    // 5. Risk Pressure Trend (10%)
    // Slope of Risk Pressure Line
    const riskPressures = data.map(d => {
        const total = d.collected + d.pending + d.overdue + d.vacancy;
        if (total === 0) return 0;
        const overdueRatio = d.overdue / d.collected; // Approximate risk calculation from previous chart logic
        const vacancyRatio = d.vacancy / total;
        // Logic from FinancialReality3D: (overdueRatio * 0.6 + vacancyRatio * 0.4) * 3
        // We handle Collected=0 case for overdueRatio to avoid Infinity
        const reliableOverdue = d.collected > 0 ? overdueRatio : 1;
        return Math.min(1, (reliableOverdue * 0.6 + vacancyRatio * 0.4) * 3);
    });
    const riskSlope = getSlope(riskPressures);
    // Slope < 0 is improving (Good), Slope > 0 is worsening (Bad)
    // Map slope: -0.05 -> 100, 0 -> 80, 0.05 -> 0
    // Simplified: 80 - (slope * 1000)? 
    // If slope is 0.01 (increases 1% per month), score drops.
    // Let's normalize: 
    // improving score = 50 - (slope * 500) -> clamped 0-100?
    // If slope is -0.1 (very good), 50 - (-50) = 100.
    // If slope is 0.1 (very bad), 50 - 50 = 0.
    const trendScore = Math.max(0, Math.min(100, 50 - (riskSlope * 500) + 30)); // Added +30 bias so flat trend is ~80

    // Weighted Sum
    const totalScore = 
        (volatilityScore * 0.30) +
        (collectionScore * 0.25) +
        (expenseScore * 0.20) +
        (vacancyScore * 0.15) +
        (trendScore * 0.10);

    return {
        score: Math.round(totalScore),
        details: {
            volatility: Math.round(volatilityScore),
            collection: Math.round(collectionScore),
            expense: Math.round(expenseScore),
            vacancy: Math.round(vacancyScore),
            trend: Math.round(trendScore),
            netCashFlow: netCashFlows[netCashFlows.length - 1], // Last month
            expenseBurn: expenseRatios[expenseRatios.length - 1] * 100,
            avgRent: Math.round(data[data.length - 1].collected / 21) // Mock unit count? ~21 units
        }
    };
}
