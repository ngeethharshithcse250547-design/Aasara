"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BeneficiaryProfile } from "./matchingEngine";

export interface ProfileContextType {
  profile: BeneficiaryProfile;
  updateProfile: (updates: Partial<BeneficiaryProfile>) => void;
  selectedSchemeId: string;
  setSelectedSchemeId: (id: string) => void;
  documentStatuses: Record<string, "ready" | "in_progress" | "missing">;
  setDocumentStatus: (docId: string, status: "ready" | "in_progress" | "missing") => void;
  resetProfile: () => void;
}

const defaultProfile: BeneficiaryProfile = {
  isScheduledCaste: true,
  casteCertificateStatus: "in_hand",
  annualFamilyIncome: 200000,
  purpose: "business",
  requestedAmount: 100000,
  projectOrCourseCost: 120000,
  state: "Uttar Pradesh",
  district: "Varanasi",
  educationLevel: "graduate",
  educationLocation: "india",
  isFullTimeCourse: true,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = "scheme_sahayak_beneficiary_profile_v1";
const DOCS_KEY = "scheme_sahayak_doc_statuses_v1";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BeneficiaryProfile>(defaultProfile);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("MFS");
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, "ready" | "in_progress" | "missing">>({
    "COMMON-D1": "ready",
    "COMMON-D2": "ready",
    "COMMON-D3": "ready",
    "COMMON-D4": "in_progress",
    "COMMON-D5": "ready",
    "MFS-D1": "in_progress",
  });

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
      }
      const savedDocs = localStorage.getItem(DOCS_KEY);
      if (savedDocs) {
        setDocumentStatuses((prev) => ({ ...prev, ...JSON.parse(savedDocs) }));
      }
    } catch {
      // Ignore localStorage parse errors in SSR or restricted environments
    }
  }, []);

  const updateProfile = (updates: Partial<BeneficiaryProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  const setDocumentStatus = (docId: string, status: "ready" | "in_progress" | "missing") => {
    setDocumentStatuses((prev) => {
      const next = { ...prev, [docId]: status };
      try {
        localStorage.setItem(DOCS_KEY, JSON.stringify(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DOCS_KEY);
    } catch {
      // storage fallback
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        selectedSchemeId,
        setSelectedSchemeId,
        documentStatuses,
        setDocumentStatus,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
