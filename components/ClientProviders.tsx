"use client";

import React from "react";
import { ProfileProvider } from "../lib/profileContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
