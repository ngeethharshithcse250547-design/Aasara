import { SCHEMES, Scheme } from "./data/schemes";
import type { Locale } from "./i18n";

export type CommunityCategory = "SC" | "ST" | "Other" | "prefer_not_to_say";

export interface BeneficiaryProfile {
  // Community / caste — expandable architecture
  community?: CommunityCategory;
  isScheduledCaste?: boolean;  // derived from community === "SC" for matching
  casteCertificateStatus?: "in_hand" | "applied" | "not_available";

  // Financial
  annualFamilyIncome: number;
  purpose?: "business" | "education";
  requestedAmount: number;
  projectOrCourseCost: number;

  // Location
  state: string;
  district?: string;

  // Education (when purpose = education)
  educationLevel?: "graduate" | "post_graduate" | "diploma" | "other";
  educationLocation?: "india" | "abroad";
  isFullTimeCourse?: boolean;

  // App settings
  locale: Locale;
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

/**
 * A1/A2: Check whether the user has completed the minimum required assessment fields.
 * Income = 0 and amount = 0 are treated as "unanswered", not as genuine values.
 */
export function isAssessmentComplete(profile: BeneficiaryProfile): boolean {
  if (profile.community === undefined) return false;
  if (profile.purpose === undefined) return false;
  if (profile.annualFamilyIncome <= 0) return false;
  if (profile.requestedAmount <= 0) return false;
  return true;
}

export function evaluateSchemes(profile: BeneficiaryProfile): SchemeMatchResult[] {
  return SCHEMES.map((scheme) => evaluateSingleScheme(profile, scheme));
}

/**
 * A4: Deterministic best-match ranking.
 *
 * For business schemes:
 *   1. Only consider schemes that are potential_match (fallback: conditional_match).
 *   2. Prefer the scheme whose cost bracket best fits the user's requested amount.
 *   3. Tie-break by lower beneficiary interest rate.
 *   4. Further tie-break by higher calculatedAssistance.
 *
 * Returns { bestMatch, otherMatches } — both deterministic and explainable.
 */
export function rankMatches(allResults: SchemeMatchResult[], requestedAmount: number): {
  bestMatch: SchemeMatchResult | undefined;
  otherMatches: SchemeMatchResult[];
} {
  // First try potential_match, then fall back to conditional_match
  let candidates = allResults.filter((r) => r.status === "potential_match");
  if (candidates.length === 0) {
    candidates = allResults.filter((r) => r.status === "conditional_match");
  }

  if (candidates.length === 0) {
    return { bestMatch: undefined, otherMatches: [] };
  }

  // Score each candidate for deterministic sorting
  const scored = candidates.map((r) => {
    // Cost-bracket fit score: 0 = amount falls within [min, max], higher = worse
    const min = r.scheme.minProjectCost;
    const max = r.scheme.maxProjectCost;
    let bracketDistance = 0;
    if (requestedAmount > 0) {
      if (max !== null && requestedAmount > max) {
        bracketDistance = requestedAmount - max;
      } else if (requestedAmount < min) {
        bracketDistance = min - requestedAmount;
      }
      // else bracketDistance = 0, perfect fit
    }

    return {
      result: r,
      bracketDistance,
      interestRate: r.scheme.interestRate,
      assistance: r.calculatedAssistance,
    };
  });

  // Sort: lowest bracketDistance → lowest interest rate → highest assistance
  scored.sort((a, b) => {
    if (a.bracketDistance !== b.bracketDistance) return a.bracketDistance - b.bracketDistance;
    if (a.interestRate !== b.interestRate) return a.interestRate - b.interestRate;
    if (a.assistance !== b.assistance) return b.assistance - a.assistance;
    // Final stable tie-break: scheme ID alphabetical
    return a.result.scheme.id.localeCompare(b.result.scheme.id);
  });

  return {
    bestMatch: scored[0].result,
    otherMatches: scored.slice(1).map((s) => s.result),
  };
}

function evaluateSingleScheme(profile: BeneficiaryProfile, scheme: Scheme): SchemeMatchResult {
  const reasons: string[] = [];
  const openConditions: string[] = [];
  const ruleCitations: { ruleId: string; ruleText: string; source: string }[] = [];

  let status: MatchStatus = "potential_match";

  // --- 1. Mandatory Baseline: Community ---
  const isSC = profile.isScheduledCaste ?? (profile.community === "SC");
  const communityUnanswered = profile.community === undefined && profile.isScheduledCaste === undefined;

  if (communityUnanswered) {
    status = "conditional_match";
    openConditions.push("Community / caste information not yet provided.");
  } else if (!isSC) {
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
  } else if (profile.casteCertificateStatus === undefined) {
    if (isSC) {
      status = "conditional_match";
      openConditions.push("Certificate status not yet provided.");
    }
  } else {
    reasons.push("SC community confirmed with certificate in hand.");
    ruleCitations.push({
      ruleId: "COMMON-01",
      ruleText: "Must belong to Scheduled Caste and hold valid caste certificate",
      source: "NSFDC FAQ",
    });
  }

  // --- 2. Mandatory Baseline: Income Ceiling (₹5,00,000) ---
  // A2: Treat income = 0 as unanswered, not as a genuine value
  if (profile.annualFamilyIncome <= 0) {
    if (status !== "not_a_match") status = "conditional_match";
    openConditions.push("Annual family income not yet provided.");
  } else if (profile.annualFamilyIncome > INCOME_CEILING) {
    status = "not_a_match";
    reasons.push(`Annual family income of ₹${profile.annualFamilyIncome.toLocaleString("en-IN")} exceeds the statutory ceiling of ₹5,00,000.`);
    ruleCitations.push({
      ruleId: "COMMON-02",
      ruleText: "Annual family income from all sources <= INR 5,00,000; rural and urban (effective 7 Jan 2026)",
      source: "NSFDC FAQ",
    });
  } else {
    // A6: Only add positive reason if not already disqualified
    if (status !== "not_a_match") {
      reasons.push(`Annual family income of ₹${profile.annualFamilyIncome.toLocaleString("en-IN")} is within the official ₹5,00,000 ceiling.`);
    }
    ruleCitations.push({
      ruleId: "COMMON-02",
      ruleText: "Annual family income from all sources <= INR 5,00,000; rural and urban (effective 7 Jan 2026)",
      source: "NSFDC FAQ",
    });
  }

  // --- 3. Purpose check (Business vs. Education) ---
  if (profile.purpose === undefined) {
    if (status !== "not_a_match") status = "conditional_match";
    openConditions.push("Purpose (business or education) not yet specified.");
  } else if (scheme.purpose !== profile.purpose) {
    status = "not_a_match";
    reasons.push(`Scheme is designed for ${scheme.purpose === "education" ? "higher technical/professional education" : "income-generating business/trade activities"}, whereas stated need is ${profile.purpose}.`);
  } else {
    // A6: Only add positive reason if not already disqualified
    if (status !== "not_a_match") {
      reasons.push(`Purpose matches: ${scheme.useCase} (${profile.purpose}).`);
    }
  }

  // --- 4. Scheme-Specific Evaluation ---
  // A2: Treat requestedAmount = 0 as unanswered
  const effectiveCost = profile.projectOrCourseCost > 0 ? profile.projectOrCourseCost : profile.requestedAmount;
  const costUnanswered = effectiveCost <= 0;

  if (costUnanswered) {
    if (status !== "not_a_match") status = "conditional_match";
    openConditions.push("Requested loan amount not yet provided.");
  } else if (scheme.id === "MFS") {
    if (effectiveCost > 140000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds the MFS ceiling of ₹1,40,000. Consider Term Loan (TL) or Udyam Nidhi Yojana (UNY).`);
    } else if (status !== "not_a_match") {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within MFS ceiling of ₹1,40,000.`);
      openConditions.push("Instalments are published as Quarterly; final sanction rests with SCA / Channelizing Agency.");
    }
  } else if (scheme.id === "AMY") {
    if (effectiveCost > 140000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds the AMY micro-credit limit of ₹1,40,000.`);
    } else if (status !== "not_a_match") {
      reasons.push(`Project cost is eligible for micro-credit delivery via accredited NBFC-MFIs.`);
      openConditions.push("Selected NBFC-MFI field verification, credit terms, and group norms apply.");
    }
  } else if (scheme.id === "TL") {
    if (effectiveCost <= 140000) {
      if (status !== "not_a_match") {
        status = "conditional_match";
        reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is below standard Term Loan threshold (₹1,40,001). MFS or UNY is better suited for smaller requirements.`);
        openConditions.push("Small projects are normally routed under MFS to benefit from 6.5% interest rate instead of 8.0%.");
      }
    } else if (effectiveCost > 5000000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds maximum Term Loan cap of ₹50,00,000.`);
    } else if (status !== "not_a_match") {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within standard Term Loan bracket (₹1,40,001 to ₹50,00,000).`);
      openConditions.push("Detailed Project Report (DPR) and financial viability evaluation required by SCA.");
    }
  } else if (scheme.id === "UNY") {
    if (effectiveCost > 500000) {
      status = "not_a_match";
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) exceeds Udyam Nidhi ceiling of ₹5,00,000. Consider Term Loan (TL).`);
    } else if (status !== "not_a_match") {
      reasons.push(`Project cost (₹${effectiveCost.toLocaleString("en-IN")}) is within Udyam Nidhi ceiling of ₹5,00,000.`);
      openConditions.push("Applicable interest rate depends on channel: 13% via Co-operative Banks/Societies; 15% via Small Finance Banks.");
    }
  } else if (scheme.id === "ELS") {
    if (profile.purpose === "education" && status !== "not_a_match") {
      if (profile.educationLevel && profile.educationLevel !== "graduate" && profile.educationLevel !== "post_graduate") {
        status = "conditional_match";
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
  const calculatedAssistance = costUnanswered
    ? 0
    : Math.min(Math.round(effectiveCost * maxAssistancePct), scheme.maxLoanAmount);

  // A6 final cleanup: a scheme may have accumulated positive qualifying reasons
  // before a later check flipped status to not_a_match (e.g. income passes → purpose fails).
  // Strip any misleading positive/qualifying reasons from rejected schemes.
  let finalReasons = reasons;
  if (status === "not_a_match") {
    const positivePatterns = [
      "is within the official",
      "Purpose matches",
      "is within MFS ceiling",
      "is within standard Term Loan bracket",
      "is within Udyam Nidhi ceiling",
      "eligible for micro-credit",
      "SC community confirmed",
      "course scope aligned",
    ];
    finalReasons = reasons.filter(
      (r) => !positivePatterns.some((p) => r.includes(p))
    );
  }

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
    reasons: finalReasons,
    openConditions,
    calculatedAssistance: status === "not_a_match" ? 0 : calculatedAssistance,
    maxPermissibleCost: scheme.maxProjectCost,
    ruleCitations,
  };
}
