"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { ReportRequestStatus } from "@/types/reportRequest";
import formatSql from "@/utils/formatSql";
import { useReportsData } from "@/components/Providers/ReportsDataProvider";

const ViewReportRequestPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { refreshData } = useReportsData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get the specific report request
  const reportRequest = useAppSelector((state: RootState) =>
    state.reportRequest.data.data.find((r) => r.id === Number(id))
  );

  // Get the matching report if it exists
  const associatedReport = useAppSelector((state: RootState) =>
    state.report.data.data.find((r) => r.reportRequest === Number(id))
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!reportRequest) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">
                Report Request Not Found
              </h2>
            </div>
            <p className="mt-4">
              The requested report request could not be found.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-4"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleModify = () => {
    router.push(`/reportRequests/edit/${id}`);
  };

  const handleViewReport = () => {
    if (associatedReport) {
      router.push(`/reports/${associatedReport.id}`);
    }
  };

  // Format the created and updated dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <CardTitle>Report Request #{reportRequest.id}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex justify-between">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {reportRequest.status}
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(reportRequest.created)}
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span>{" "}
                {formatDate(reportRequest.updated)}
              </p>
            </div>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={handleModify}
                disabled={
                  reportRequest.status === ReportRequestStatus.COMPLETED
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Modify Request
              </Button>
              {reportRequest.status === ReportRequestStatus.COMPLETED &&
                associatedReport && (
                  <Button onClick={handleViewReport}>View Report</Button>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Source Parcel</h3>
              <p className="text-xl">{reportRequest.sourceParcelNumber}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Configuration</h3>
              <p>
                <span className="font-medium">Max Number of Peers:</span>{" "}
                {reportRequest.maxNumberOfPeers}
              </p>
              <p>
                <span className="font-medium">Max Distance (km):</span>{" "}
                {reportRequest.maxDistanceKm}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">SQL Query</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {reportRequest.sql && formatSql(reportRequest.sql)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewReportRequestPage;
