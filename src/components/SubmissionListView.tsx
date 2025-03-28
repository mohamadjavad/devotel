import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";
import { useSubmissions } from "../hooks/useSubmissions";
import { ColumnDefinition, FormSubmission } from "../types/form";

interface SubmissionListViewProps {
  initialColumns?: ColumnDefinition[];
}

const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { id: "id", label: "ID", accessor: "id", sortable: true },
  {
    id: "applicantName",
    label: "Applicant Name",
    accessor: "applicantName",
    sortable: true,
    filterable: true,
  },
  {
    id: "type",
    label: "Insurance Type",
    accessor: "type",
    sortable: true,
    filterable: true,
  },
  {
    id: "applicantAge",
    label: "Age",
    accessor: "applicantAge",
    sortable: true,
  },
  {
    id: "city",
    label: "City",
    accessor: "city",
    sortable: true,
    filterable: true,
  },
  {
    id: "status",
    label: "Status",
    accessor: "status",
    sortable: true,
    filterable: true,
  },
  {
    id: "submittedAt",
    label: "Submitted At",
    accessor: "submittedAt",
    sortable: true,
  },
];

export const SubmissionListView: FC<SubmissionListViewProps> = ({
  initialColumns = DEFAULT_COLUMNS,
}) => {
  const [visibleColumns, setVisibleColumns] =
    useState<ColumnDefinition[]>(initialColumns);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [filterField, setFilterField] = useState<string | null>(null);

  const {
    submissions,
    total,
    currentPage,
    pageSize,
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
  } = useSubmissions({
    initialSort: "submittedAt",
    initialOrder: "desc",
  });

  // Apply search filter
  useEffect(() => {
    if (searchText && filterField) {
      handleFilterChange({ [filterField]: searchText });
    } else if (!searchText && Object.keys(filter).length > 0) {
      handleFilterChange({});
    }
  }, [searchText, filterField]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
    setFilterField(null);
  };

  const handleColumnToggle = (column: ColumnDefinition) => {
    const isVisible = visibleColumns.some((col) => col.id === column.id);
    if (isVisible) {
      // Don't remove if it's the last column
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter((col) => col.id !== column.id));
      }
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (column: ColumnDefinition) => {
    setFilterField(column.accessor);
    setFilterMenuAnchor(null);
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
      default:
        return "warning";
    }
  };

  const renderCellContent = (
    submission: FormSubmission,
    column: ColumnDefinition
  ): ReactNode => {
    const value = submission[column.accessor];

    // Format specific columns
    if (column.id === "status" && typeof value === "string") {
      return (
        <Chip label={value} color={getStatusChipColor(value)} size="small" />
      );
    }

    if (column.id === "submittedAt" && typeof value === "string") {
      return (
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString()
      );
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value as ReactNode;
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    handlePageChange(newPage + 1); // API pages are 1-indexed
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleLimitChange(parseInt(event.target.value, 10));
  };

  // Sort columns based on the order they appear in DEFAULT_COLUMNS for consistent display
  const sortedVisibleColumns = visibleColumns.sort(
    (a, b) =>
      DEFAULT_COLUMNS.findIndex((col) => col.id === a.id) -
      DEFAULT_COLUMNS.findIndex((col) => col.id === b.id)
  );

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          Error loading submissions. Please try again later.
        </Typography>
        <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2">
              Insurance Applications
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleFilterMenuOpen}
                aria-label="filter list"
              >
                <FilterListIcon />
              </IconButton>
              <IconButton
                onClick={handleColumnMenuOpen}
                aria-label="select columns"
              >
                <ViewColumnIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
          >
            {DEFAULT_COLUMNS.filter((col) => col.filterable).map((column) => (
              <MenuItem
                key={column.id}
                onClick={() => handleFilterSelect(column)}
              >
                {column.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Column Selection Menu */}
          <Menu
            anchorEl={columnMenuAnchor}
            open={Boolean(columnMenuAnchor)}
            onClose={handleColumnMenuClose}
          >
            {DEFAULT_COLUMNS.map((column) => (
              <MenuItem key={column.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleColumns.some(
                        (col) => col.id === column.id
                      )}
                      onChange={() => handleColumnToggle(column)}
                    />
                  }
                  label={column.label}
                />
              </MenuItem>
            ))}
          </Menu>

          {/* Search Box */}
          {filterField && (
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              <TextField
                value={searchText}
                onChange={handleSearchChange}
                placeholder={`Search by ${
                  DEFAULT_COLUMNS.find((col) => col.accessor === filterField)
                    ?.label || "value"
                }`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={clearSearch} size="small">
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader aria-label="insurance submissions table">
            <TableHead>
              <TableRow>
                {sortedVisibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.sortable ? (
                      <TableSortLabel
                        active={sort === column.accessor}
                        direction={sort === column.accessor ? order : "asc"}
                        onClick={() => handleSortChange(column.accessor)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography>No submissions found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow hover key={submission.id}>
                    {sortedVisibleColumns.map((column) => (
                      <TableCell key={`${submission.id}-${column.id}`}>
                        {renderCellContent(submission, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={currentPage - 1} // API pages are 1-indexed, but MUI is 0-indexed
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
