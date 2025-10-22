import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { paginationConfig } from "../constants/pagination-config";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const getPaginationItems = (): (number | "ellipsis")[] => {
    const items: (number | "ellipsis")[] = [];

    if (totalPages <= paginationConfig.MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {getPaginationItems().map((item, index) => (
            <PaginationItem key={index}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item);
                  }}
                  isActive={item === currentPage}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Keyboard navigation hint */}
      <div className="text-xs text-gray-500 text-center mt-2">
        Use ← → arrow keys, Home/End for navigation
      </div>
    </div>
  );
};

export default PaginationControls;
