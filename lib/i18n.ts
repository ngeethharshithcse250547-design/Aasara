"use client";

export type Locale = "en" | "hi" | "te";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
  te: "తె",
};

// Translation dictionary type — flat key/value pairs
type TranslationDict = Record<string, string>;

const en: TranslationDict = {
  // Common
  "app.name": "Scheme Sahayak",
  "app.tagline": "Govt. Financial Assistance",
  "app.trust_badge": "Government Assistance for SC Entrepreneurs",
  "app.disclaimer": "Information is indicative. Final decisions rest with authorised agencies.",
  "app.prototype_label": "SIH Prototype",

  // Navigation
  "nav.home": "Home",
  "nav.assessment": "Find Schemes",
  "nav.results": "Results",
  "nav.calculator": "Repayment Calculator",
  "nav.documents": "Document Checklist",
  "nav.partners": "Where to Apply",
  "nav.start": "Start Assessment",
  "nav.start_short": "Start Check →",

  // Home page
  "home.headline": "Need help finding financial assistance for your business?",
  "home.subtext": "Answer a few simple questions. We will find the right government loan or scheme for you — no complicated paperwork words.",
  "home.cta_primary": "Start Assessment",
  "home.cta_primary_hint": "Takes about 2 minutes · Free · No login needed",
  "home.cta_chatbot": "Talk to Scheme Sahayak",
  "home.cta_chatbot_hint": "Ask questions in plain language",
  "home.how_title": "How Scheme Sahayak works for you",
  "home.how_subtext": "You don't need to know government scheme rules. We do the work for you.",
  "home.step1_title": "Answer simple questions",
  "home.step1_desc": "Tell us your need, community, and location. No technical words.",
  "home.step2_title": "See the best match",
  "home.step2_desc": "We highlight the single best government scheme for you and what your repayment could look like.",
  "home.step3_title": "Know where to go",
  "home.step3_desc": "Get a simple paper checklist and find the official government office or bank in your area.",
  "home.trust_title": "Trustworthy & Safe:",
  "home.trust_text": "Scheme Sahayak does not ask for bank passwords, Aadhaar OTPs, or fees. We help you connect to official Government of India (NSFDC / PM-SURAJ) channels.",

  // Assessment
  "assess.back": "← Back",
  "assess.question_of": "Question {current} of {total}",
  "assess.use_voice": "Use Voice",
  "assess.close_voice": "Close Voice",
  "assess.continue": "Continue →",
  "assess.show_results": "Show My Best Match →",
  "assess.ask_sahayak": "Ask Sahayak",

  // Q1 — Community
  "assess.q1.title": "Which community do you belong to?",
  "assess.q1.hint": "This helps us find the right government schemes for you.",
  "assess.q1.sc": "Scheduled Caste (SC)",
  "assess.q1.st": "Scheduled Tribe (ST)",
  "assess.q1.other": "Other community",
  "assess.q1.prefer_not": "Prefer not to say",
  "assess.q1.non_sc_note": "This prototype currently specializes in SC-focused NSFDC assistance. You can still explore the assessment, but eligibility results will reflect SC-specific criteria.",

  // Q2 — Caste certificate
  "assess.q2.title": "Do you have an SC caste certificate?",
  "assess.q2.hint": "An official paper or digital certificate from your local revenue office is needed for the application.",
  "assess.q2.in_hand": "Yes, I have it in hand",
  "assess.q2.applied": "I have applied for it",
  "assess.q2.not_available": "Not yet / Need help getting one",

  // Q3 — Purpose
  "assess.q3.title": "What do you need the money for?",
  "assess.q3.business": "Start or grow a business",
  "assess.q3.business_hint": "Tailoring, grocery shop, transport, tools, animal husbandry, trade",
  "assess.q3.education": "Higher or technical education",
  "assess.q3.education_hint": "College fees, engineering, medical, professional degrees",

  // Q4 — Amount
  "assess.q4.title": "How much money do you need?",
  "assess.q4.hint": "Government schemes can cover up to 90% of your total requirement.",
  "assess.q4.exact_label": "Or enter an exact amount:",

  // Q5 — Income
  "assess.q5.title": "About how much does your family earn in a year?",
  "assess.q5.hint": "Under official rules, family income must be within ₹5,00,000 per year to qualify for concessional loans.",
  "assess.q5.over_limit": "Note: The government limit is ₹5,00,000. Beneficiaries earning above ₹5 Lakh may not be eligible for these subsidized schemes.",

  // Q6 — State
  "assess.q6.title": "Which state do you live in?",
  "assess.q6.hint": "We use this to find the government loan office and partner banks in your area.",
  "assess.q6.select_state": "Select your State / Union Territory",
  "assess.q6.select_placeholder": "-- Choose your state --",
  "assess.q6.tap_quickly": "Or tap quickly:",
  "assess.q6.district_label": "District / Town (Optional):",

  // Chatbot
  "chatbot.title": "Scheme Sahayak",
  "chatbot.subtitle": "Ask any question about government schemes",
  "chatbot.pending": "AI assistant integration pending — will be connected in the next release.",
  "chatbot.placeholder": "Type your question here...",
  "chatbot.send": "Send",
  "chatbot.fab_label": "Ask Sahayak",

  // Partners
  "partners.title": "Where to apply for your loan",
  "partners.subtitle": "Official Government Offices & Bank Contacts",
  "partners.intro": "NSFDC does not take loan forms directly at its head office. You can apply online through the official PM-SURAJ portal or visit your state government loan agency.",
  "partners.map_pending": "Map View — MapLibre integration pending",
  "partners.map_desc": "Interactive map will show nearby NSFDC channel partners, banks, and offices.",
  "partners.routing_pending": "Routing engine pending integration",
  "partners.scheme_compat": "Compatible with:",
  "partners.search_placeholder": "Search bank or agency name...",
  "partners.digital_option": "Recommended Digital Option",
  "partners.apply_online": "Apply online on the official PM-SURAJ portal",
  "partners.apply_desc": "Central Government portal for Scheduled Caste entrepreneurs. Your digital application is automatically forwarded to your state agency.",
  "partners.open_portal": "Open PM-SURAJ Portal",
  "partners.found_offices": "Found {count} official offices",
  "partners.in_state": "in {state}",
  "partners.demo_mode": "Demo Mode:",
  "partners.no_offices": "No offices found for this search. Try choosing 'All States & UTs'.",
  "partners.area_state": "Area / State:",
  "partners.get_directions": "Get Directions to {city} area",
  "partners.approx_area": "Approximate area — exact branch location is not available in the current official register.",
  "partners.official_register": "Official PDF Register ↗",

  // Map
  "map.interactive": "Interactive Map",
  "map.no_token": "The interactive map is powered by MapLibre.",
  "map.use_location": "Use My Location",
  "map.locating": "Locating...",
  "map.or": "or",
  "map.select_state": "Select a state below to filter",
  "map.notice": "Pins show state capital area, not exact office addresses. Partner names and categories are from the verified NSFDC directory.",
  "map.denied": "Location access denied. Please select your state manually.",
  "map.unavailable": "Location unavailable. Please select your state manually.",
  "map.error": "Could not determine location. Please select your state manually.",

  // Voice
  "voice.title": "Voice Assistant",
  "voice.tap_speak": "Tap to Speak Now",
  "voice.listening": "Listening...",
  "voice.hint": "Tap the button below and speak in Hindi or English about your need.",
};

