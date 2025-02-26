// Mock API call data
const mockReportData: Report[] = [
  {
    id: 9,
    source_parcel_number: "1069887",
    sql: JSON.stringify({
      condition: "AND",
      rules: [
        {
          id: "parcel_number",
          field: "parcel_number",
          type: "integer",
          input: "number",
          operator: "not_equal",
          value: "1069887",
        },
        {
          id: "total_sf",
          field: "total_sf",
          type: "integer",
          input: "number",
          operator: "between",
          value: [1, 77176],
        },
        {
          id: "property_class_code",
          field: "property_class_code",
          type: "integer",
          input: "checkbox",
          operator: "in",
          value: 402,
        },
      ],
      valid: true,
      parcel_number: "1069887",
      max_number_of_peers: "10",
      max_distance_km: "10",
    }),
    status: "complete",
    max_number_of_peers: 10,
    max_distance_km: 10,
    created: "02/01/2025 12:39 a.m.",
    updated: "02/01/2025 12:39 a.m.",
    results: {
      sourceProperty: {
        description: {
          parcel: "1069887",
          address: "1101 30TH",
          owner: "CLIFTON SQUARE LP",
        },
        data: {
          assessedValue: 3428700.0,
          totalSF: 27176,
          pricePerSF: 126.17,
        },
        prediction: {
          rent: 21,
          expenseRatio: 0.4,
          capRate: 0.12,
          vacancy: 0.25,
          marketValue: 2140110.0,
          potentialChange: -1288590.0,
          percentChange: -38.0,
        },
      },
      comparables: {
        distribution: {
          totalSF: {
            min: 26368.0,
            max: 66420.0,
            mean: 37944.0,
            median: 35091.0,
            stdDev: 11670.87,
          },
          assessedValue: {
            min: 968100.0,
            max: 7520300.0,
            mean: 2296790.0,
            median: 1549950.0,
            stdDev: 1976760.53,
          },
          pricePerSF: {
            min: 20.65,
            max: 113.22,
            mean: 56.15,
            median: 48.38,
            stdDev: 29.02,
          },
        },
        parcels: [
          {
            parcelNumber: "1081095",
            classCode: "402",
            address: "1100 30TH",
            city: "INDIANAPOLIS",
            ownerName: "CLIFTON SQUARE LP",
            totalSF: 42115,
            saleDate: "2013-06-26T00:00:00Z",
            saleAmount: 30000.0,
            ptaboaDate: "",
            ptaboaAmount: 0,
            distance: 18.34749614446722,
            totalValue: 4354100.0,
            pricePerSF: 103.39,
            yoyChange: 138.0,
            lastPTABOA: "",
          },
          {
            parcelNumber: "9012392",
            classCode: "402",
            address: "2602 MANSION",
            city: "INDIANAPOLIS",
            ownerName:
              "SMF II MANSION TIC I LLC 90% INT & SMF II MANSION TIC II LLC 10% INT",
            totalSF: 66420,
            saleDate: "2022-07-14T00:00:00Z",
            saleAmount: 10425000.0,
            ptaboaDate: "",
            ptaboaAmount: 0,
            distance: 2079.1272382019522,
            totalValue: 7520300.0,
            pricePerSF: 113.22,
            yoyChange: -19.0,
            lastPTABOA: "",
          },
        ],
      },
      queryParameters: JSON.stringify(
        {
          condition: "AND",
          rules: [
            {
              id: "parcel_number",
              field: "parcel_number",
              type: "integer",
              input: "number",
              operator: "not_equal",
              value: "1069887",
            },
            {
              id: "total_sf",
              field: "total_sf",
              type: "integer",
              input: "number",
              operator: "between",
              value: [1, 77176],
            },
            {
              id: "property_class_code",
              field: "property_class_code",
              type: "integer",
              input: "checkbox",
              operator: "in",
              value: 402,
            },
          ],
          valid: true,
          parcel_number: "1069887",
          max_number_of_peers: "10",
          max_distance_km: "10",
        },
        null,
        2
      ),
    },
  },
  {
    id: 8,
    source_parcel_number: "8052054",
    sql: JSON.stringify({
      condition: "AND",
      rules: [
        {
          id: "parcel_number",
          field: "parcel_number",
          type: "integer",
          input: "number",
          operator: "not_equal",
          value: "8052054",
        },
        {
          id: "total_sf",
          field: "total_sf",
          type: "integer",
          input: "number",
          operator: "between",
          value: [1, 765561],
        },
        {
          id: "property_class_code",
          field: "property_class_code",
          type: "integer",
          input: "checkbox",
          operator: "in",
          value: 447,
        },
      ],
      valid: true,
      parcel_number: "8052054",
      max_number_of_peers: "10",
      max_distance_km: "10",
    }),
    status: "complete",
    max_number_of_peers: 10,
    max_distance_km: 10,
    created: "11/04/2024 10:30 p.m.",
    updated: "11/04/2024 10:30 p.m.",
    results: {
      sourceProperty: {
        description: {
          parcel: "8052054",
          address: "3541 MERIDIAN",
          owner: "INDY LLANHURST LP",
        },
        data: {
          assessedValue: 1119300.0,
          totalSF: 41941,
          pricePerSF: 26.56,
        },
        prediction: {
          rent: 18,
          expenseRatio: 0.35,
          capRate: 0.11,
          vacancy: 0.2,
          marketValue: 985000.0,
          potentialChange: -134300.0,
          percentChange: -12.0,
        },
      },
      comparables: {
        distribution: {
          totalSF: {
            min: 27976,
            max: 55892,
            mean: 41934,
            median: 41934,
            stdDev: 9458,
          },
          assessedValue: {
            min: 985000.0,
            max: 2075000.0,
            mean: 1530000.0,
            median: 1530000.0,
            stdDev: 545000.0,
          },
          pricePerSF: {
            min: 26.56,
            max: 47.79,
            mean: 37.18,
            median: 37.18,
            stdDev: 10.62,
          },
        },
        parcels: [
          {
            parcelNumber: "1073617",
            classCode: "402",
            address: "3530 PENNSYLVANIA",
            city: "INDIANAPOLIS",
            ownerName: "MAPLE COURT ASSOCIATES LLC % STALLARD & ASSOC INC",
            totalSF: 30210,
            saleDate: "",
            saleAmount: 0,
            ptaboaDate: "",
            ptaboaAmount: 0,
            distance: 2403.147654063098,
            totalValue: 1196800.0,
            pricePerSF: 39.62,
            yoyChange: 10.0,
            lastPTABOA: "",
          },
        ],
      },
      queryParameters: JSON.stringify(
        {
          condition: "AND",
          rules: [
            {
              id: "parcel_number",
              field: "parcel_number",
              type: "integer",
              input: "number",
              operator: "not_equal",
              value: "8052054",
            },
            {
              id: "total_sf",
              field: "total_sf",
              type: "integer",
              input: "number",
              operator: "between",
              value: [1, 765561],
            },
            {
              id: "property_class_code",
              field: "property_class_code",
              type: "integer",
              input: "checkbox",
              operator: "in",
              value: 447,
            },
          ],
          valid: true,
          parcel_number: "8052054",
          max_number_of_peers: "10",
          max_distance_km: "10",
        },
        null,
        2
      ),
    },
  },
  {
    id: 7,
    source_parcel_number: "8052054",
    sql: JSON.stringify({
      condition: "AND",
      rules: [
        {
          id: "parcel_number",
          field: "parcel_number",
          type: "integer",
          input: "number",
          operator: "not_equal",
          value: "8052054",
        },
        {
          id: "total_sf",
          field: "total_sf",
          type: "integer",
          input: "number",
          operator: "between",
          value: [1, 765561],
        },
        {
          id: "property_class_code",
          field: "property_class_code",
          type: "integer",
          input: "checkbox",
          operator: "in",
          value: 447,
        },
      ],
      valid: true,
      parcel_number: "8052054",
      max_number_of_peers: "10",
      max_distance_km: "10",
    }),
    status: "pending",
    max_number_of_peers: 10,
    max_distance_km: 10,
    created: "11/04/2024 9:55 p.m.",
    updated: "11/04/2024 9:55 p.m.",
  },
];

