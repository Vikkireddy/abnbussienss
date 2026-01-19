import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FetchBusinessParams, FetchBusinessResponse } from '../../types/abn.types';
import { buildBusinessQueryParams, transformBusinessResponse } from './utils/businessApi.utils';


export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Business'],
  endpoints: (builder) => ({
    getBusinessData: builder.query<FetchBusinessResponse, FetchBusinessParams>({
      query: (params) => {
        const urlParams = buildBusinessQueryParams(params);
        return {
          url: `business?${urlParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: transformBusinessResponse,
    }),
  }),
});

export const { 
    useGetBusinessDataQuery,
    useLazyGetBusinessDataQuery 
    } = businessApi;

