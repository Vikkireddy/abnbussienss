'use client';

import { Box, Button } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import ResultsSkeleton from './components/ResultsSkeleton';
import { useLazyGetBusinessDataQuery } from './store/api/businessApi';
import { SearchParams } from './types/abn.types';

const DEFAULT_SEARCH: SearchParams = { search: '', state: '', status: '' };

const ABNSearchData = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_SEARCH);
  const [page, setPage] = useState(1);
  
  const [getBusinessData, { data, isLoading, error, isFetching }] = 
    useLazyGetBusinessDataQuery();
  useEffect(() => {
    getBusinessData({
      search: searchParams?.search || '',
      state: searchParams?.state || '',
      status: searchParams?.status || '',
      page: page ?? 1,
    });
  }, []); 

  const handleSearch = useCallback(
    (search: string, stateValue: string, status: string) => {
      const newSearchParams = { search, state: stateValue, status };
      setSearchParams(newSearchParams);
      setPage(1);
      
      getBusinessData({
        search,
        state: stateValue,
        status,
        page: 1,
      });
    },
    [getBusinessData]
  );

  const handlePageChange = useCallback(
    (_: unknown, value: number) => {
      setPage(value);
      getBusinessData({
        search: searchParams.search,
        state: searchParams.state,
        status: searchParams.status,
        page: value,
      });
    },
    [searchParams, getBusinessData]
  );

  return (
    <Box className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Box className="sticky top-0 z-1000 bg-gray-100 py-3 px-4">
        <Header />
        <SearchForm onSearch={handleSearch} />
      </Box>

      <Box className="px-4">
        {isLoading || isFetching ? (
          <ResultsSkeleton />
        ) : error ? (
          <Box className="text-center py-4">
            <Box className="text-red-500 mb-2">
              {'status' in error && 'data' in error
                ? (error.data as { message?: string })?.message || 'Failed to load data'
                : 'error' in error }
            </Box>
            <Button
              variant="contained"
              onClick={() =>
                getBusinessData({
                  search: searchParams?.search || '',
                  state: searchParams?.state || '',
                  status: searchParams?.status || '',
                  page: page ?? 1,
                })
              }
            >
              Retry
            </Button>
          </Box>
        ) : (
          <ResultsTable
            results={data?.data || []}
            page={page}
            totalPages={data?.pagination?.totalPages || 1}
            total={data?.pagination?.total || 0}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default ABNSearchData;
