"use client";

import { Report, PropertyComparison } from "../types/report";
import { camelizeKeys } from "humps";

export interface ParsedReport {
  comparableProperties: PropertyComparison[];
  latestComparable: PropertyComparison;
}

export const parsePropertyComparison = (report: Report): ParsedReport => {
  try {
    // Parse the JSON string from the result
    if (!report.result) {
      throw new Error("Report result is undefined");
    }
    const comparableProperties: PropertyComparison[] = JSON.parse(
      report.result
    );

    // Get the most recent comparable (first in the array based on your data structure)
    let latestComparable = comparableProperties[0];

    // Convert the latest comparable data keys from snake to camel case
    latestComparable = camelizeKeys(latestComparable) as PropertyComparison;

    return {
      comparableProperties,
      latestComparable,
    };
  } catch (error) {
    console.error("Error parsing report result:", error);
    throw new Error("Failed to parse report result");
  }
};
