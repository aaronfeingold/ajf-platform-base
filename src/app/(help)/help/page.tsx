"use client";

import Help from "@/components/Help/HelpPage";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientHelp() {
  return <Help />;
}

export default withAuth(ClientHelp);
