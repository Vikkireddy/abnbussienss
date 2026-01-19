'use client';

import { memo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import { ResultsTableProps } from '../types/abn.types';
import AbChip from './AbChip';
import { BusinessResult } from '../types/abn.types';

const HEADER_CELL_SX = {
  fontWeight: 'bold',
  color: 'var(--secondary-800)',
};

const ResultsTable = memo(
  ({ results, page, totalPages, total, onPageChange }: ResultsTableProps) => {
    const hasResults = results.length > 0;

    return (
      <Box className="flex flex-col">
        <Typography
          variant="h5"
          component="h2"
          className='font-bold! mb-2! text-secondary-800'
        >
          Search Insights
        </Typography>

        <TableContainer
          className="border-radius-2 bg-white overflow-auto"
          sx={{ maxHeight: 'calc(100vh - 400px)' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow className="bg-blue-100! sticky top-0 z-10">
                <TableCell sx={HEADER_CELL_SX}>ABN</TableCell>
                <TableCell sx={HEADER_CELL_SX}>Business Name</TableCell>
                <TableCell sx={HEADER_CELL_SX}>State</TableCell>
                <TableCell sx={HEADER_CELL_SX}>Status</TableCell>
                <TableCell sx={HEADER_CELL_SX}>Entity Type</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!hasResults ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className='py-4'>
                    <Typography variant="body1" className="text-gray-500">
                      No Data Available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((row: BusinessResult) => (
                  <TableRow
                    key={row?.abn}
                    hover
                    className="hover:bg-blue-50! even:bg-gray-50!"
                  >
                    <TableCell>{row?.abn}</TableCell>
                    <TableCell>{row?.businessName}</TableCell>
                    <TableCell>{row?.state}</TableCell>
                    <TableCell>
                      <AbChip label={row?.status} />
                    </TableCell>
                    <TableCell>{row?.entityType}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box className="flex justify-center items-center mt-3 gap-2 flex-shrink-0">
            <Pagination
              count={totalPages}
              page={page}
              onChange={onPageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    );
  }
);

export default ResultsTable;
