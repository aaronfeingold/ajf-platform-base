"use client";

import Settings from "@/components/Settings/SettingsPage";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientSettings() {
  return <Settings />;
}

export default withAuth(ClientSettings);
