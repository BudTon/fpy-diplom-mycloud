import { useMemo } from 'react';
import './pagination.css'

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const pagesArray = useMemo(() => Array.from({ length: totalPages }).map((_, i) => i + 1), [totalPages]);

  return (
    <ul className="pagination">
      {pagesArray.map((pageNum) => (
        <li
          key={pageNum}
          className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </li>
      ))}
    </ul>
  );
}
