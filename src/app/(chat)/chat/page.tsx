"use client";

import NewChat from "@/components/Chat/NewChat";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientNewChat() {
  return <NewChat />;
}

export default withAuth(ClientNewChat);
