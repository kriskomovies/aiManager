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
  width?: string; // Add width option for responsive design
  minWidth?: string; // Add minWidth option
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
  className?: string;
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
  className,
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
    <div className={cn("space-y-4 w-full max-w-full", className)}>
      {/* Table Container with Full Width */}
      <div className="relative w-full max-w-full overflow-hidden">
        <div className="rounded-xl border bg-white shadow-sm w-full max-w-full">
          {/* Scroll Container */}
          <div 
            className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <Table 
              className="w-full table-fixed"
              style={{ 
                minWidth: '700px',
                width: '100%'
              }}
            >
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columns.map((column, columnIndex) => (
                    <TableHead
                      key={`header-${columnIndex}-${String(column.accessorKey)}`}
                      className={cn(
                        'font-medium text-gray-700 whitespace-nowrap',
                        column.sortable && 'cursor-pointer select-none hover:bg-gray-100',
                        'px-2 sm:px-4 py-3'
                      )}
                      style={{
                        width: column.width || `${100 / columns.length}%`,
                        minWidth: column.minWidth || '80px',
                      }}
                      onClick={() =>
                        column.sortable && handleSort(column.accessorKey)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm truncate">{column.header}</span>
                        {column.sortable && sorting?.field === column.accessorKey && (
                          <span className="text-xs flex-shrink-0">
                            {sorting.direction === 'asc' ? '↑' : '↓'}
                          </span>
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
                        <span className="text-sm">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[400px] text-center"
                    >
                      <div className="text-gray-500">
                        <div className="text-sm sm:text-base">No records found.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, rowIndex) => (
                    <TableRow
                      key={`row-${rowIndex}`}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        onRowClick && 'cursor-pointer hover:bg-gray-50',
                        'transition-colors duration-150'
                      )}
                    >
                      {columns.map((column, columnIndex) => (
                        <TableCell 
                          key={`cell-${rowIndex}-${columnIndex}-${String(column.accessorKey)}`}
                          className="px-2 sm:px-4 py-3"
                          style={{
                            width: column.width || `${100 / columns.length}%`,
                            minWidth: column.minWidth || '80px',
                          }}
                        >
                          <div className="text-xs sm:text-sm truncate">
                            {column.cell
                              ? column.cell(row)
                              : (row[column.accessorKey] as React.ReactNode)}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Fetching Overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
            <div className="flex items-center gap-2 rounded-xl bg-white p-3 sm:p-4 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Updating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 w-full max-w-full">
          <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            Page {page} of {pageCount}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            {/* First Page Button - Hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(1)}
              disabled={page === 1 || isLoading}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            {/* Previous Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            {/* Page Numbers - Show current page on mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile: Show only current page */}
              <div className="sm:hidden px-2 py-1 text-xs font-medium bg-gray-100 rounded">
                {page}
              </div>
              
              {/* Desktop: Show page range */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                  let pageNum;
                  if (pageCount <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pageCount - 2) {
                    pageNum = pageCount - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(pageNum)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Next Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === pageCount || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            {/* Last Page Button - Hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pageCount)}
              disabled={page === pageCount || isLoading}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