const DEV_MOCK_COMPLETION_TIME = 15000; // 15 seconds for development mode

// Helper function to simulate API delay
const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Thunk for fetching reports
export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async () => {
    await mockDelay(1000);
    return mockReportData;
  }
);

// DEPRECATE THIS
export const fetchReportById = createAsyncThunk(
  "reports/fetchReportById",
  async (reportId: number) => {
    if (process.env.NODE_ENV === "development") {
      await mockDelay(1000);
      const report = mockReportData.find((r) => r.id === reportId);
      if (!report) throw new Error("Report not found");

      // In dev mode, simulate the report completing after MOCK_COMPLETION_TIME
      const reportStartTime = new Date(report.created).getTime();
      const now = Date.now();
      const timeElapsed = now - reportStartTime;

      if (
        timeElapsed >= DEV_MOCK_COMPLETION_TIME &&
        report.status === "pending"
      ) {
        return {
          ...report,
          status: "complete",
          updated: new Date().toLocaleString(),
          results: {
            sourceProperty: {
              description: {
                parcel: report.source_parcel_number,
                address: "123 Mock St",
                owner: "Mock Owner",
              },
              data: {
                assessedValue: 1000000,
                totalSF: 5000,
                pricePerSF: 200,
              },
              prediction: {
                rent: 15,
                expenseRatio: 0.3,
                capRate: 0.08,
                vacancy: 0.05,
                marketValue: 1200000,
                potentialChange: 200000,
                percentChange: 20,
              },
            },
            comparables: {
              distribution: {
                totalSF: {
                  min: 4000,
                  max: 6000,
                  mean: 5000,
                  median: 5000,
                  stdDev: 500,
                },
                assessedValue: {
                  min: 800000,
                  max: 1200000,
                  mean: 1000000,
                  median: 1000000,
                  stdDev: 100000,
                },
                pricePerSF: {
                  min: 180,
                  max: 220,
                  mean: 200,
                  median: 200,
                  stdDev: 10,
                },
              },
              parcels: [],
            },
            queryParameters: report.sql,
          },
        };
      }

      return report;
    } else {
      // In production, this would be a real API call
      const report = mockReportData.find((r) => r.id === reportId);
      if (!report) throw new Error("Report not found");
      return report;
    }
  }
);
