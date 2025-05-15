import { Pagination as BootstrapPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="d-flex justify-content-center mt-3">
            <BootstrapPagination>
                <BootstrapPagination.First onClick={() => handleClick(1)} disabled={currentPage === 1} />
                <BootstrapPagination.Prev onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1} />

                {pageNumbers.map((number) => (
                    <BootstrapPagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handleClick(number)}
                    >
                        {number}
                    </BootstrapPagination.Item>
                ))}

                <BootstrapPagination.Next onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages} />
                <BootstrapPagination.Last onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages} />
            </BootstrapPagination>
        </div>
    );
}

export default Pagination;