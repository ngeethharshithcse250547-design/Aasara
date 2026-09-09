# Scheme Sahayak — Project Specification

**Product:** Scheme Sahayak  
**Tagline:** From eligibility to action.  
**Context:** Smart India Hackathon 2026, PS 26092 — AI-Driven Scheme Matching for Marginalized Entrepreneurs.

## Product promise

Scheme Sahayak helps a prospective NSFDC beneficiary move from a financial need to a clear, accountable next step. It is not an official government service and it does not grant, approve, or promise a loan.

The product is specialised around **Eligibility → Readiness → Action**:

```text
DISCOVER → MATCH → CALCULATE → PREPARE → ROUTE
```

1. **Discover:** understand the user’s stated need through a guided form and, later, optional natural-language/voice input.
2. **Match:** use a source-versioned deterministic rules engine to identify potential scheme fits and open conditions.
3. **Calculate:** provide an explicitly indicative repayment view using verified scheme terms and correct payment frequency.
4. **Prepare:** distinguish possible eligibility from the evidence/documents still needed to apply.
5. **Route:** surface an official digital route or verified channel-partner directory record, with dated source information.

## Source of truth

The following project-root files are the source of truth. Product data and public-facing claims must be derived from their official citations, not invented:

- `01_PS_ANALYSIS.md`
- `02_SCHEME_DATABASE.xlsx`
- `03_CHANNEL_PARTNERS.xlsx`
- `04_COMPETITOR_ANALYSIS.md`
- `05_REFERENCES.md`

## Architecture direction

```text
Next.js + TypeScript + Tailwind UI
              ↓
        Next.js route handlers (later)
              ↓
    Supabase / PostgreSQL (later)
              ↓
Source-versioned scheme & partner records
              ↓
Deterministic matching + readiness + calculator modules
              ↓
Results / official routing guidance
```

Later integrations: **OpenRouter** for bounded text/voice profile extraction and explanations; **Mapbox** for visualising verified partner locations; **Vercel** for deployment. These services are deliberately not installed or connected in Stage 1.

### Critical decision boundary

An LLM may turn free text or speech into a structured profile draft. It must **not** make the final eligibility/matching decision. The deterministic rules engine will evaluate reviewed, versioned records and show its reasons and unresolved conditions.

## Routes

| Route | Purpose | Stage 1 status |
|---|---|---|
| `/` | Product introduction and journey overview | Implemented |
| `/assessment` | Guided beneficiary profile | Placeholder only |
| `/results` | Explained potential scheme matches | Placeholder only |
| `/calculator` | Indicative repayment calculator | Placeholder only |
| `/readiness` | Document/application readiness | Placeholder only |
| `/partners` | Official route and verified directory | Placeholder only |

## Stage plan

### Stage 1 — foundation (this delivery)

- Next.js, TypeScript and Tailwind project setup.
- Responsive shared navigation and footer.
- Polished responsive Home page.
- All six application routes, with truthful placeholders away from the Home page.
- No external integrations, database, authentication, matching, calculator, or maps.

### Next stages (not implemented yet)

1. Import and validate the reviewed scheme data.
2. Build deterministic potential-match logic and explainable results.
3. Add calculator using scheme-specific payment frequency and published assumptions.
4. Add readiness workflow.
5. Add verified channel-partner filtering/routing.
6. Add bounded AI and optional voice input only after the deterministic journey works.

## Non-negotiable development rules

- Use **potential match** language until an authorised agency reviews an application.
- Never invent government rules, interest terms, documents, scheme details, partner locations, or live availability.
- Never describe a demo/simulated partner status as live. Keep it visibly separate from verified information.
- Preserve an official source URL, source/effective date, and last-verified date for rule and directory records when data is integrated.
- Do not imply direct NSFDC beneficiary loan applications; future routing must use the documented official channel/PM-SURAJ path where applicable.
- Collect the minimum personal data required; do not infer protected attributes or store sensitive documents in the MVP.
- Keep the interface trustworthy, accessible, mobile responsive, and free of fake government logos, fake statistics, excessive animation, or unsupported claims.
