export interface PaginationParams {
  page: number; // Current page number
  limit: number; // Number of items per page
}

export function getPagination(params: PaginationParams) {
  const limit = params.limit > 100 ? 100 : params.limit; // Set a max limit to prevent fetching too much data
  const page = params.page > 0 ? params.page : 1; // Ensure the page is at least 1
  const offset = (page - 1) * limit;

  return { limit, offset };
}
