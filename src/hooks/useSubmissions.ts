import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getSubmissions } from "../services/api";
import { TableData } from "../types/form";

interface UseSubmissionsProps {
  initialPage?: number;
  initialLimit?: number;
  initialSort?: string;
  initialOrder?: "asc" | "desc";
  initialFilter?: Record<string, string>;
}

export const useSubmissions = ({
  initialPage = 1,
  initialLimit = 10,
  initialSort,
  initialOrder = "asc",
  initialFilter = {},
}: UseSubmissionsProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<string | undefined>(initialSort);
  const [order, setOrder] = useState<"asc" | "desc">(initialOrder);
  const [filter, setFilter] = useState<Record<string, string>>(initialFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submissions"],
    queryFn: () => getSubmissions(),
  });

  // Process data client-side
  const processedData = useMemo(() => {
    if (!data) return { submissions: [], total: 0, columns: [] };

    let filteredData = [...data.data];

    // Apply filters
    if (Object.keys(filter).length > 0) {
      filteredData = filteredData.filter((item) => {
        return Object.entries(filter).every(([key, value]) => {
          if (!value) return true;
          const itemValue = String(item[key] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        const valueA = a[sort];
        const valueB = b[sort];

        // Handle different data types for comparison
        if (typeof valueA === "number" && typeof valueB === "number") {
          return order === "asc" ? valueA - valueB : valueB - valueA;
        }

        const strA = String(valueA || "").toLowerCase();
        const strB = String(valueB || "").toLowerCase();

        return order === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    // Calculate total before pagination
    const total = filteredData.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
      submissions: paginatedData,
      total,
      columns: data.columns,
    };
  }, [data, page, limit, sort, order, filter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleSortChange = (field: string) => {
    if (sort === field) {
      // Toggle order if sorting by the same field
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
    setPage(1); // Reset to first page when changing sort
  };

  const handleFilterChange = (newFilter: Record<string, string>) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filter
  };

  // Map table columns to column definitions
  const columnDefinitions = useMemo(() => {
    if (!data?.columns) return [];

    return data.columns.map((column) => ({
      id: column,
      label: column,
      accessor: column,
      sortable: true,
      filterable: column !== "id",
    }));
  }, [data?.columns]);

  return {
    submissions: processedData.submissions as TableData[],
    total: processedData.total,
    columns: columnDefinitions,
    currentPage: page,
    pageSize: limit,
    sort,
    order,
    filter,
    isLoading,
    error,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleFilterChange,
    refetch,
  };
};
