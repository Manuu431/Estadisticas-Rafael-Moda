import { formatNumber } from '../../utils/format.js';

function ShowMoreButton({ remaining, noun, onClick }) {
    if (remaining <= 0) return null;
    return (
        <button type="button" className="m-btn w-100" onClick={onClick}>
            Ver más {noun} ({formatNumber(remaining)})
        </button>
    );
}

export default ShowMoreButton;