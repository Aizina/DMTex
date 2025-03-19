import React from 'react';
import style from '../styles/Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={style.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1} className={style.pageButton}>
        <img src="/img/ArrowLeft.png" alt="Left Arrow" />
      </button>

      {currentPage < 8 && (
        <button
        onClick={() => onPageChange(currentPage)}
        className={`${style.pageButton} ${currentPage ? style.activePage : ''}`}
      >
        {currentPage}
      </button>
      )}


      {currentPage < 8  && (
        <button
          onClick={() => onPageChange(currentPage+1)}
          className={`${style.pageButton} ${currentPage === currentPage+1 ? style.activePage : ''}`}
        >
           {currentPage+1}
        </button>
      )}

      {currentPage < totalPages - 3 && <span className={style.dots}>...</span>}

      {currentPage === 8  && (
        <button
          onClick={() => onPageChange(currentPage+1)}
          className={`${style.pageButton} ${currentPage ? style.activePage : ''}`}
        >
           {currentPage}
        </button>
      )}

      {totalPages > 2 && (
        <button
          onClick={() => onPageChange(totalPages - 1)}
          className={`${style.pageButton} ${currentPage === totalPages - 1 ? style.activePage : ''}`}
        >
          {totalPages - 1}
        </button>
      )}

      <button 
        onClick={() => onPageChange(totalPages)}
        className={`${style.pageButton} ${currentPage === totalPages ? style.activePage : ''}`}
      >
        {totalPages}
      </button>

      <button onClick={handleNext} disabled={currentPage === totalPages} className={style.pageButton}>
        <img src="/img/ArrowRight.png" alt="Right Arrow" />
      </button>
    </div>
  );
};

export default Pagination;
