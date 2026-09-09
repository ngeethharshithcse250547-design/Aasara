# SIH PS 26092 - Research and Product Analysis

**Problem statement:** AI-Driven Scheme Matching for Marginalized Entrepreneurs  
**Ministry:** Ministry of Social Justice & Empowerment  
**Primary domain authority:** National Scheduled Castes Finance and Development Corporation (NSFDC)  
**Research verified:** 9 September 2026

## 1. The problem to solve

Eligible Scheduled Caste beneficiaries need more than a list of schemes. They need a clear path from a financial need to an appropriate, actionable option. Under the NSFDC channel-finance model, beneficiaries do not apply directly to NSFDC; loans are routed through authorised State Channelizing Agencies (SCAs) or other Channelizing Agencies (CAs).

PS 26092 calls for three connected capabilities:

1. A smart scheme recommender.
2. A financial calculator.
3. A geo-spatial channel-partner locator and router.

The product should convert a beneficiary's circumstances into an explained recommendation, an understandable repayment view, a readiness checklist, and a safe next step.

## 2. User and verified baseline eligibility

Primary users are Scheduled Caste beneficiaries seeking concessional finance for viable income-generating activity or eligible professional/technical education.

| Rule | Verified baseline for the MVP | Product implication |
|---|---|---|
| Community | Applicant must belong to the Scheduled Caste community and hold a valid caste certificate. | Ask for community/certificate status. Never infer caste. |
| Income | Annual family income from all sources must be at most INR 5,00,000, for rural and urban applicants, effective 7 January 2026. | Keep as versioned policy data, not hard-coded UI text. |
| Direct application | NSFDC does not entertain direct beneficiary applications or disburse directly. | Route to PM-SURAJ or authorised partner workflow. |
| Required baseline evidence | Caste certificate, income proof and KYC, plus agency/scheme checklist items. | Separate eligibility from application readiness. |

These are common entry conditions for NSFDC credit schemes. Scheme-specific qualification, viability checks, lender assessment, documents and sanctions remain the responsibility of the relevant authorised agency.

## 3. Scope for the MVP

### In scope

- Five current primary NSFDC credit products: MFS, AMY, Term Loan, UNY and ELS.
- Explainable rules for community, income, purpose, project-cost/loan range and study intent.
- A repayment estimator that clearly states its assumptions.
- A document/readiness checklist that distinguishes confirmed evidence from missing evidence.
- Channel partner discovery using only verified partner records, with a prominent verification date.
- Offline application guidance and the official PM-SURAJ route.

### Explicitly out of scope for a prototype

- Final loan approval or promise of eligibility.
- Credit scoring, caste verification, KYC storage or document upload to government systems.
- Live fund-utilisation, overdue, NPA, turnaround-time or branch-capacity claims unless an authorised live feed is available.
- An LLM making the final eligibility decision.

## 4. Proposed service journey

```text
Voice / text / form input
          |
Structured beneficiary profile
          |
Verified deterministic rule engine
          |
Explainable scheme matches + alternatives
          |
Loan / repayment estimator
          |
Readiness checklist
          |
Verified channel-partner directory + route
          |
PM-SURAJ / authorised agency next step
```

### Design principle: Eligibility -> Readiness -> Action

**Eligibility** answers: "Which product may fit my stated situation?"  
**Readiness** answers: "Which evidence or project details still need attention?"  
**Action** answers: "Which official route or partner category should I approach next?"

This is the product's defensible specialization. It does not claim to replace an official sanctioning process.

## 5. Scheme-matching approach

The AI layer may translate speech or free text into a structured draft profile. A deterministic rules engine must make the displayed match. Each result should show the exact pass/fail reasons, source URL, version date and unresolved conditions.

Minimum profile fields:

- SC certificate available or not stated
- annual family income
- requested purpose: business / education
- requested amount and project or course cost
- state and district
- education/course attributes where relevant
- available documents

Minimum result fields:

- scheme name and official parameter snapshot
- match status: potential match / needs more information / does not match baseline
- reasons and open conditions
- maximum assistance and published interest/term fields
- source and last-verified date

## 6. Financial calculator guardrails

Use the standard amortising-payment formula only as an estimator:

`EMI = P x r x (1 + r)^n / ((1 + r)^n - 1)`

where `P` is principal, `r` is monthly interest rate and `n` is number of repayment instalments. MFS is published as quarterly instalments, so its calculator must not silently show a monthly EMI. Moratorium treatment, actual loan amount, disbursement timing and instalment schedule must be labelled as subject to the relevant scheme and agency terms.

## 7. Channel-partner routing rules

NSFDC lists eight partner categories and 102 partners in its current FAQ. Its downloadable category registers currently enumerate 91 named organisations. The prototype must show the record source and date, and treat the published 102 figure as a directory reconciliation item, not evidence that an unnamed partner exists.

Do not rank a real partner using invented financial data. The routing filter should use:

- verified partner category and geography;
- stated scheme route/category;
- current directory availability; and
- any actual, authorised operational feed if it becomes available.

Where the UI needs a live-status demonstration, use an unmistakable **SIMULATED / DEMO ONLY** label and never mix it with verified partner data.

## 8. Official prudential information relevant to routing

NSFDC's current allocation guidance requires adequate government/bank guarantee, no overdues payable to NSFDC and 100% cumulative utilisation of earlier disbursements for SCA/CA fund releases. For RRBs, the guidance additionally states net NPA below 15% in at least three of the preceding six years and net profit in at least three of those six years.

These are disbursement norms, not a universal consumer-facing partner score. They must not be turned into a blanket rule such as "NPA under 5%" or used to label any named partner as eligible/ineligible without timely official data.

## 9. SIH judging alignment

The uploaded internal SIH judging sheet allocates 20 marks each to Proposed Solution, Technical Approach, Feasibility and Viability, Impact and Benefits, and Research and References.

| Criterion | Evidence the team should demonstrate |
|---|---|
| Proposed Solution | One beneficiary journey through match, explanation, calculator, readiness and route. |
| Technical Approach | Voice/text extraction is separated from deterministic, source-versioned rules. |
| Feasibility and Viability | Five-scheme MVP; static verified registry; no claims of live lender data; refresh workflow. |
| Impact and Benefits | Fewer dead ends, clearer repayment understanding, document preparation and accountable routing. |
| Research and References | Official NSFDC scheme/partner pages, official myScheme comparison and a dated evidence register. |

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Policy values change | Store effective date, source URL and last-verified date for every rule. |
| False eligibility certainty | Use "potential match" language and show open conditions. |
| Hallucinated rules | The LLM only structures input; rule engine uses reviewed policy records. |
| Stale partner directory | Show source document date; run a documented periodic refresh; preserve reconciliation flag. |
| Sensitive data exposure | Collect minimum data, avoid permanent storage for MVP and never infer protected attributes. |
| Misleading calculator output | State instalment frequency and moratorium assumptions; treat output as estimate only. |

## 11. Recommended build order

1. Import the five reviewed scheme records from `02_SCHEME_DATABASE.xlsx`.
2. Build one vertical flow: small business request -> MFS potential match -> quarterly estimate -> readiness -> verified partner category.
3. Add Term Loan and UNY, then AMY and ELS.
4. Add state/district filtering from `03_CHANNEL_PARTNERS.xlsx`.
5. Add multilingual voice/text input only after the deterministic flow is working.
6. Add clearly simulated live-status cards only if the demo needs them.

## Source note

The current official values in this pack supersede older secondary summaries. See `05_REFERENCES.md` for stable URLs, access dates and source roles.
