import { Pagination as BootstrapPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    let startPage, endPage;

    if (totalPages <= 3) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage === 1) {
            startPage = 1;
            endPage = 3;
        } else if (currentPage === totalPages) {
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <BootstrapPagination>
                <BootstrapPagination.First
                    onClick={() => handleClick(1)}
                    disabled={currentPage === 1}
                />
                <BootstrapPagination.Prev
                    onClick={() => handleClick(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {pageNumbers.map((number) => (
                    <BootstrapPagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handleClick(number)}
                    >
                        {number}
                    </BootstrapPagination.Item>
                ))}

                <BootstrapPagination.Next
                    onClick={() => handleClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <BootstrapPagination.Last
                    onClick={() => handleClick(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </BootstrapPagination>
        </div>
    );
}

export default Pagination;
