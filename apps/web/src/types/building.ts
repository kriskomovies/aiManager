export interface Building {
  id: string;
  name: string;
  address: string;
  description?: string;
  apartmentCount: number;
  balance: number;
  debt: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingResponse {
  items: Building[];
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface BuildingQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
} 