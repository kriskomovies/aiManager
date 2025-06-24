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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  onRowClick,
}: DataTableProps<T>) {
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

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table className="min-w-[1200px] w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map(column => (
                <TableHead
                  key={String(column.accessorKey)}
                  className={cn(
                    'font-medium text-gray-700',
                    column.sortable && 'cursor-pointer select-none'
                  )}
                  onClick={() =>
                    column.sortable && handleSort(column.accessorKey)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
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
          <div className="flex items-center gap-2 rounded-xl bg-white p-4 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
