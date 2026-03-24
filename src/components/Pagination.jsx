export default function Pagination({ total, setPage, currentPage = 1 }) {
  const perPage = 5;
  const pages = Math.ceil(total / perPage);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pages <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      {currentPage > 1 && (
        <button 
          onClick={() => handlePageClick(currentPage - 1)}
          className="btn btn-primary"
        >
          ← Previous
        </button>
      )}

      {/* Page Numbers */}
      {Array.from({ length: pages }, (_, i) => {
        const pageNum = i + 1;
        if (pageNum === 1 || pageNum === pages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
          return (
            <button 
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          );
        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
          return <span key={pageNum} style={{ padding: "8px 4px" }}>...</span>;
        }
        return null;
      })}

      {/* Next Button */}
      {currentPage < pages && (
        <button 
          onClick={() => handlePageClick(currentPage + 1)}
          className="btn btn-primary"
        >
          Next →
        </button>
      )}

      {/* Info */}
      <span className="pagination-info">
        Page {currentPage} / {pages}
      </span>
    </div>
  );
}