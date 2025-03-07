"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, SlidersHorizontal, Eye } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PropertyRecordCard } from "@/types/property";
import DataTableLoading from "@/components/Loading/DataTableLoading";
import PropertyDetailModal from "@/components/Dashboard/widgets/PropertyDetailModal";
import {
  AdvancedSearch,
  type AdvancedSearchForm,
} from "@/components/Dashboard/widgets/PropertyMap/AdvancedSearch/AdvancedSearch";
import { useAppSelector } from "@/store/hooks";
import { selectAdvancedSearchResults } from "@/store/propertySelectors";
import { selectAllProperties } from "@/store/propertySlice";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";

// Format currency values
const formatCurrency = (value: string | number) => {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Format numbers with commas
const formatNumber = (value: number) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("en-US").format(value);
};

const DataTableWidget = () => {
  const { isLoading } = usePropertyData();
  const { status } = useAppSelector((state) => state.property);
  const [advancedSearchParams, setAdvancedSearchParams] =
    useState<AdvancedSearchForm | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyRecordCard | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const filteredResults = useAppSelector((state) =>
    advancedSearchParams
      ? selectAdvancedSearchResults(state, advancedSearchParams)
      : selectAllProperties(state)
  );

  // Define default column properties
  const defaultColumn = useMemo(
    () => ({
      minSize: 100,
      size: 150,
      maxSize: 500,
    }),
    []
  );

  const columns = useMemo<ColumnDef<PropertyRecordCard>[]>(
    () => [
      {
        id: "parcelNumber",
        accessorKey: "parcelNumber",
        header: "Parcel Number",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("parcelNumber")}</div>
        ),
      },
      {
        id: "propertyClassCode",
        accessorKey: "propertyClassCode",
        header: "Property Class Code",
      },
      {
        id: "address",
        header: "Address",
        accessorFn: (row) =>
          `${row.propertyStreetNumber} ${row.propertyStreetName}`,
        cell: ({ getValue }) => (
          <div
            className="truncate w-full overflow-hidden hover:text-clip hover:overflow-visible"
            title={getValue() as string}
          >
            {getValue() as string}
          </div>
        ),
      },
      {
        id: "propertyCity",
        accessorKey: "propertyCity",
        header: "Property City",
        cell: ({ getValue }) => (
          <div
            className="truncate w-full overflow-hidden hover:text-clip hover:overflow-visible"
            title={getValue() as string}
          >
            {getValue() as string}
          </div>
        ),
      },
      {
        id: "ownerName",
        accessorKey: "ownerName",
        header: "Owner Name",
        cell: ({ getValue }) => (
          <div
            className="truncate w-full overflow-hidden hover:text-clip hover:overflow-visible"
            title={getValue() as string}
          >
            {getValue() as string}
          </div>
        ),
      },
      {
        id: "acreage",
        accessorKey: "acreage",
        header: "Acreage",
        cell: ({ row }) => formatNumber(row.getValue("acreage")),
      },
      {
        id: "totalSf",
        accessorKey: "totalSf",
        header: "Total SF",
        cell: ({ row }) => formatNumber(row.getValue("totalSf")),
      },
      {
        id: "mostRecentValuation",
        accessorKey: "mostRecentValuation",
        header: "Most Recent Valuation",
        cell: ({ row }) => formatCurrency(row.getValue("mostRecentValuation")),
        sortingFn: (rowA, rowB) => {
          // Sort by numeric value, not string representation
          const valueA = parseFloat(rowA.original.mostRecentValuation);
          const valueB = parseFloat(rowB.original.mostRecentValuation);
          return valueA - valueB;
        },
      },
      {
        id: "pricePerSf",
        accessorKey: "pricePerSf",
        header: "Price per SF",
        cell: ({ row }) => formatCurrency(row.getValue("pricePerSf")),
        sortingFn: (rowA, rowB) => {
          // Sort by numeric value, not string representation
          const valueA = parseFloat(rowA.original.pricePerSf);
          const valueB = parseFloat(rowB.original.pricePerSf);
          return valueA - valueB;
        },
      },
      {
        id: "mostRecentPtaboaDate",
        accessorKey: "mostRecentPtaboaDate",
        header: "Most Recent PTOboa Date",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        id: "mostRecentPtaboaAmount",
        accessorKey: "mostRecentPtaboaAmount",
        header: "Most Recent PTOboa Amount",
        cell: ({ row }) => {
          const value: string = row.getValue("mostRecentPtaboaAmount");
          return value ? formatCurrency(value) : "-";
        },
        sortingFn: (rowA, rowB) => {
          // Sort by numeric value, accounting for null/undefined
          const valueA = rowA.original.mostRecentPtaboaAmount
            ? parseFloat(rowA.original.mostRecentPtaboaAmount)
            : 0;
          const valueB = rowB.original.mostRecentPtaboaAmount
            ? parseFloat(rowB.original.mostRecentPtaboaAmount)
            : 0;
          return valueA - valueB;
        },
      },
      {
        id: "analyze",
        header: "Analyze",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Link
              href={`/reportsDashboard/report?parcel=${row.original.parcelNumber}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-8 px-3 py-2"
            >
              <FiBarChart2 className="w-4 h-4 mr-2" />
              Analyze
            </Link>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 py-2"
              onClick={() => setSelectedProperty(row.original)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Set initial column order based on column definitions
  useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnOrder(columns.map((column) => (column.id || "").toString()));
    }
  }, [columns, columnOrder.length]);

  const table = useReactTable({
    data: filteredResults.data,
    columns,
    defaultColumn,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      globalFilter,
    },
    columnResizeMode,
    enableColumnResizing: true,
    // Note: enableColumnReordering isn't built-in, we implement manually with drag and drop
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Reset pagination when filter changes
  useEffect(() => {
    table.resetPagination();
  }, [globalFilter, advancedSearchParams, table]);

  const handleAdvancedSearch = (searchParams: AdvancedSearchForm) => {
    setAdvancedSearchParams(searchParams);
    setGlobalFilter(""); // Clear the simple search when using advanced search
  };

  // Clear advanced search
  const clearAdvancedSearch = () => {
    setAdvancedSearchParams(null);
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setAdvancedSearchParams(null);
    // Reset to first page when clearing filters
    table.resetPagination();
  };

  if (isLoading || status === "loading") {
    return <DataTableLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700px-4 md:px-8 lg:px-12">
      <div className="flex-none border-b px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-wrap flex-1 items-center gap-4 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  if (advancedSearchParams) clearAdvancedSearch();
                }}
                className="pl-8 pr-4 py-2 h-10 w-[250px] lg:w-[300px] border rounded"
              />
            </div>
            <Button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Search
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Rows per page:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-10 border rounded py-2 px-3 text-gray-900 bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Search dialog */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
        initialValues={advancedSearchParams ?? undefined}
        onClear={clearAllFilters}
      />

      {/* Table Section - Container with horizontal scroll */}
      <div className="flex-1 overflow-auto min-h-0 relative bg-slate-700 rounded-xl">
        <div className="w-full" style={{ minWidth: table.getTotalSize() }}>
          <Table className="w-full border-collapse table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="relative h-auto px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-200 text-xs uppercase tracking-wider"
                      style={{
                        width: header.getSize(),
                      }}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", header.id);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromId = e.dataTransfer.getData("text/plain");
                        const toId = header.id;
                        const fromIndex = table
                          .getHeaderGroups()[0]
                          .headers.findIndex((h) => h.id === fromId);
                        const toIndex = table
                          .getHeaderGroups()[0]
                          .headers.findIndex((h) => h.id === toId);

                        if (fromIndex !== -1 && toIndex !== -1) {
                          const newColumnOrder = [...columnOrder];
                          const [draggedColumn] = newColumnOrder.splice(
                            fromIndex,
                            1
                          );
                          newColumnOrder.splice(toIndex, 0, draggedColumn);
                          setColumnOrder(newColumnOrder);
                        }
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between gap-2">
                          <div
                            onClick={header.column.getToggleSortingHandler()}
                            className={`break-words hyphens-auto ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>

                          {/* Resizer handle */}
                          {header.column.getCanResize() && (
                            <div
                              className={`absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none bg-gray-300 dark:bg-gray-600 opacity-0 hover:opacity-100 ${
                                header.column.getIsResizing()
                                  ? "bg-blue-500 opacity-100"
                                  : ""
                              }`}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center px-4"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex-none border-t bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* First page */}
              <Button
                variant={
                  table.getState().pagination.pageIndex === 0
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(0)}
                className="h-8 w-8 p-0"
              >
                1
              </Button>

              {/* Ellipsis for large gaps from start */}
              {table.getState().pagination.pageIndex > 2 && (
                <span className="mx-1">...</span>
              )}

              {/* Pages around current page */}
              {Array.from({ length: table.getPageCount() }, (_, i) => i)
                .filter(
                  (page) =>
                    page !== 0 && // Not first page
                    page !== table.getPageCount() - 1 && // Not last page
                    Math.abs(page - table.getState().pagination.pageIndex) <= 1 // Within 1 page of current
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={
                      table.getState().pagination.pageIndex === page
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page + 1}
                  </Button>
                ))}

              {/* Ellipsis for large gaps from end */}
              {table.getState().pagination.pageIndex <
                table.getPageCount() - 3 && <span className="mx-1">...</span>}

              {/* Last page (if more than one page) */}
              {table.getPageCount() > 1 && (
                <Button
                  variant={
                    table.getState().pagination.pageIndex ===
                    table.getPageCount() - 1
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  className="h-8 w-8 p-0"
                >
                  {table.getPageCount()}
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3"
            >
              Next
            </Button>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-200">
            Showing{" "}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredResults.data.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredResults.data.length}</span>{" "}
            entries
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};

export default DataTableWidget;
