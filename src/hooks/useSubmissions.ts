import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSubmissions } from "../services/api";

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
    queryKey: ["submissions", page, limit, sort, order, filter],
    queryFn: () => getSubmissions(page, limit, sort, order, filter),
  });

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

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
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
