
export const RAW_FINANCIAL_DATA = [
  { month: "2025-01", collected: 38420, pending: 3150, overdue: 2980, vacancy: 5600, maintenance: 2100 },
  { month: "2025-02", collected: 39100, pending: 2880, overdue: 2450, vacancy: 5600, maintenance: 1800 },
  { month: "2025-03", collected: 40250, pending: 2400, overdue: 1920, vacancy: 4200, maintenance: 2400 },
  { month: "2025-04", collected: 41800, pending: 2050, overdue: 1400, vacancy: 3500, maintenance: 3100 },
  { month: "2025-05", collected: 42600, pending: 1900, overdue: 1100, vacancy: 2800, maintenance: 1500 },
  { month: "2025-06", collected: 43200, pending: 1750, overdue: 980, vacancy: 2800, maintenance: 2200 },
  { month: "2025-07", collected: 44100, pending: 1620, overdue: 860, vacancy: 2100, maintenance: 1900 },
  { month: "2025-08", collected: 44650, pending: 1580, overdue: 820, vacancy: 2100, maintenance: 2800 },
  { month: "2025-09", collected: 43900, pending: 1900, overdue: 1200, vacancy: 2800, maintenance: 3500 },
  { month: "2025-10", collected: 43200, pending: 2150, overdue: 1550, vacancy: 3500, maintenance: 2900 },
  { month: "2025-11", collected: 42100, pending: 2400, overdue: 1980, vacancy: 4200, maintenance: 4100 },
  { month: "2025-12", collected: 41300, pending: 2700, overdue: 2450, vacancy: 4900, maintenance: 3800 },
  { month: "2026-01", collected: 42750, pending: 2250, overdue: 1850, vacancy: 3500, maintenance: 2600 }
];

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const FINANCIAL_DATA = {
    months: RAW_FINANCIAL_DATA.map(d => {
        const [year, month] = d.month.split('-');
        const mIndex = parseInt(month, 10) - 1;
        // Show year for Jan
        return mIndex === 0 ? `Jan '${year.slice(2)}` : MONTH_NAMES[mIndex];
    }),
    collected: RAW_FINANCIAL_DATA.map(d => d.collected),
    pending: RAW_FINANCIAL_DATA.map(d => d.pending),
    overdue: RAW_FINANCIAL_DATA.map(d => d.overdue),
    vacancy: RAW_FINANCIAL_DATA.map(d => d.vacancy),
    maintenance: RAW_FINANCIAL_DATA.map(d => d.maintenance),
};
