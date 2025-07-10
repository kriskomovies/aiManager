import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExpandableColumn<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  minWidth?: string;
}

export interface ExpandableRowData<T, C = T> {
  id: string | number;
  data: T;
  children?: C[];
  isExpanded?: boolean;
}

interface ExpandableDataTableProps<T, C = T> {
  columns: ExpandableColumn<T>[];
  data?: ExpandableRowData<T, C>[];
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
  onRowExpand?: (rowId: string | number, isExpanded: boolean) => void;
  renderExpandedContent?: (row: T, children: C[]) => React.ReactNode;
  className?: string;
}

export function ExpandableDataTable<T, C = T>({
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
  onRowExpand,
  renderExpandedContent,
  className,
}: ExpandableDataTableProps<T, C>) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

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

  const toggleRowExpansion = (rowId: string | number) => {
    const newExpandedRows = new Set(expandedRows);
    const isCurrentlyExpanded = expandedRows.has(rowId);
    
    if (isCurrentlyExpanded) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    
    setExpandedRows(newExpandedRows);
    onRowExpand?.(rowId, !isCurrentlyExpanded);
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
                  {/* Expand/Collapse column */}
                  <TableHead className="w-12 px-2 py-3">
                    <span className="sr-only">Expand</span>
                  </TableHead>
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
                      colSpan={columns.length + 1}
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
                      colSpan={columns.length + 1}
                      className="h-[400px] text-center"
                    >
                      <div className="text-gray-500">
                        <div className="text-sm sm:text-base">No records found.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((rowData, rowIndex) => {
                    const isExpanded = expandedRows.has(rowData.id);
                    const hasChildren = rowData.children && rowData.children.length > 0;
                    
                    return (
                      <React.Fragment key={`row-${rowIndex}-${rowData.id}`}>
                        {/* Main Row */}
                        <TableRow
                          onClick={() => onRowClick?.(rowData.data)}
                          className={cn(
                            onRowClick && 'cursor-pointer hover:bg-gray-50',
                            'transition-colors duration-150'
                          )}
                        >
                          {/* Expand/Collapse Button */}
                          <TableCell className="px-2 py-3 w-12">
                            {hasChildren && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(rowData.id);
                                }}
                              >
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            )}
                          </TableCell>
                          
                          {/* Data Columns */}
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
                                  ? column.cell(rowData.data)
                                  : (rowData.data[column.accessorKey] as React.ReactNode)}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                        
                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && hasChildren && (
                            <TableRow>
                              <TableCell colSpan={columns.length + 1} className="p-0">
                                <motion.div 
                                  className="bg-gray-50 border-t border-gray-200 overflow-hidden"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ 
                                    duration: 0.3,
                                    ease: "easeInOut"
                                  }}
                                >
                                  {renderExpandedContent 
                                    ? renderExpandedContent(rowData.data, rowData.children!)
                                    : (
                                      <div className="p-4">
                                        <div className="text-sm text-gray-600">
                                          {rowData.children!.length} child records
                                        </div>
                                      </div>
                                    )
                                  }
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
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
