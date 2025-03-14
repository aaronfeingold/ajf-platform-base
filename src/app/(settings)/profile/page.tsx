"use client";

import UserProfile from "@/components/Profile/UserProfilePage";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientUserProfile() {
  return <UserProfile />;
}

export default withAuth(ClientUserProfile);
