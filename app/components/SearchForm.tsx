'use client';

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Paper,
} from '@mui/material';
import { useState, useEffect, useCallback, memo } from 'react';
import { SearchFormProps, StatesResponse } from '../types/abn.types';

const INPUT_SX = {
  borderRadius: 1,
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#227D9B',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#227D9B',
  },
};

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState('All States');
  const [status, setStatus] = useState('All Status');
  const [states, setStates] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        if (!response.ok) return;
        const data: StatesResponse = await response.json();
        setStates(data.states);
      } catch {}
       finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchTerm, state, status);
  }, [onSearch, searchTerm, state, status]);

  return (
    <Paper elevation={0} className="p-3 mb-4 rounded-lg bg-white">
      <Box className="flex gap-2 flex-wrap items-center">
        <TextField
          placeholder="Search by ABN or Business Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: '200px',
            '& .MuiOutlinedInput-root': INPUT_SX,
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#227D9B',
            },
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={state}
            onChange={(e) => setState(e.target.value)}
            disabled={loadingStates}
            displayEmpty
            sx={INPUT_SX}
          >
            <MenuItem value="All States">All States</MenuItem>
            {states.map((stateValue) => (
              <MenuItem key={stateValue} value={stateValue}>
                {stateValue}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            sx={INPUT_SX}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 1,
            backgroundColor: '#227D9B',
            '&:hover': {
              backgroundColor: '#1a6a85',
            },
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default memo(SearchForm);
