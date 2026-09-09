export interface Scheme {
  id: string;
  name: string;
  hindiName: string;
  useCase: string;
  purpose: "business" | "education";
  description: string;
  minProjectCost: number;
  maxProjectCost: number | null;
  maxLoanAmount: number;
  subsidyOrAssistancePct: number; // e.g. 0.90 for up to 90%
  interestRate: number; // e.g. 0.065 for 6.5%
  rateNote?: string;
  instalmentFrequency: "Quarterly" | "Monthly";
  frequencyNote?: string;
  maxRepaymentMonths: number;
  moratoriumMonths: number;
  moratoriumNote?: string;
  channelRoute: string;
  keyConditions: string[];
  prototypeLanguage: string;
  source: string;
  officialUrl: string;
  lastVerified: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "MFS",
    name: "Micro Finance Scheme",
    hindiName: "सूक्ष्म वित्त योजना",
    useCase: "Income generating activity",
    purpose: "business",
    description: "Small business, micro-enterprise, trade, and artisan micro-credit assistance up to ₹1.4 Lakhs.",
    minProjectCost: 0,
    maxProjectCost: 140000,
    maxLoanAmount: 125000,
    subsidyOrAssistancePct: 0.9,
    interestRate: 0.065, // 6.5%
    instalmentFrequency: "Quarterly",
    frequencyNote: "Official NSFDC FAQ explicitly specifies quarterly instalment frequency.",
    maxRepaymentMonths: 36,
    moratoriumMonths: 3,
    moratoriumNote: "Standard 3-month moratorium applicable before quarterly instalments begin.",
    channelRoute: "State Channelizing Agencies (SCAs) / Channelizing Agencies (CAs)",
    keyConditions: [
      "Project cost up to ₹1,40,000",
      "Assistance up to 90% of project cost (max ₹1,25,000)",
      "Applicant must be from SC community with valid caste certificate",
      "Annual family income must not exceed ₹5,00,000",
    ],
    prototypeLanguage: "Potential match; agency decides final sanction.",
    source: "NSFDC FAQ",
    officialUrl: "https://nsfdc.nic.in/faqs",
    lastVerified: "2026-09-09",
  },
  {
    id: "AMY",
    name: "Aajeevika Micro-Finance Yojana",
    hindiName: "आजीविका सूक्ष्म वित्त योजना",
    useCase: "Income generating activity",
    purpose: "business",
    description: "Prompt, need-based micro-finance routed through selected accredited NBFC-MFIs for quick livelihood setup.",
    minProjectCost: 0,
    maxProjectCost: 140000,
    maxLoanAmount: 125000,
    subsidyOrAssistancePct: 0.9,
    interestRate: 0.15, // 15%
    rateNote: "Published NBFC-MFI beneficiary interest rate of 15% p.a.",
    instalmentFrequency: "Monthly",
    frequencyNote: "Frequency not specified in reviewed FAQ; showing monthly amortising estimate.",
    maxRepaymentMonths: 36,
    moratoriumMonths: 3,
    channelRoute: "Selected NBFC-MFIs",
    keyConditions: [
      "Project cost up to ₹1,40,000",
      "Assistance up to 90% of project cost (max ₹1,25,000)",
      "Applicant must be from SC community with valid certificate",
      "Annual family income must not exceed ₹5,00,000",
      "Routed through empanelled NBFC-MFIs",
    ],
    prototypeLanguage: "Potential match; selected NBFC-MFI terms apply.",
    source: "NSFDC FAQ",
    officialUrl: "https://nsfdc.nic.in/faqs",
    lastVerified: "2026-09-09",
  },
  {
    id: "TL",
    name: "Term Loan",
    hindiName: "सावधि ऋण योजना",
    useCase: "Income generating activity",
    purpose: "business",
    description: "Medium to large concessional finance for viable income-generating ventures and capital expansion above ₹1.4 Lakhs.",
    minProjectCost: 140001,
    maxProjectCost: 5000000,
    maxLoanAmount: 4500000,
    subsidyOrAssistancePct: 0.9,
    interestRate: 0.08, // 8.0%
    instalmentFrequency: "Monthly",
    frequencyNote: "Frequency not specified in reviewed FAQ; showing monthly amortising estimate.",
    maxRepaymentMonths: 84,
    moratoriumMonths: 6,
    moratoriumNote: "Up to 6-month moratorium; 12-month moratorium for plantation or construction activities.",
    channelRoute: "State Channelizing Agencies (SCAs) / Channelizing Agencies (CAs)",
    keyConditions: [
      "Project cost between ₹1,40,001 and ₹50,00,000",
      "Assistance up to 90% of project cost (max ₹45,00,000)",
      "Applicant must be from SC community with valid certificate",
      "Annual family income must not exceed ₹5,00,000",
      "Comprehensive project report / viability assessed by lending agency",
    ],
    prototypeLanguage: "Potential match; project viability assessed by agency.",
    source: "NSFDC FAQ",
    officialUrl: "https://nsfdc.nic.in/faqs",
    lastVerified: "2026-09-09",
  },
  {
    id: "UNY",
    name: "Udyam Nidhi Yojana",
    hindiName: "उद्यम निधि योजना",
    useCase: "Income generating activity",
    purpose: "business",
    description: "Finance for small and micro activities routed through Co-operative Societies, Co-operative Banks, and Small Finance Banks.",
    minProjectCost: 0,
    maxProjectCost: 500000,
    maxLoanAmount: 450000,
    subsidyOrAssistancePct: 0.9,
    interestRate: 0.13, // 13% default for Co-op, 15% for SFBs
    rateNote: "13% through Co-operative Societies/Banks; 15% through Small Finance Banks.",
    instalmentFrequency: "Monthly",
    frequencyNote: "Frequency not specified in reviewed FAQ; showing monthly amortising estimate.",
    maxRepaymentMonths: 60,
    moratoriumMonths: 3,
    channelRoute: "Co-operative Societies / Co-operative Banks / Small Finance Banks",
    keyConditions: [
      "Project cost up to ₹5,00,000",
      "Assistance up to 90% of project cost (max ₹4,50,000)",
      "Applicant must be from SC community with valid certificate",
      "Annual family income must not exceed ₹5,00,000",
    ],
    prototypeLanguage: "Potential match; partner route determines published rate.",
    source: "NSFDC FAQ",
    officialUrl: "https://nsfdc.nic.in/faqs",
    lastVerified: "2026-09-09",
  },
  {
    id: "ELS",
    name: "Educational Loan Scheme",
    hindiName: "शिक्षा ऋण योजना",
    useCase: "Education",
    purpose: "education",
    description: "Concessional loans for regular full-time professional or technical recognised courses at graduate or higher level in India or abroad.",
    minProjectCost: 0,
    maxProjectCost: null,
    maxLoanAmount: 4000000,
    subsidyOrAssistancePct: 0.9,
    interestRate: 0.065, // 6.5%
    instalmentFrequency: "Monthly",
    frequencyNote: "Repayment begins after course completion plus grace period.",
    maxRepaymentMonths: 144, // 12 years
    moratoriumMonths: 36, // typical course duration + 1 year
    moratoriumNote: "Moratorium covers full course duration plus 1 year post-completion grace period.",
    channelRoute: "State Channelizing Agencies (SCAs) / Channelizing Agencies (CAs)",
    keyConditions: [
      "Regular full-time professional/technical course at graduate level or higher",
      "Recognised institution in India or abroad",
      "Assistance is up to ₹40,00,000 or 90% of course fee, whichever is less",
      "Applicant must be from SC community with valid certificate",
      "Annual family income must not exceed ₹5,00,000",
    ],
    prototypeLanguage: "Potential match; recognised-course and agency terms must be confirmed.",
    source: "NSFDC FAQ",
    officialUrl: "https://nsfdc.nic.in/faqs",
    lastVerified: "2026-09-09",
  },
];

export const COMMON_ELIGIBILITY_RULES = [
  {
    id: "COMMON-01",
    name: "Community Requirement",
    description: "Must belong to the Scheduled Caste community and possess a valid caste certificate issued by an authorised revenue authority.",
    source: "NSFDC FAQ",
    effectiveDate: "2026-01-07",
    lastVerified: "2026-09-09",
  },
  {
    id: "COMMON-02",
    name: "Income Ceiling",
    description: "Annual family income from all sources must not exceed ₹5,00,000, uniformly applicable to both rural and urban applicants.",
    source: "NSFDC FAQ",
    effectiveDate: "2026-01-07",
    lastVerified: "2026-09-09",
  },
  {
    id: "COMMON-03",
    name: "Channel Financing Architecture",
    description: "NSFDC does not entertain direct beneficiary applications or disburse directly. Beneficiaries must route applications through authorised SCAs, CAs, partner banks, or the official PM-SURAJ portal.",
    source: "NSFDC FAQ",
    effectiveDate: "2026-01-07",
    lastVerified: "2026-09-09",
  },
];
