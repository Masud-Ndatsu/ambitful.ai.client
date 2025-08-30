import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  totalItems,
  itemsPerPage,
  className,
}: DataPaginationProps) {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small enough
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show abbreviated pagination for many pages

      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageClick(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if there's a gap after first page
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        // Don't duplicate page 1 or last page
        if (i === 1 || i === totalPages) continue;

        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if there's a gap before last page
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page (if different from first)
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageClick(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  const getPageInfo = () => {
    if (!showPageInfo || !totalItems || !itemsPerPage) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} results
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showPageInfo && getPageInfo()}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageClick(currentPage - 1)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageClick(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
