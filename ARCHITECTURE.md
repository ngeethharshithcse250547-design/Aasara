# Scheme Sahayak — Technical Architecture Inventory

This document provides a simple, comprehensive overview of the current state of the Scheme Sahayak codebase.

## 1. Overall Application Architecture
Scheme Sahayak is a front-end-heavy Next.js 16 (React 19) application utilizing the App Router. It uses a purely client-side, in-memory state management pattern via React Context (`profileContext.tsx`) and LocalStorage. The application is built to function statelessly and completely on the client-side for Phase 1, prioritizing speed, accessibility, and offline-capable principles. All data (schemes, partners) is bundled at build-time.

---

## 2. Routes (App Router)
- **`/` (Home)**: Landing page introducing the tool, its features, and trust badges. Contains primary calls-to-action to start the assessment.
- **`/assessment`**: The core multi-step questionnaire that captures user state (community, certificate status, purpose, amount, income, state).
- **`/results`**: Evaluates the assessment profile against the deterministic matching engine and displays the single best matching scheme (or no match).
- **`/calculator`**: A loan repayment calculator pre-filled with the matched scheme's interest rates and moratorium limits.
- **`/readiness`**: A dynamic checklist of required documents customized to the matched scheme and user profile.
- **`/partners`**: The geo-spatial directory showing where to apply (banks and state agencies), pre-filtered by the user's state.

---

## 3. Components
- **`Header.tsx`**: Main navigation bar containing the logo, language switcher, and mobile menu.
- **`Footer.tsx`**: Standard application footer with links and trust disclaimers.
- **`ChatbotDrawer.tsx`**: A sliding drawer interface intended for a conversational AI assistant. Currently contains a placeholder indicating integration is pending.
- **`PartnerMap.tsx`**: A MapLibre GL JS map component that places aggregated pins at state capital locations, handles geolocation, and allows state filtering.
- **`ClientProviders.tsx`**: Wraps the application in the `ProfileProvider` for global state management.
- **`PlaceholderPage.tsx`**: A generic fallback UI component for under-construction features.

---

## 4. Lib / Core Modules
- **`matchingEngine.ts`**: The deterministic rules engine. It takes the `ProfileContext` and evaluates it against all schemes in the database. It handles logic for income caps, project limits, and calculates a match percentage.
- **`calculatorEngine.ts`**: Contains financial formulas (EMI calculation) respecting specific scheme rules like moratoriums (grace periods) where only simple interest is charged before EMI begins.
- **`i18n.ts`**: A custom, lightweight internationalization system. Uses flat dictionaries (en, hi, te) and a `t()` function for translations.
- **`profileContext.tsx`**: Global React Context managing the user's assessment answers, language preference, and currently selected scheme. Persists data to `localStorage`.

---

## 5. Data Files
- **`data/schemes.ts`**: The structured database of government financial schemes (e.g., MFS, TL, AMY, Udyam Nidhi). Contains interest rates, max amounts, income limits, and compatibility rules.
- **`data/partners.ts`**: The verified directory of 91 channel partners (SCAs, PSBs, RRBs, etc.) and their state-level operating regions.
- **`data/documents.ts`**: Contains the mapping of required documents (e.g., Aadhaar, Caste Certificate, Project Report) and the rules for when they are required.
- **`data/stateCoordinates.ts`**: A static dictionary mapping Indian states to the latitude/longitude of their capital cities, used as anchor points for the Partner Map.

---

## 6. How Assessment Data Flows
1. User interacts with `<form>` elements in `/assessment`.
2. Answers are instantly saved to the global `ProfileContext` via `updateProfile(updates)`.
3. `profileContext.tsx` simultaneously saves the state to browser `localStorage`.
4. When the user navigates to `/results`, the `ProfileContext` is read by the `matchingEngine`.

---

## 7. How the Matching Engine Works
The `findBestMatch(profile)` function in `matchingEngine.ts`:
1. Iterates through all schemes in `data/schemes.ts`.
2. Evaluates hard boolean rules (e.g., "Is community SC?", "Is income under 3L?").
3. Records "reasons" if a scheme fails a check.
4. Calculates a match score (0-100) based on how well the requested amount fits the scheme's limits.
5. Sorts the results by match score and returns the top result and a list of alternative/failed schemes.

---

## 8. How Results are Generated
The `/results` page calls `findBestMatch(profile)`. If a match is found, it updates `selectedSchemeId` in the `ProfileContext`. It then renders a "Best Match" card detailing the scheme, along with secondary cards explaining why other schemes were not a fit based on the engine's reasons.

---

