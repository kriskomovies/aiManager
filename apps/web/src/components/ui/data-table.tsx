import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  isFetching?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  pageCount?: number;
  page?: number;
  sorting?: { field: keyof T; direction: 'asc' | 'desc' } | null;
  onPageChange?: (page: number) => void;
  onSortingChange?: (
    sorting: { field: keyof T; direction: 'asc' | 'desc' } | null
  ) => void;
  onSearch?: (searchTerm: string) => void;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data = [],
  isLoading,
  isFetching,
  error,
  pageCount = 1,
  page = 1,
  sorting,
  onPageChange,
  onSortingChange,
  onSearch,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSort = (field: keyof T) => {
    if (!onSortingChange) return;

    if (!sorting || sorting.field !== field) {
      onSortingChange({ field, direction: 'asc' });
    } else if (sorting.direction === 'asc') {
      onSortingChange({ field, direction: 'desc' });
    } else {
      onSortingChange(null);
    }
  };

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch]
  );

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={String(column.accessorKey)}
                  className={cn(
                    column.sortable && 'cursor-pointer select-none'
                  )}
                  onClick={() =>
                    column.sortable && handleSort(column.accessorKey)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <ArrowUpDown
                        className={cn(
                          'h-4 w-4',
                          sorting?.field === column.accessorKey &&
                            sorting.direction === 'asc' &&
                            'text-red-500 rotate-180',
                          sorting?.field === column.accessorKey &&
                            sorting.direction === 'desc' &&
                            'text-red-500'
                        )}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {columns.map(column => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell(row)
                        : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === pageCount || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pageCount)}
              disabled={page === pageCount || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="flex items-center gap-2 rounded-md bg-white p-4 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
