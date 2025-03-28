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
import { ColumnDefinition, TableData } from "../types/form";

interface SubmissionListViewProps {
  initialVisibleColumns?: string[];
}

export const SubmissionListView: FC<SubmissionListViewProps> = ({
  initialVisibleColumns,
}) => {
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>([]);
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
    columns,
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

  // Initialize visible columns when API data is loaded
  useEffect(() => {
    if (columns.length > 0 && visibleColumnIds.length === 0) {
      if (initialVisibleColumns) {
        setVisibleColumnIds(initialVisibleColumns);
      } else {
        // By default, show all columns
        setVisibleColumnIds(columns.map((col) => col.id));
      }
    }
  }, [columns, initialVisibleColumns, visibleColumnIds.length]);

  // Apply search filter
  useEffect(() => {
    if (searchText && filterField) {
      handleFilterChange({ [filterField]: searchText });
    } else if (!searchText && Object.keys(filter).length > 0) {
      handleFilterChange({});
    }
  }, [searchText, filterField, handleFilterChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
    setFilterField(null);
  };

  const handleColumnToggle = (columnId: string) => {
    const isVisible = visibleColumnIds.includes(columnId);
    if (isVisible) {
      // Don't remove if it's the last column
      if (visibleColumnIds.length > 1) {
        setVisibleColumnIds(visibleColumnIds.filter((id) => id !== columnId));
      }
    } else {
      setVisibleColumnIds([...visibleColumnIds, columnId]);
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

  const renderCellContent = (
    submission: TableData,
    column: ColumnDefinition
  ): ReactNode => {
    const value = submission[column.accessor];

    // Format specific columns
    if (column.accessor === "Insurance Type" || column.accessor === "Status") {
      return (
        <Chip
          label={value}
          color={
            value === "Health"
              ? "info"
              : value === "Home"
              ? "success"
              : value === "Car"
              ? "warning"
              : value === "Approved"
              ? "success"
              : value === "Rejected"
              ? "error"
              : value === "Pending"
              ? "warning"
              : "default"
          }
          size="small"
        />
      );
    }

    // Format date columns if they look like dates
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return (
          new Date(value).toLocaleDateString() +
          " " +
          new Date(value).toLocaleTimeString()
        );
      } catch {
        return value;
      }
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

  // Get only the visible columns in their original order
  const visibleColumns = columns.filter((col) =>
    visibleColumnIds.includes(col.id)
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
              Submissions
            </Typography>
            <Box>
              <Button
                startIcon={<FilterListIcon />}
                onClick={handleFilterMenuOpen}
                sx={{ ml: 1 }}
              >
                Filter
              </Button>
              <Button
                startIcon={<ViewColumnIcon />}
                onClick={handleColumnMenuOpen}
                sx={{ ml: 1 }}
              >
                Columns
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchText}
              onChange={handleSearchChange}
              disabled={!filterField}
              placeholder={
                filterField
                  ? `Search by ${filterField}...`
                  : "Select a field to search"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={clearSearch}
                      edge="end"
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          {Object.keys(filter).length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography component="span" sx={{ mr: 1 }}>
                Active filters:
              </Typography>
              {Object.entries(filter).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => {
                    const newFilter = { ...filter };
                    delete newFilter[key];
                    handleFilterChange(newFilter);
                    if (key === filterField) {
                      setSearchText("");
                      setFilterField(null);
                    }
                  }}
                  sx={{ mr: 0.5 }}
                />
              ))}
              <Chip
                label="Clear All"
                onDelete={() => {
                  handleFilterChange({});
                  setSearchText("");
                  setFilterField(null);
                }}
                sx={{ mr: 0.5 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={handleColumnMenuClose}
      >
        {columns.map((column) => (
          <MenuItem key={column.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleColumnIds.includes(column.id)}
                  onChange={() => handleColumnToggle(column.id)}
                />
              }
              label={column.label}
            />
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
      >
        {columns
          .filter((column) => column.filterable)
          .map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => handleFilterSelect(column)}
            >
              {column.label}
            </MenuItem>
          ))}
      </Menu>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="submissions table">
              <TableHead>
                <TableRow>
                  {visibleColumns.map((column) => (
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
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} align="center">
                      No submissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow
                      hover
                      key={submission.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell key={`${submission.id}-${column.id}`}>
                          {renderCellContent(submission, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10, 25]}
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
