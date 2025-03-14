"use client";

import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Edit, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportRequestStatus } from "@/types/reportRequest";
import { selectAllReportRequests } from "@/store/reportRequestSlice";
import { selectAllReports } from "@/store/reportSlice";

export default function ReportRequestListPage() {
  const { data: reportRequests } = useAppSelector(selectAllReportRequests);

  const { data: reports } = useAppSelector(selectAllReports);

  // Function to format dates in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Check if a report exists for a report request
  const hasReport = (reportRequestId: number) => {
    return reports.some((report) => report.reportRequest === reportRequestId);
  };

  // Find the report ID for a report request
  const getReportId = (reportRequestId: number) => {
    const report = reports.find(
      (report) => report.reportRequest === reportRequestId
    );
    return report?.id;
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Reports Dashboard</CardTitle>
              <Button asChild>
                <Link href="/reportRequests/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Report Request
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source Parcel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Max Peers</TableHead>
                  <TableHead>Max Distance</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Report Request Actions</TableHead>
                  <TableHead>View Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRequests.map((reportRequest) => (
                  <TableRow key={reportRequest.id}>
                    <TableCell>{reportRequest.id}</TableCell>
                    <TableCell>{reportRequest.sourceParcelNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reportRequest.status === ReportRequestStatus.COMPLETED
                            ? "default"
                            : "secondary"
                        }
                      >
                        {reportRequest.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{reportRequest.maxNumberOfPeers}</TableCell>
                    <TableCell>{reportRequest.maxDistanceKm}</TableCell>
                    <TableCell>{formatDate(reportRequest.created)}</TableCell>
                    <TableCell>{formatDate(reportRequest.updated)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/reportRequests/${reportRequest.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {reportRequest.status !==
                            ReportRequestStatus.COMPLETED && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/reportRequests/edit/${reportRequest.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modify Request
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {reportRequest.status === ReportRequestStatus.COMPLETED &&
                        hasReport(reportRequest.id) && (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/reports/${getReportId(reportRequest.id)}`}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Report
                            </Link>
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
