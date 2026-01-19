export type BusinessResult = {
  abn: string;
  businessName: string;
  state: string;
  status: string;
  entityType: string;
}

export type SearchFormProps = {
  onSearch: (searchTerm: string, 
    state: string,
     status: string) => void;
}

export type ResultsTableProps = {
  results: BusinessResult[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export type StateRow = {
  state: string;
}

export type StatesResponse = {
  states: string[];
}

export type StatesApiResponse = {
  states: string[];
} | {
  message?: string;
}


export type AbChipProps = {
  label: string;
  size?: 'small' | 'medium';
};

export type SearchParams = {
  search: string;
  state: string;
  status: string;
};

export type FetchBusinessParams = {
  search?: string;
  state?: string;
  status?: string;
  page?: number;
};

export type BusinessPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FetchBusinessResponse = {
  data: BusinessResult[];
  pagination: BusinessPagination;
};

export type State = {
  results: BusinessResult[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  search: SearchParams;
};

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SEARCH'; payload: SearchParams };
