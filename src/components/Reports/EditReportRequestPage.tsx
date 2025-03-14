"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { modifyReportRequest } from "@/store/reportRequestSlice";
import { useReportsData } from "@/components/Providers/ReportsDataProvider";
import type { RootState } from "@/store/store";
import type { ReportRequest, ReportQueryConfig } from "@/types";
import { propertyClasses } from "@/types/property";

const EditReportRequestPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { refreshData } = useReportsData();
  // Get the specific report request to edit
  const reportRequest = useAppSelector((state: RootState) =>
    state.reportRequest.data.data.find((r) => r.id === Number(id))
  );

  const [parcelNumber, setParcelNumber] = useState<number>(0);
  const [maxPeers, setMaxPeers] = useState("10");
  const [maxDistance, setMaxDistance] = useState("10");
  const [sqftRange, setSqftRange] = useState({ min: "", max: "" });
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<ReportRequest> | null>(null);

  useEffect(() => {
    // Populate form with existing data when available
    if (reportRequest) {
      setParcelNumber(reportRequest.sourceParcelNumber);
      setMaxPeers(reportRequest.maxNumberOfPeers.toString());
      setMaxDistance(reportRequest.maxDistanceKm.toString());

      // If SQL exists, try to parse it to populate advanced filters
      if (reportRequest.sql) {
        try {
          const sqlConfig = JSON.parse(reportRequest.sql) as ReportQueryConfig;

          // Extract and set selectedClasses if present in the SQL
          const classRules = sqlConfig.rules.filter(
            (rule) => rule.field === "propertyClassCode"
          );

          if (classRules.length > 0 && Array.isArray(classRules[0].value)) {
            const classCodes = classRules[0].value as string[];
            setSelectedClasses(classCodes);
          }

          // Extract square footage range if present
          const sqftRule = sqlConfig.rules.find(
            (rule) => rule.field === "totalSqFt" && rule.operator === "between"
          );

          if (sqftRule && Array.isArray(sqftRule.value)) {
            setSqftRange({
              min: sqftRule.value[0].toString(),
              max: sqftRule.value[1].toString(),
            });
          }
        } catch (error) {
          console.error("Error parsing SQL config:", error);
        }
      }
    }
  }, [reportRequest]);

  const handlePropertyClassChange = (code: string) => {
    setSelectedClasses((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSubmit = () => {
    // Create the updated report request data
    const updatedData: Partial<ReportRequest> = {
      id: Number(id),
      sourceParcelNumber: parcelNumber,
      maxNumberOfPeers: parseInt(maxPeers),
      maxDistanceKm: parseInt(maxDistance),
      sql: JSON.stringify({
        condition: "AND",
        rules: [
          // Add rules based on form state
          // Square footage rule
          ...(sqftRange.min || sqftRange.max
            ? [
                {
                  id: "totalSqFt",
                  field: "totalSqFt",
                  type: "number",
                  input: "text",
                  operator: "between",
                  value: [
                    sqftRange.min ? parseInt(sqftRange.min) : 0,
                    sqftRange.max ? parseInt(sqftRange.max) : 999999,
                  ],
                },
              ]
            : []),

          // Property class rule
          ...(selectedClasses.length > 0
            ? [
                {
                  id: "propertyClass",
                  field: "propertyClassCode",
                  type: "string",
                  input: "select",
                  operator: "in",
                  value: selectedClasses,
                },
              ]
            : []),
        ],
        valid: true,
        parcelNumber: parcelNumber.toString(),
        maxNumberOfPeers: maxPeers,
        maxDistanceKm: maxDistance,
      }),
    };

    setFormData(updatedData);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (formData) {
      // Dispatch the update action
      try {
        await dispatch(modifyReportRequest(formData));
        await refreshData();
        router.push(`/reportRequests/${id}`);
      } catch (error) {
        console.error("Error updating report request:", error);
      }
    }
    setShowConfirmDialog(false);
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
              The requested report request could not be found or is not
              editable.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <CardTitle>Edit Report Request #{reportRequest.id}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Parcel Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parcelNumber">Parcel Number</Label>
                <Input
                  id="parcelNumber"
                  value={parcelNumber}
                  onChange={(e) => setParcelNumber(parseInt(e.target.value))}
                  placeholder="Enter parcel number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxPeers">Max Number of Peers</Label>
                  <Input
                    id="maxPeers"
                    type="number"
                    value={maxPeers}
                    onChange={(e) => setMaxPeers(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDistance">Max Distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filter Rules Section */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h3 className="mb-4 text-lg font-medium">Filter Rules</h3>

              {/* Square Footage Rule */}
              <div className="mb-6">
                <Label htmlFor="sqftRange">Total Square Feet Range</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    className="w-[95px]"
                    value={sqftRange.min}
                    onChange={(e) =>
                      setSqftRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                  />
                  <span>to</span>
                  <Input
                    placeholder="Max"
                    className="w-[95px]"
                    value={sqftRange.max}
                    onChange={(e) =>
                      setSqftRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Property Class Rule */}
              <div>
                <Label className="mb-2 block">Property Classes</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(propertyClasses)
                    .slice(0, 12)
                    .map(([k, v], i) => (
                      <div
                        key={`${i}-${k}`}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`class-${k}`}
                          checked={selectedClasses.includes(k)}
                          onCheckedChange={() => handlePropertyClassChange(k)}
                        />
                        <Label htmlFor={`class-${k}`} className="text-sm">
                          {k}-{v}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="mt-6">
            Update Report Request
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this report request? If the report
              has already been generated, this update will not affect the
              existing report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Update Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditReportRequestPage;
