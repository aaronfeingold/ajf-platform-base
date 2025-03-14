"use client";

import React from "react";
import { ReportsDataProvider } from "@/components/Providers/ReportsDataProvider";
import LoadingTimeoutFallback from "@/components/Loading/LoadingTimeoutFallback";
import { useReportsData } from "@/components/Providers/ReportsDataProvider";
import PageLoading from "@/components/Loading/PageLoading";

function ReportsDataLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, error, refreshData } = useReportsData();

  if (error) {
    return (
      <LoadingTimeoutFallback
        message="There was a problem loading reports data"
        onRetry={refreshData}
      />
    );
  }

  if (isLoading) {
    return <PageLoading message="Loading reports data..." />;
  }

  return <>{children}</>;
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportsDataProvider>
      <ReportsDataLoadingWrapper>{children}</ReportsDataLoadingWrapper>
    </ReportsDataProvider>
  );
}