const hi: TranslationDict = {
  "app.name": "स्कीम सहायक",
  "app.tagline": "सरकारी वित्तीय सहायता",
  "home.headline": "क्या आपको अपने व्यवसाय के लिए आर्थिक सहायता चाहिए?",
  "home.subtext": "कुछ आसान सवालों के जवाब दें। हम आपके लिए सही सरकारी योजना ढूंढेंगे।",
  "home.cta_primary": "शुरू करें",
  "home.cta_chatbot": "स्कीम सहायक से बात करें",
  "assess.q1.title": "आप किस समुदाय से हैं?",
  "assess.q1.sc": "अनुसूचित जाति (SC)",
  "assess.q1.st": "अनुसूचित जनजाति (ST)",
  "assess.q1.other": "अन्य समुदाय",
  "assess.q1.prefer_not": "बताना नहीं चाहते",
  "assess.q2.title": "क्या आपके पास जाति प्रमाण पत्र है?",
  "assess.q3.title": "आपको सहायता किस उद्देश्य के लिए चाहिए?",
  "assess.q4.title": "लगभग कितने रुपयों की आवश्यकता है?",
  "assess.q5.title": "आपके परिवार की कुल सालाना आय लगभग कितनी है?",
  "assess.q6.title": "आप किस राज्य में रहते हैं?",
  "chatbot.fab_label": "सहायक से पूछें",
  "nav.home": "होम",
  "nav.assessment": "योजना खोजें",
  "nav.partners": "कहाँ आवेदन करें",
  "partners.title": "ऋण के लिए कहाँ आवेदन करें",
  "partners.subtitle": "आधिकारिक सरकारी कार्यालय एवं बैंक संपर्क",
  "partners.intro": "NSFDC अपने प्रधान कार्यालय में सीधे ऋण फॉर्म नहीं लेता है। आप आधिकारिक PM-SURAJ पोर्टल के माध्यम से ऑनलाइन आवेदन कर सकते हैं या अपनी राज्य सरकार की ऋण एजेंसी में जा सकते हैं।",
  "partners.search_placeholder": "बैंक या एजेंसी का नाम खोजें...",
  "partners.digital_option": "अनुशंसित डिजिटल विकल्प",
  "partners.apply_online": "आधिकारिक PM-SURAJ पोर्टल पर ऑनलाइन आवेदन करें",
  "partners.apply_desc": "अनुसूचित जाति के उद्यमियों के लिए केंद्र सरकार का पोर्टल। आपका डिजिटल आवेदन स्वचालित रूप से आपकी राज्य एजेंसी को भेज दिया जाता है।",
  "partners.open_portal": "PM-SURAJ पोर्टल खोलें",
  "partners.found_offices": "{count} आधिकारिक कार्यालय मिले",
  "partners.in_state": "{state} में",
  "partners.demo_mode": "डेमो मोड:",
  "partners.no_offices": "इस खोज के लिए कोई कार्यालय नहीं मिला। 'सभी राज्य और केंद्र शासित प्रदेश' चुनने का प्रयास करें।",
  "partners.area_state": "क्षेत्र / राज्य:",
  "partners.get_directions": "{city} क्षेत्र के लिए दिशा-निर्देश प्राप्त करें",
  "partners.approx_area": "अनुमानित क्षेत्र — सटीक शाखा स्थान वर्तमान आधिकारिक रजिस्टर में उपलब्ध नहीं है।",
  "partners.official_register": "आधिकारिक पीडीएफ रजिस्टर ↗",
  "map.interactive": "इंटरैक्टिव मानचित्र",
  "map.use_location": "मेरे स्थान का उपयोग करें",
  "map.locating": "स्थान खोजा जा रहा है...",
  "map.or": "या",
  "map.select_state": "फ़िल्टर करने के लिए नीचे एक राज्य चुनें",
  "map.notice": "पिन राज्य की राजधानी का क्षेत्र दिखाते हैं, सटीक कार्यालय का पता नहीं। भागीदार के नाम और श्रेणियां सत्यापित NSFDC निर्देशिका से हैं।",
};

