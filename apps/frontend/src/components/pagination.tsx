import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  to: string;
}

export function Pagination({ currentPage, totalPages, to }: PaginationProps) {
  const { t } = useTranslation();

  // Function to generate an array of page numbers to display
  const getPageNumbers = () => {
    const displayedPages = 3;
    const pageNumbers = [];

    if (totalPages <= displayedPages) {
      // If total pages are less than or equal to the number of displayed pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Determine the start and end page numbers to display
      let startPage = currentPage - Math.floor(displayedPages / 2);
      let endPage = currentPage + Math.floor(displayedPages / 2);

      // Adjust start and end pages if they go beyond the boundaries
      if (startPage < 1) {
        startPage = 1;
        endPage = displayedPages;
      }

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - displayedPages + 1;
      }

      // Create the array of page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-8" dir="ltr">
      <nav
        className="inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {/* Previous Page Button */}
        {currentPage > 1 && (
          <Link
            to={to}
            search={(old) => ({ ...old, page: currentPage - 1 })}
            className="inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-surface border border-divider rounded-l-md hover:bg-primary"
          >
            <span className="sr-only">{t("pagination.previous")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"
              ></path>
            </svg>
          </Link>
        )}

        {/* First Page Button */}
        {currentPage > 1 && (
          <Link
            to={to}
            search={(old) => ({ ...old, page: 1 })}
            className="inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-surface border border-divider hover:bg-primary"
          >
            <span className="sr-only">{t("pagination.first")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.41 7.41L17 6l-6 6l6 6l1.41-1.41L13.83 12zm-6 0L11 6l-6 6l6 6l1.41-1.41L7.83 12z"
              ></path>
            </svg>{" "}
          </Link>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <Link
            key={page}
            to={to}
            search={(old) => ({ ...old, page: page })}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
              currentPage === page
                ? "text-text bg-primary"
                : "text-text bg-surface hover:bg-primary"
            } border border-divider`}
            aria-current="page"
          >
            {page}
          </Link>
        ))}

        {/* Next Page Button */}
        {currentPage < totalPages && (
          <Link
            to={to}
            search={(old) => ({ ...old, page: currentPage + 1 })}
            className="inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-surface border border-divider hover:bg-primary"
          >
            <span className="sr-only">{t("pagination.next")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"
              ></path>
            </svg>
          </Link>
        )}

        {/* Last Page Button */}
        {currentPage < totalPages && (
          <Link
            to={to}
            search={(old) => ({ ...old, page: totalPages })}
            className="inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-surface border border-divider rounded-r-md hover:bg-primary"
          >
            <span className="sr-only">{t("pagination.last")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5.59 7.41L7 6l6 6l-6 6l-1.41-1.41L10.17 12zm6 0L13 6l6 6l-6 6l-1.41-1.41L16.17 12z"
              ></path>
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
