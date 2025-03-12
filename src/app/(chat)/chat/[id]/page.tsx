"use client";

import ChatPage from "@/components/Chat/ChatSlug";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientChatPage() {
  return <ChatPage />;
}

export default withAuth(ClientChatPage);
