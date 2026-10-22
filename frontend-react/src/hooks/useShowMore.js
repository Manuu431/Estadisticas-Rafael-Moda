import { useState } from 'react';
import { remainingCount } from '../utils/salesDays.js';

export const SHOW_MORE_PAGE = 12;

export function useShowMore(rows, page = SHOW_MORE_PAGE) {
    const [shown, setShown] = useState({ rows, count: page });
    const count = shown.rows === rows ? shown.count : page;
    return {
        visible: rows.slice(0, count),
        remaining: remainingCount(rows.length, count),
        showMore: () => setShown({ rows, count: count + page }),
    };
}