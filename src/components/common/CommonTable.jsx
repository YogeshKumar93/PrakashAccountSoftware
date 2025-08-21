import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  Tooltip,
  Button,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@mui/icons-material';
import { apiCall } from '../../api/apiClient';

// Table pagination actions component
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const CommonTable = ({
  columns: initialColumns,
  endpoint,
  filters: availableFilters = [],
  refreshInterval = 0,
  defaultPageSize = 15,
  title = "Data Table"
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // Use refs to track values without causing re-renders
  const appliedFiltersRef = useRef({});
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(defaultPageSize);
  const refreshIntervalRef = useRef(refreshInterval);
  const hasFetchedInitialData = useRef(false);
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize filter values
  useEffect(() => {
    const initialFilterValues = {};
    availableFilters.forEach(filter => {
      initialFilterValues[filter.id] = filter.type === 'dropdown' ? 'All' : '';
    });
    setFilterValues(initialFilterValues);
    setAppliedFilters(initialFilterValues);
    appliedFiltersRef.current = initialFilterValues;
  }, [availableFilters]);

  // Fetch data function - use refs to avoid dependency changes
  const fetchData = useCallback(async (isManualRefresh = false) => {
    setLoading(true);
    setError(null);
    
    // Use ref values instead of state to avoid unnecessary re-renders
    const currentAppliedFilters = appliedFiltersRef.current;
    const currentPage = pageRef.current;
    const currentRowsPerPage = rowsPerPageRef.current;
    
    // Prepare params for API call
    const params = { 
      ...currentAppliedFilters,
      page: currentPage + 1, // API expects page starting from 1
      paginate: currentRowsPerPage
    };
    
    // Clean up params - remove empty values and 'All'
    Object.keys(params).forEach(key => {
      if (params[key] === 'All' || params[key] === '' || params[key] == null) {
        delete params[key];
      }
    });

    try {
      const { error: apiError, response } = await apiCall('GET', endpoint, null, params);
      
      if (apiError) {
        setError(apiError.message || 'Failed to fetch data');
        console.error('API Error:', apiError);
      } else {
        // Handle the API response structure
        if (response && response.status === 'SUCCESS') {
          if (response.data && Array.isArray(response.data.data)) {
            setData(response.data.data);
            setTotalCount(response.data.total || response.data.data.length);
          } else if (Array.isArray(response.data)) {
            setData(response.data);
            setTotalCount(response.data.length);
          } else {
            setData([]);
            setTotalCount(0);
          }
        } else if (Array.isArray(response)) {
          setData(response);
          setTotalCount(response.length);
        } else {
          setData([]);
          setTotalCount(0);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Update refs when state changes
  useEffect(() => {
    appliedFiltersRef.current = appliedFilters;
    pageRef.current = page;
    rowsPerPageRef.current = rowsPerPage;
    refreshIntervalRef.current = refreshInterval;
  }, [appliedFilters, page, rowsPerPage, refreshInterval]);

  // Initial data fetch - only once on mount
  useEffect(() => {
    if (!hasFetchedInitialData.current) {
      fetchData();
      hasFetchedInitialData.current = true;
    }
  }, [fetchData]);

  // Setup refresh interval - uses stable fetchData function
  useEffect(() => {
    let intervalId;
    if (refreshIntervalRef.current > 0) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshIntervalRef.current);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData]);

  // Filter handlers
  const handleFilterChange = (filterId, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filterValues });
    appliedFiltersRef.current = { ...filterValues };
    setPage(0);
    pageRef.current = 0;
    if (isSmallScreen) {
      setFilterModalOpen(false);
    }
    fetchData();
  };

  const resetFilters = () => {
    const resetFilterValues = {};
    availableFilters.forEach(filter => {
      resetFilterValues[filter.id] = filter.type === 'dropdown' ? 'All' : '';
    });
    setFilterValues(resetFilterValues);
    setAppliedFilters(resetFilterValues);
    appliedFiltersRef.current = resetFilterValues;
    setPage(0);
    pageRef.current = 0;
    fetchData();
  };

  const removeFilter = (filterId) => {
    const newFilterValues = { ...filterValues };
    const resetValue = availableFilters.find(f => f.id === filterId)?.type === 'dropdown' ? 'All' : '';
    
    newFilterValues[filterId] = resetValue;
    setFilterValues(newFilterValues);
    
    const newAppliedFilters = { ...appliedFilters };
    newAppliedFilters[filterId] = resetValue;
    setAppliedFilters(newAppliedFilters);
    appliedFiltersRef.current = newAppliedFilters;
    setPage(0);
    pageRef.current = 0;
    fetchData();
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    pageRef.current = newPage;
    fetchData();
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    rowsPerPageRef.current = newRowsPerPage;
    setPage(0);
    pageRef.current = 0;
    fetchData();
  };

  // Manual refresh handler
  const handleManualRefresh = () => {
    fetchData(true);
  };

  // Render filter inputs
  const renderFilterInputs = () => (
    availableFilters.map(filter => (
      <Box key={filter.id} sx={{ minWidth: 120, mb: 2 }}>
        {filter.type === 'dropdown' ? (
          <FormControl size="small" fullWidth>
            <TextField
              select
              label={filter.label}
              value={filterValues[filter.id] || 'All'}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {filter.options && filter.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            value={filterValues[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        )}
      </Box>
    ))
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Filter Section */}
      {availableFilters.length > 0 && (
        <>
          <Paper sx={{ p: 2, mb: 2, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {renderFilterInputs()}
              
              <Button variant="contained" onClick={applyFilters}>
                Apply
              </Button>
              <Button variant="outlined" onClick={resetFilters} startIcon={<ClearIcon />}>
                Reset
              </Button>
            </Box>
            
            {/* Applied filters chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(appliedFilters).map(([key, value]) => {
                if (value && value !== 'All' && value !== '') {
                  const filterConfig = availableFilters.find(f => f.id === key);
                  return (
                    <Chip
                      key={key}
                      label={`${filterConfig?.label}: ${value}`}
                      onDelete={() => removeFilter(key)}
                      size="small"
                    />
                  );
                }
                return null;
              })}
            </Box>
          </Paper>

          {/* Mobile filter button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={() => setFilterModalOpen(true)}
            >
              Filters
            </Button>
          </Box>

          {/* Filter Modal for mobile */}
          <Dialog 
            open={filterModalOpen} 
            onClose={() => setFilterModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon sx={{ mr: 1 }} />
                Filters
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                {renderFilterInputs()}
              </Box>
              
              {/* Applied filters chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Object.entries(appliedFilters).map(([key, value]) => {
                  if (value && value !== 'All' && value !== '') {
                    const filterConfig = availableFilters.find(f => f.id === key);
                    return (
                      <Chip
                        key={key}
                        label={`${filterConfig?.label}: ${value}`}
                        onDelete={() => removeFilter(key)}
                        size="small"
                      />
                    );
                  }
                  return null;
                })}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetFilters} startIcon={<ClearIcon />}>
                Reset
              </Button>
              <Button 
                onClick={() => setFilterModalOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                onClick={applyFilters}
                variant="contained"
              >
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Table Header with Refresh */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleManualRefresh} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">Error: {error}</Typography>
            <Button variant="contained" onClick={handleManualRefresh} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    {initialColumns.map((column, index) => (
                      <th
                        key={index}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 'bold',
                          width: column.width || 'auto',
                          minWidth: column.width || 'auto'
                        }}
                      >
                        {typeof column.name === 'string' ? column.name : column.name?.props?.children || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={initialColumns.length} style={{ textAlign: 'center', padding: '20px' }}>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={initialColumns.length} style={{ textAlign: 'center', padding: '20px' }}>
                        No data found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, rowIndex) => (
                      <tr key={rowIndex} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        {initialColumns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: '12px',
                              verticalAlign: 'top',
                              width: column.width || 'auto'
                            }}
                          >
                            {column.selector ? column.selector(row) : row[column.name] || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Box>
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CommonTable;