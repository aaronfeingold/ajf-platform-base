"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, BarChart } from "lucide-react";
import { fetchReports } from "@/store/reportSlice";
import { parsePropertyComparison } from "@/utils/parsePropertyComparison";
import { Report } from "@/types";

export default function ReportsListPage() {
  const router = useRouter();
  const ref = useRef(false);
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.report);
  const reportRequests = useAppSelector(
    (state) => state.reportRequest.data.data
  );

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    dispatch(fetchReports());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSourceParcelNumber = (reportRequestId: number) => {
    const reportRequest = reportRequests.find(
      (req) => req.id === reportRequestId
    );
    return reportRequest?.sourceParcelNumber || "Unknown";
  };

  const getReportCardTitle = (report: Report) => {
    try {
      if (report && report.result) {
        const { latestComparable } = parsePropertyComparison(report);
        if (latestComparable?.propertyStreetAddress) {
          return latestComparable.propertyStreetAddress;
        }
      }
    } catch (error) {
      console.error("Error parsing report data:", error);
    }

    return `Report #${report.id}`;
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Completed Reports
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => router.push("/reportRequests/new")}
            >
              <BarChart className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.data.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No reports found
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/reportRequests/new")}
              >
                Request Your First Report
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Source Parcel</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{getReportCardTitle(report)}</TableCell>
                    <TableCell>
                      {getSourceParcelNumber(report.reportRequest)}
                    </TableCell>
                    <TableCell>{formatDate(report.created)}</TableCell>
                    <TableCell>{formatDate(report.updated)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/reports/${report.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
