"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";
import {
  selectAllProperties,
  selectPropertyStatus,
} from "@/store/propertySlice";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
// Define chart colors
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const PropertyClassPieChart = React.memo(function PropertyClassPieChart() {
  // Add state to track active index for hover/interaction
  const [activeIndex, setActiveIndex] = useState(0);
  const propertyData = useSelector(selectAllProperties);
  const status = useSelector(selectPropertyStatus);

  // Calculate top 5 property classes
  const { chartData, chartConfig } = useMemo(() => {
    // Group properties by property class and count them
    const classCount: Record<string, number> = {};

    if (propertyData?.data?.length) {
      propertyData.data.forEach((property) => {
        const propertyClassCode = property.propertyClassCode || "Unknown";
        const propertyClassDescription =
          property.propertyClassDescription || "Unknown";
        const key = `${propertyClassCode}: ${propertyClassDescription}`;
        classCount[key] = (classCount[key] || 0) + 1;
      });
    }

    // Sort classes by count and take top 5
    const topClasses = Object.entries(classCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Generate a config object for shadcn-ui chart component
    const config: ChartConfig = {};

    // Generate chart data array for recharts
    const data = topClasses.map(([className, count], index) => {
      // Create a safe ID from the class name
      const id = className.toLowerCase().replace(/\s+/g, "");

      // Add to config
      config[id] = {
        label: className,
        color: chartColors[index % chartColors.length],
      };

      return {
        propertyClass: className,
        count: count,
        fill: chartColors[index % chartColors.length],
        id: id,
      };
    });

    // If there are fewer than 5 classes, add an "Other" category
    if (topClasses.length < 5 && Object.keys(classCount).length > 5) {
      const otherCount = Object.entries(classCount)
        .sort((a, b) => b[1] - a[1])
        .slice(5)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .reduce((sum, [_, count]) => sum + count, 0);

      if (otherCount > 0) {
        config.other = {
          label: "Other",
          color: chartColors[topClasses.length % chartColors.length],
        };

        data.push({
          propertyClass: "Other",
          count: otherCount,
          fill: chartColors[topClasses.length % chartColors.length],
          id: "other",
        });
      }
    }

    return {
      chartData: data,
      chartConfig: config as ChartConfig,
    };
  }, [propertyData]);

  // Custom active shape renderer for the "popping out" effect
  const renderActiveShape = (props: PieSectorDataItem) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={(outerRadius as number) + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  const totalProperties = useMemo(() => {
    return chartData?.reduce((sum, item) => sum + item.count, 0) || 0;
  }, [chartData]);

  // If there's no data or all counts are 0, show placeholder
  if (
    !chartData ||
    chartData.length === 0 ||
    totalProperties === 0 ||
    status === "loading"
  ) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          {status === "loading" && (
            <CitySkylineLoading animated={true} infinite={true} />
          )}
          <p className="text-muted-foreground">
            {status === "loading"
              ? "Property Data Loading..."
              : "No property data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full w-full overflow-hidden">
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Property Class Breakdown</h2>
        <div className="h-[calc(100%-2rem)]">
          <ResponsiveContainer>
            <Card className="flex flex-col bg-slate-700 border-slate-600">
              <CardHeader className="items-center pb-0">
                <CardTitle>Top Property Classes</CardTitle>
                <CardDescription>
                  Total: {totalProperties.toLocaleString()} Properties
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="propertyClass"
                      innerRadius={60}
                      strokeWidth={5}
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      cx="50%"
                      cy="50%"
                      paddingAngle={2}
                      isAnimationActive={true}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm pt-6">
                <div className="leading-none text-muted-foreground">
                  Showing top {chartData.length} property classes
                </div>
              </CardFooter>
            </Card>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

export default PropertyClassPieChart;