## 9. How the Calculator Works
The `/calculator` page reads the `selectedSchemeId`. It fetches the specific interest rate, max tenure, and moratorium (grace period) months from `data/schemes.ts`. It uses `calculatorEngine.ts` to compute the EMI, calculating simple interest during the moratorium and standard EMI for the remaining tenure.

---

## 10. How Document Readiness Works
The `/readiness` page reads the `ProfileContext`. It evaluates rules in `data/documents.ts` (e.g., "If `profile.casteCertificate === 'applied'`, show the receipt requirement"). It renders a dynamic checklist tailored specifically to the matched scheme and the user's current situation.

---

## 11. How the Partner Map Works
`PartnerMap.tsx` dynamically loads MapLibre GL JS. Because the verified dataset (`partners.ts`) lacks exact branch coordinates, the map aggregates partners by state. It plots pins at the state capital coordinates defined in `stateCoordinates.ts`. Clicking a pin filters the directory list below the map. "Use My Location" utilizes the browser's Geolocation API and a Haversine distance formula to find the nearest state capital and auto-select that state.

---

## 12. How Google Maps Directions are Generated
Inside `app/partners/page.tsx`, the `PartnerCardMobile` component constructs a custom directions URL. It extracts the city name from the partner's `locationScope` field (if available) using Regex. It formats a query: `https://www.google.com/maps/dir/?api=1&destination=[Partner Name], [City], [State], India`. It explicitly labels the button as "Approximate area".

---

## 13. How i18n Works
Translations are stored in `lib/i18n.ts` as flat TypeScript objects (`en`, `hi`, `te`). UI components call `t("key", locale)`. The `locale` is derived from `profileContext.tsx`. If a key is missing in the target language, it automatically falls back to English.

---

## 14. How User Profile / LocalStorage Works
`profileContext.tsx` uses a `useEffect` hook to hydrate state from `localStorage` on initial client load. Whenever `updateProfile` is called, the new state is serialized and written back to `localStorage` under the key `scheme_sahayak_profile`, allowing users to close the tab and return without losing their progress.

---

## 15. Chatbot Architecture
- **Status**: UI Shell only.
- **Details**: `components/ChatbotDrawer.tsx` exists and can be toggled via the UI. However, the logic is stubbed out. There is no active API route or state management for message history.

---

## 16. Voice Architecture
- **Status**: UI Shell only.
- **Details**: The assessment page has a "Use Voice" button and a placeholder listening state, but the Web Speech API (SpeechRecognition) is not actually implemented to parse speech into form data.

---

## 17. MapLibre Architecture
- **Status**: IMPLEMENTED.
- **Location**: Imported dynamically in `app/partners/page.tsx` and implemented in `components/PartnerMap.tsx`.
- **Environment Variable**: None required. Uses public Carto Voyager tile style.

---

## 18. Supabase Usage
- **Status**: NOT IMPLEMENTED.
- **Details**: A search of the codebase reveals that Supabase is only mentioned in `PROJECT_SPEC.md` as a "later integration" for PostgreSQL. It is not installed in `package.json` and no Supabase clients exist in the code.

---

## 19. OpenRouter / LLM Usage
- **Status**: NOT IMPLEMENTED.
- **Details**: Mentioned in `PROJECT_SPEC.md` and `01_PS_ANALYSIS.md` as the intended engine for the chatbot and voice extraction. There are no API keys, fetch calls, or SDKs for OpenRouter or any LLM in the current codebase.

---

## 20. Environment Variables
- None currently required.

---

## JURY CHEAT SHEET

| Technology | Why we use it | Where it is used |
|------------|---------------|------------------|
| **Next.js (App Router)** | Provides fast client-side routing, static generation, and a robust React architecture. | Entire application framework (`app/` directory). |
| **TypeScript** | Ensures strict type safety, eliminating runtime errors for scheme and profile data structures. | Globally. |
| **Tailwind CSS** | Allows rapid, responsive, and consistent UI styling without external stylesheets. | All components (via `className`). |
| **MapLibre GL JS** | Renders high-performance, interactive vector maps for geo-spatial partner routing without token requirements. | `components/PartnerMap.tsx`. |
| **LocalStorage** | Persists user assessment data locally without requiring a database or user login. | `lib/profileContext.tsx`. |
| **Rule-based engine** | Deterministically matches user profiles to schemes based on strict government policy criteria without hallucination. | `lib/matchingEngine.ts`. |
| **Supabase** | Backend database for live partner data and auth. | *NOT IMPLEMENTED*. |
| **OpenRouter (LLM)** | NLP extraction for voice/text input to bypass complex forms. | *NOT IMPLEMENTED*. |
