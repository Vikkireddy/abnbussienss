import { FetchBusinessParams, FetchBusinessResponse, BusinessResult } from '../../../types/abn.types';
export function buildBusinessQueryParams(params: FetchBusinessParams): URLSearchParams {
  const DEFAULT_LIMIT = 20;
  const DEFAULT_PAGE = 1;
  const ALL_STATES = 'All States';
  const ALL_STATUS = 'All Status';

    const urlParams = new URLSearchParams({
    page: String(params.page ?? DEFAULT_PAGE),
    limit: String(DEFAULT_LIMIT),
  });

  if (params.search?.trim()) {
    urlParams.append('search', params.search.trim());
  }
  if (params.state && params.state !== ALL_STATES) {
    urlParams.append('state', params.state);
  }

  if (params.status && params.status !== ALL_STATUS) {
    urlParams.append('status', params.status);
  }

  return urlParams;
}

export function mapBusinessResult(item: any): BusinessResult {
  return {
    abn: String(item.abn ?? ''),
    businessName: String(item.business_name ?? item.businessName ?? ''),
    state: String(item.state ?? ''),
    status: String(item.status ?? ''),
    entityType: String(item.entity_type ?? item.entityType ?? ''),
  };
}

export function transformBusinessResponse(response: any): FetchBusinessResponse {
  const mappedData: BusinessResult[] = Array.isArray(response?.data)
    ? response.data.map(mapBusinessResult)
    : [];

  return {
    data: mappedData,
    pagination: {
      page: response?.pagination?.page ?? 1,
      limit: response?.pagination?.limit ?? 20,
      total: response?.pagination?.total ?? 0,
      totalPages: response?.pagination?.totalPages ?? 1,
    },
  };
}

