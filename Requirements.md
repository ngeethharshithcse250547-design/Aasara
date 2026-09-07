# 📄 Product Requirements Document (PRD)
## Project: AI-Driven Scheme Matching for Marginalized Entrepreneurs
**Problem Statement ID:** 26092 | **Event:** SIH 2026

---

## 🛑 1. PROJECT BOUNDARIES (STRICT SCOPE)
*Team Lead Note: We will ONLY build what is listed in the "In Scope" section. If an idea is not on this list, it is rejected for the hackathon. This prevents scope creep.*

### ✅ IN SCOPE (What we are building)
1. Multilingual Voice/Text Interface (using Bhashini/LLM).
2. Rule-based Scheme Recommender Engine.
3. Financial Calculator (EMI with Moratorium).
4. Geo-Spatial Partner Locator (with mock NPA filtering).
5. "Scheme Readiness" Document Checklist.

### ❌ OUT OF SCOPE (What we are NOT building)
1. **Actual Loan Processing:** We are not building the bank's internal loan approval software.
2. **Live Government APIs:** We will NOT integrate live APIs for NPA data or real-time bank fund availability (we will use a robust mock database).
3. **Payment Gateway:** No money will actually change hands in this prototype.
4. **Complex Machine Learning:** We are using a deterministic Rule-Based Decision Tree for scheme matching, not a black-box neural network (to ensure 100% accuracy and explainability).

---

## 👥 2. USER PERSONAS
1. **The Beneficiary (Primary):** An SC entrepreneur or student. Low digital literacy, prefers voice/regional language, needs clear guidance.
2. **The Channel Partner (Secondary):** A bank/NBFC official. Needs to see filtered, eligible applicants to reduce their manual processing time.

---

## 🛠️ 3. CORE FEATURES & FUNCTIONAL REQUIREMENTS

### Feature 1: Multilingual Voice & Chat Interface (The USP)
* **Requirement:** Users can interact via voice or text in Hindi, English, and at least two regional languages (e.g., Tamil, Marathi).
* **Flow:** Voice Input -> Speech-to-Text (Bhashini) -> LLM processes intent -> Text-to-Speech (Bhashini) -> Voice Output.
* **Fallback:** Standard text-based chat interface if voice fails.

### Feature 2: Smart Scheme Recommender (The Brain)
* **Requirement:** An interactive questionnaire that maps user data to specific schemes.
* **Logic Rules (Examples):**
  * *If* Annual Income < ₹5 Lakhs AND Project Cost ≤ ₹1.4 Lakhs -> **Micro Finance Scheme**.
  * *If* Annual Income < ₹5 Lakhs AND Project Cost > ₹1.4 Lakhs (up to ₹50L) -> **Term Loan Scheme**.
  * *If* User is a student AND course is recognized -> **Educational Loan Scheme**.
* **Output:** Display the recommended scheme, interest rate (e.g., 6.5%), and maximum limit.

### Feature 3: Dynamic Financial Calculator (The Math)
* **Requirement:** Calculate exact repayment schedules.
* **Inputs:** Loan Amount, Interest Rate (6.5% - 15%), Tenure (Months/Years), Moratorium Period (3-12 months).
* **Logic:** 
  * During the moratorium period, simple interest accumulates on the principal. No EMI is paid.
  * Post-moratorium, the new principal (Original + Accumulated Interest) is amortized over the remaining tenure using the standard EMI formula: `EMI = [P x R x (1+R)^N] / [(1+R)^N-1]`.
* **Output:** Month-by-month amortization table and total interest payable.

### Feature 4: Geo-Spatial Partner Locator (The Map)
* **Requirement:** Show nearby Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs).
* **Logic:** 
  * Fetch user location (Lat/Long).
  * Calculate distance to partners.
  * **Crucial Filter:** Hide partners whose "Mock NPA %" is > 5% OR whose "Fund Utilization" is 100%. Only show eligible partners.
* **Output:** Interactive map with pins. Clicking a pin shows Partner Name, Distance, Eligibility Status, and a "Route Application" button.

### Feature 5: "Scheme Readiness" Checklist (The Differentiator)
* **Requirement:** Once a scheme is recommended, generate a personalized checklist of required documents (e.g., Caste Certificate, Udyam Registration, Income Proof).
* **Feature:** Provide direct links to the official government portals where they can apply for these missing documents.

---

## 💻 4. RECOMMENDED TECH STACK (Optimized for "Vibe Coding")
*Since the team relies on AI for coding, we will use tools that AI generates perfectly.*

* **Frontend (UI/UX):** **Next.js + Tailwind CSS**. 
  * *Why?* AI tools like **v0.dev** or **Lovable.dev** can generate entire, beautiful React UI components from simple text prompts. 
* **Backend & Database:** **Supabase**.
  * *Why?* It provides