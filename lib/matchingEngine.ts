import { SCHEMES, Scheme } from "./data/schemes";

export interface BeneficiaryProfile {
  isScheduledCaste: boolean;
  casteCertificateStatus: "in_hand" | "applied" | "not_available";
  annualFamilyIncome: number;
  purpose: "business" | "education";
  requestedAmount: number;
  projectOrCourseCost: number;
  state: string;
  district?: string;
  educationLevel?: "graduate" | "post_graduate" | "diploma" | "other";
  educationLocation?: "india" | "abroad";
  isFullTimeCourse?: boolean;
}

export type MatchStatus = "potential_match" | "conditional_match" | "not_a_match";

export interface SchemeMatchResult {
  scheme: Scheme;
  status: MatchStatus;
  statusLabel: string;
  statusColor: "emerald" | "amber" | "rose";
  reasons: string[];
  openConditions: string[];
  calculatedAssistance: number;
  maxPermissibleCost: number | null;
  ruleCitations: {
    ruleId: string;
    ruleText: string;
    source: string;
  }[];
}

export const INCOME_CEILING = 500000; // ₹5,00,000 p.a.

export function evaluateSchemes(profile: BeneficiaryProfile): SchemeMatchResult[] {
  return SCHEMES.map((scheme) => evaluateSingleScheme(profile, scheme));
}

function evaluateSingleScheme(profile: BeneficiaryProfile, scheme: Scheme): SchemeMatchResult {
  const reasons: string[] = [];
  const openConditions: string[] = [];
  const ruleCitations = [];

  let status: MatchStatus = "potential_match";

  // 1. Mandatory Baseline: Community
  if (!profile.isScheduledCaste) {
    status = "not_a_match";
    reasons.push("Applicant does not belong to Scheduled Caste community.");
    ruleCitations.push({
      ruleId: "COMMON-01",
      ruleText: "Must belong to Scheduled Caste and hold valid caste certificate",
      source: "NSFDC FAQ",
    });
  } else if (profile.casteCertificateStatus === "not_available") {
    status = "conditional_match";
    openConditions.push("Caste certificate is required before formal submission to SCA/partner.");
  } else if (profile.casteCertificateStatus === "applied") {
    status = "conditional_match";
    reasons.push("SC community declared; certificate application in progress.");
    openConditions.push("Physical/DigiLocker caste certificate copy must be produced upon application.");
  } else {
    reasons.push("SC community confirmed with certificate in hand.");
    ruleCitations.push({
      ruleId: "COMMON-01",
      ruleText: "Must belong to Scheduled Caste and hold valid caste certificate",
      source: "NSFDC FAQ",
    });
  }

  // 2. Mandatory Baseline: Income Ceiling (₹5,00,000)
  if (profile.annualFamilyIncome > INCOME_CEILING) {
    status = "not_a_match";
    reasons.push(`Annual family income of ₹${profile.annualFamilyIncome.toLocaleString("en-IN")} exceeds the statutory ceiling of ₹5,00,000.`);
    ruleCitations.push({
      ruleId: "COMMON-02",
      ruleText: "Annual family income from all sources <= INR 5,00,000; rural and urban (effective 7 Jan 2026)",
      source: "NSFDC FAQ",
    });
  } else {
    reasons.push(`Annual family income of ₹${profile.annualFamilyIncome.toLocaleString("en-IN")} is within the official ₹5,00,000 ceiling.`);
    ruleCitations.push({
      ruleId: "COMMON-02",
      ruleText: "Annual family income from all sources <= INR 5,00,000; rural and urban (effective 7 Jan 2026)",
      source: "NSFDC FAQ",
    });
  }

  // 3. Purpose check (Business vs. Education)
  if (scheme.purpose !== profile.purpose) {
    status = "not_a_match";
    reasons.push(`Scheme is designed for ${scheme.purpose === "education" ? "higher technical/professional education" : "income-generating business/trade activities"}, whereas stated need is ${profile.purpose}.`);
  } else {
    reasons.push(`Purpose matches: ${scheme.useCase} (${profile.purpose}).`);
  }

  // 4. Scheme-Specific Evaluation
  const effectiveCost = profile.projectOrCourseCost > 0 ? profile.projectOrCourseCost : profile.requestedAmount;

  if (scheme.id === "MFS") {
    if (effectiveCost > 140000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds the MFS ceiling of ₹1,40,000. Consider Term Loan (TL) or Udyam Nidhi Yojana (UNY).`);
    } else {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within MFS ceiling of ₹1,40,000.`);
      openConditions.push("Instalments are published as Quarterly; final sanction rests with SCA / Channelizing Agency.");
    }
  } else if (scheme.id === "AMY") {
    if (effectiveCost > 140000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds the AMY micro-credit limit of ₹1,40,000.`);
    } else {
      reasons.push(`Project cost is eligible for micro-credit delivery via accredited NBFC-MFIs.`);
      openConditions.push("Selected NBFC-MFI field verification, credit terms, and group norms apply.");
    }
  } else if (scheme.id === "TL") {
    if (effectiveCost <= 140000) {
      if (status !== "not_a_match") status = "conditional_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is below standard Term Loan threshold (₹1,40,001). MFS or UNY is better suited for smaller requirements.`);
      openConditions.push("Small projects are normally routed under MFS to benefit from 6.5% interest rate instead of 8.0%.");
    } else if (effectiveCost > 5000000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds maximum Term Loan cap of ₹50,00,000.`);
    } else {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within standard Term Loan bracket (₹1,40,001 to ₹50,00,000).`);
      openConditions.push("Detailed Project Report (DPR) and financial viability evaluation required by SCA.");
    }
  } else if (scheme.id === "UNY") {
    if (effectiveCost > 500000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds Udyam Nidhi ceiling of ₹5,00,000. Consider Term Loan (TL).`);
    } else {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within Udyam Nidhi ceiling of ₹5,00,000.`);
      openConditions.push("Applicable interest rate depends on channel: 13% via Co-operative Banks/Societies; 15% via Small Finance Banks.");
    }
  } else if (scheme.id === "ELS") {
    if (profile.purpose === "education") {
      if (profile.educationLevel && profile.educationLevel !== "graduate" && profile.educationLevel !== "post_graduate") {
        if (status !== "not_a_match") status = "conditional_match";
        openConditions.push("Course must be a regular full-time recognized professional/technical course at graduate or higher level.");
      } else {
        reasons.push("Recognized graduate/post-graduate technical/professional course scope aligned.");
      }
      openConditions.push("Confirmed admission proof and institutional fee schedule must be validated.");
      openConditions.push("Repayment starts after completion of course duration plus 1 year moratorium.");
    }
  }

  // Calculate permissible assistance (up to 90% of cost, capped at scheme maxLoanAmount)
  const maxAssistancePct = scheme.subsidyOrAssistancePct; // 0.90
  const calculatedAssistance = Math.min(
    Math.round(effectiveCost * maxAssistancePct),
    scheme.maxLoanAmount
  );

  let statusLabel = "Potential match";
  let statusColor: "emerald" | "amber" | "rose" = "emerald";

  if (status === "conditional_match") {
    statusLabel = "Needs more information / conditions";
    statusColor = "amber";
  } else if (status === "not_a_match") {
    statusLabel = "Does not match baseline";
    statusColor = "rose";
  }

  return {
    scheme,
    status,
    statusLabel,
    statusColor,
    reasons,
    openConditions,
    calculatedAssistance: status === "not_a_match" ? 0 : calculatedAssistance,
    maxPermissibleCost: scheme.maxProjectCost,
    ruleCitations,
  };
}
