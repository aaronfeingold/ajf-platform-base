"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { FileText, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PropertyRecordCard } from "@/types/property";
import PropertyMap from "./PropertyMap/PropertyMap";

interface PropertyDetailModalProps {
  property: PropertyRecordCard | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to safely format a number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatNumber = (value: any, decimals = 0) => {
  if (value === undefined || value === null) return "-";

  // Convert to number if it's a string
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(num)) return "-";

  try {
    return decimals > 0 ? num.toFixed(decimals) : num.toLocaleString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "-";
  }
};

// Helper function to format currency
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCurrency = (value: any) => {
  if (value === undefined || value === null || value === "") return "-";

  // Convert to number if it's a string
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(num)) return "-";

  try {
    return `$${num.toLocaleString()}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "-";
  }
};

// Format date
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return dateStr;
  }
};

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerId = `map-${property?.parcelNumber}`;

  // Generate valuation history data from property.valuation array if available
  const valuationHistoryData = React.useMemo(() => {
    if (!property?.valuation?.length) {
      // If no valuation history, create mock data based on mostRecentValuation
      return [
        {
          year: "2022",
          value: parseFloat(property?.mostRecentValuation || "0") * 0.8 || 0,
        },
        {
          year: "2023",
          value: parseFloat(property?.mostRecentValuation || "0") * 0.9 || 0,
        },
        {
          year: "2024",
          value: parseFloat(property?.mostRecentValuation || "0") || 0,
        },
      ];
    }

    // Sort valuations by year
    return [...property.valuation]
      .sort((a, b) => a.year - b.year)
      .map((val) => ({
        year: val.year.toString(),
        landValue: parseFloat(val.landValue) || 0,
        improvementValue: parseFloat(val.improvementValue) || 0,
        totalValue: parseFloat(val.totalValue) || 0,
      }));
  }, [property]);

  // Generate transfer history data
  const transferHistoryData = React.useMemo(() => {
    if (!property?.transfer?.length) return [];

    return [...property.transfer]
      .sort(
        (a, b) =>
          new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
      )
      .map((transfer) => ({
        date: formatDate(transfer.saleDate),
        amount: parseFloat(transfer.saleAmount) || 0,
        grantor: transfer.grantor,
        type: transfer.saleType,
        valid: transfer.valid,
      }));
  }, [property]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!property) return null;
  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Property Details - {property.parcelNumber}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="valuation">Valuation History</TabsTrigger>
            <TabsTrigger value="transfers">Transfers & Uses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold">Parcel Number</dt>
                      <dd>{property.parcelNumber || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Alt Parcel Number</dt>
                      <dd>{property.altParcelNumber || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Address</dt>
                      <dd>
                        {`${property.propertyStreetNumber || ""} ${
                          property.propertyStreetName || ""
                        }`}
                        {property.propertyCity
                          ? `, ${property.propertyCity}`
                          : ""}
                        {property.propertyState
                          ? `, ${property.propertyState}`
                          : ""}
                        {property.propertyZipcode
                          ? ` ${property.propertyZipcode}`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Property Class</dt>
                      <dd>
                        {property.propertyClassCode || "-"}
                        {property.propertyClassDescription
                          ? ` - ${property.propertyClassDescription}`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Size</dt>
                      <dd>
                        {formatNumber(property.totalSf)} sq ft
                        {property.acreage !== undefined
                          ? ` (${formatNumber(property.acreage, 2)} acres)`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">County & Township</dt>
                      <dd>
                        {property.county ? `${property.county}` : "-"}
                        {property.township ? ` / ${property.township}` : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Tax District</dt>
                      <dd>{property.taxDistrict || "-"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Owner Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold">Owner Name</dt>
                      <dd>{property.ownerName || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Owner Address</dt>
                      <dd>{property.ownerAddress || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Owner Zipcode</dt>
                      <dd>{property.ownerZipcode || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Owner Account Number</dt>
                      <dd>{property.ownerAccountNumber || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Latest Valuation</dt>
                      <dd>{formatCurrency(property.mostRecentValuation)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">
                        Land / Improvement Value
                      </dt>
                      <dd>
                        {formatCurrency(property.mostRecentLandValuation)} /{" "}
                        {formatCurrency(
                          property.mostRecentImprovementValuation
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Price per SF</dt>
                      <dd>
                        {property.pricePerSf
                          ? `$${formatNumber(
                              parseFloat(property.pricePerSf),
                              2
                            )}`
                          : "-"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Map Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <React.Suspense
                      fallback={
                        <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
                      }
                    >
                      <PropertyMap
                        property={property}
                        mapContainerId={mapContainerId}
                        isOpen={isOpen}
                      />
                    </React.Suspense>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Valuation History Tab */}
          <TabsContent value="valuation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Valuation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {valuationHistoryData.length > 0 &&
                    property.valuation?.length > 0 ? (
                      <BarChart data={valuationHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            "",
                          ]}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        <Bar
                          name="Land Value"
                          dataKey="landValue"
                          fill="#8884d8"
                          stackId="a"
                        />
                        <Bar
                          name="Improvement Value"
                          dataKey="improvementValue"
                          fill="#82ca9d"
                          stackId="a"
                        />
                      </BarChart>
                    ) : (
                      <LineChart data={valuationHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            "Value",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {property.valuation && property.valuation.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">
                      Valuation Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Land Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Improvement Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Total Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {[...property.valuation]
                            .sort((a, b) => b.year - a.year)
                            .map((val, index) => (
                              <tr
                                key={val.id || index}
                                className={
                                  index % 2 === 0
                                    ? "bg-white dark:bg-gray-900"
                                    : "bg-gray-50 dark:bg-gray-800"
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {val.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {formatCurrency(val.landValue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {formatCurrency(val.improvementValue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {formatCurrency(val.totalValue)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfers Tab */}
          <TabsContent value="transfers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transfers Card */}
              <Card
                className={
                  property.transfer && property.transfer.length > 0
                    ? ""
                    : "md:col-span-2"
                }
              >
                <CardHeader>
                  <CardTitle>Transfer History</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.transfer && property.transfer.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Grantor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {transferHistoryData.map((transfer, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-50 dark:bg-gray-800"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {transfer.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatCurrency(transfer.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {transfer.grantor || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {transfer.type || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No transfer history available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Uses Card */}
              {property.use && property.use.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Property Uses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Use
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Area (SF)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Units
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {property.use.map((use, index) => (
                            <tr
                              key={use.id || index}
                              className={
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-50 dark:bg-gray-800"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {use.use || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatNumber(use.sfArea)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatNumber(use.units)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional property info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="font-semibold">Legal Description</dt>
                      <dd className="break-words">
                        {property.legalDescription || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Assessor District</dt>
                      <dd>{property.assessorDistrict || "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Section/Township/Range</dt>
                      <dd>
                        {property.strSection || "-"} /{" "}
                        {property.strTownship || "-"} /{" "}
                        {property.strRange || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Recent PTOBOA</dt>
                      <dd>
                        {property.mostRecentPtaboaDate
                          ? formatDate(property.mostRecentPtaboaDate)
                          : "-"}
                        {property.mostRecentPtaboaAmount
                          ? ` - ${formatCurrency(
                              property.mostRecentPtaboaAmount
                            )}`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Last Updated</dt>
                      <dd>{formatDate(property.updated)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Created</dt>
                      <dd>{formatDate(property.created)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
