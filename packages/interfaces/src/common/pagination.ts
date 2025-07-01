// Generic pagination response
export interface IPaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Query parameters for pagination
export interface IPaginationQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
} 