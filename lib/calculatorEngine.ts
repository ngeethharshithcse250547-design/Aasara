export interface CalculationInputs {
  principal: number;
  annualInterestRate: number; // e.g. 0.065 for 6.5%
  tenureMonths: number;
  frequency: "Quarterly" | "Monthly";
  moratoriumMonths: number;
}

export interface AmortizationPeriod {
  period: number;
  periodLabel: string;
  openingBalance: number;
  instalment: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
  isMoratorium: boolean;
}

export interface CalculationResult {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  frequency: "Quarterly" | "Monthly";
  instalmentAmount: number;
  totalInstalments: number;
  totalInterest: number;
  totalAmountPayable: number;
  moratoriumMonths: number;
  moratoriumNote: string;
  schedule: AmortizationPeriod[];
}

export function calculateRepayment(inputs: CalculationInputs): CalculationResult {
  const { principal, annualInterestRate, tenureMonths, frequency, moratoriumMonths } = inputs;

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      principal: 0,
      annualInterestRate,
      tenureMonths,
      frequency,
      instalmentAmount: 0,
      totalInstalments: 0,
      totalInterest: 0,
      totalAmountPayable: 0,
      moratoriumMonths,
      moratoriumNote: "",
      schedule: [],
    };
  }

  const isQuarterly = frequency === "Quarterly";
  const periodsPerYear = isQuarterly ? 4 : 12;
  const monthsPerPeriod = isQuarterly ? 3 : 1;

  // Active repayment duration after moratorium
  const effectiveTenureMonths = Math.max(tenureMonths - moratoriumMonths, monthsPerPeriod);
  const totalPeriods = Math.ceil(effectiveTenureMonths / monthsPerPeriod);
  const moratoriumPeriods = Math.floor(moratoriumMonths / monthsPerPeriod);

  const periodicRate = annualInterestRate / periodsPerYear;

  // Amortizing instalment formula: P * r * (1+r)^n / ((1+r)^n - 1)
  let instalmentAmount = 0;
  if (periodicRate === 0) {
    instalmentAmount = principal / totalPeriods;
  } else {
    const factor = Math.pow(1 + periodicRate, totalPeriods);
    instalmentAmount = (principal * periodicRate * factor) / (factor - 1);
  }

  const schedule: AmortizationPeriod[] = [];
  let balance = principal;
  let accumulatedInterest = 0;

  // Moratorium periods (if any)
  for (let m = 1; m <= moratoriumPeriods; m++) {
    const periodInterest = balance * periodicRate;
    accumulatedInterest += periodInterest;
    schedule.push({
      period: m,
      periodLabel: isQuarterly ? `Quarter ${m} (Moratorium)` : `Month ${m} (Moratorium)`,
      openingBalance: balance,
      instalment: 0,
      principalPaid: 0,
      interestPaid: periodInterest,
      closingBalance: balance,
      isMoratorium: true,
    });
  }

  // Amortizing repayment periods
  for (let p = 1; p <= totalPeriods; p++) {
    const interest = balance * periodicRate;
    let principalPaid = instalmentAmount - interest;
    if (p === totalPeriods || principalPaid > balance) {
      principalPaid = balance;
    }
    const closing = Math.max(0, balance - principalPaid);
    accumulatedInterest += interest;

    const periodIndex = moratoriumPeriods + p;
    schedule.push({
      period: periodIndex,
      periodLabel: isQuarterly ? `Quarter ${p}` : `Month ${p}`,
      openingBalance: balance,
      instalment: principalPaid + interest,
      principalPaid,
      interestPaid: interest,
      closingBalance: closing,
      isMoratorium: false,
    });

    balance = closing;
    if (balance <= 0) break;
  }

  const totalAmountPayable = principal + accumulatedInterest;

  return {
    principal,
    annualInterestRate,
    tenureMonths,
    frequency,
    instalmentAmount: Math.round(instalmentAmount),
    totalInstalments: totalPeriods,
    totalInterest: Math.round(accumulatedInterest),
    totalAmountPayable: Math.round(totalAmountPayable),
    moratoriumMonths,
    moratoriumNote:
      moratoriumMonths > 0
        ? `Includes a ${moratoriumMonths}-month grace period where principal repayment is deferred.`
        : "Standard instalment schedule from commencement.",
    schedule,
  };
}
