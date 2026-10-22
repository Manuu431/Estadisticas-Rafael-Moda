export function paginate(rows, page, size) {
    const pages = Math.max(1, Math.ceil(rows.length / size));
    const current = Math.min(Math.max(page, 1), pages);
    return { rows: rows.slice((current - 1) * size, current * size), pages, page: current };
}