const te: TranslationDict = {
  "app.name": "స్కీమ్ సహాయక్",
  "app.tagline": "ప్రభుత్వ ఆర్థిక సహాయం",
  "home.headline": "మీ వ్యాపారానికి ఆర్థిక సహాయం కావాలా?",
  "home.cta_primary": "మూల్యాంకనం ప్రారంభించండి",
  "home.cta_chatbot": "స్కీమ్ సహాయక్ తో మాట్లాడండి",
  "assess.q1.title": "మీరు ఏ సమాజానికి చెందినవారు?",
  "assess.q1.sc": "షెడ్యూల్డ్ కాస్ట్ (SC)",
  "assess.q1.st": "షెడ్యూల్డ్ ట్రైబ్ (ST)",
  "chatbot.fab_label": "సహాయక్ ని అడగండి",
  "nav.home": "హోమ్",
  "nav.assessment": "స్కీమ్‌లు కనుగొనండి",
  "nav.partners": "ఎక్కడ దరఖాస్తు చేయాలి",
  "partners.title": "మీ రుణం కోసం ఎక్కడ దరఖాస్తు చేయాలి",
  "partners.subtitle": "అధికారిక ప్రభుత్వ కార్యాలయాలు & బ్యాంకు పరిచయాలు",
  "partners.intro": "NSFDC తన ప్రధాన కార్యాలయంలో నేరుగా రుణ దరఖాస్తులను తీసుకోదు. మీరు అధికారిక PM-SURAJ పోర్టల్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవచ్చు లేదా మీ రాష్ట్ర ప్రభుత్వ రుణ ఏజెన్సీని సందర్శించవచ్చు.",
  "partners.search_placeholder": "బ్యాంక్ లేదా ఏజెన్సీ పేరును శోధించండి...",
  "partners.digital_option": "సిఫార్సు చేయబడిన డిజిటల్ ఎంపిక",
  "partners.apply_online": "అధికారిక PM-SURAJ పోర్టల్‌లో ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి",
  "partners.apply_desc": "షెడ్యూల్డ్ కులాల పారిశ్రామికవేత్తల కోసం కేంద్ర ప్రభుత్వ పోర్టల్. మీ డిజిటల్ అప్లికేషన్ స్వయంచాలకంగా మీ రాష్ట్ర ఏజెన్సీకి ఫార్వార్డ్ చేయబడుతుంది.",
  "partners.open_portal": "PM-SURAJ పోర్టల్ తెరవండి",
  "partners.found_offices": "{count} అధికారిక కార్యాలయాలు కనుగొనబడ్డాయి",
  "partners.in_state": "{state} లో",
  "partners.demo_mode": "డెమో మోడ్:",
  "partners.no_offices": "ఈ శోధన కోసం కార్యాలయాలు కనుగొనబడలేదు.",
  "partners.area_state": "ప్రాంతం / రాష్ట్రం:",
  "partners.get_directions": "{city} ప్రాంతానికి దిశలను పొందండి",
  "partners.approx_area": "సుమారు ప్రాంతం — ఖచ్చితమైన శాఖ స్థానం ప్రస్తుత అధికారిక రిజిస్టర్‌లో అందుబాటులో లేదు.",
  "partners.official_register": "అధికారిక PDF రిజిస్టర్ ↗",
  "map.use_location": "నా స్థానాన్ని ఉపయోగించండి",
  "map.locating": "లొకేట్ చేస్తోంది...",
  "map.or": "లేదా",
  "map.select_state": "ఫిల్టర్ చేయడానికి దిగువ రాష్ట్రాన్ని ఎంచుకోండి",
};

const dictionaries: Record<Locale, TranslationDict> = { en, hi, te };

/**
 * Get a translated string for a given key and locale.
 * Falls back to English if the key is not found in the target locale.
 */
export function t(key: string, locale: Locale = "en", replacements?: Record<string, string | number>): string {
  let value = dictionaries[locale]?.[key] || dictionaries.en[key] || key;

  if (replacements) {
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      value = value.replace(`{${placeholder}}`, String(replacement));
    }
  }

  return value;
}
