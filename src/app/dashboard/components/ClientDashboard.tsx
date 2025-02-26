"use client";

import Dashboard from "@/app/dashboard/components/Dashboard";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientDashboard() {
  return <Dashboard />;
}

export default withAuth(ClientDashboard);
