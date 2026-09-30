import { TableIconButton } from '../smallComponents.jsx';
import { formatDate, handleSort, getSortIconClass } from '../../utils/tableUtils.js';
import { getValueLabel } from '../../config/labels.js';

const isNumericKey = (data, key) => {
    if (key === 'id') return false;
    const row = data.find((item) => item[key] !== null && item[key] !== undefined && item[key] !== '');
    return row ? !isNaN(Number(row[key])) : false;
};

const cellClass = (columnKey, isNumeric) =>
    `${isNumeric ? 'data-numeric' : ''}${columnKey === 'profit' || columnKey === 'profits' ? ' data-positive' : ''}`.trim();

function CellValue({ item, columnKey, isCreateType }) {
    const value = getValueLabel(columnKey, item[columnKey]);

    if (columnKey === 'section' && item[columnKey]) {
        return <span className={`data-pill${item[columnKey] === 'mujer' ? ' is-mujer' : ''}`}>{value}</span>;
    }

    if (!isCreateType && columnKey.toLowerCase().includes('date') && value) {
        return formatDate(value);
    }

    return value;
}

function RowActions({ item, type, handleVisualize, handleEdit, handleDelete }) {
    const needsFinancials =
        (type === 'campaigns' || type === 'seasons') &&
        (item.expenses == null || item.profits == null || item.expenses == 0 || item.profits == 0);

    return (
        <>
            {needsFinancials ? (
                <TableIconButton
                    onClickFunction={() => handleEdit(item)}
                    title="añadir gastos o beneficios"
                    classIcon="bi bi-plus-circle"
                />
            ) : (
                <>
                    <TableIconButton
                        onClickFunction={() => handleVisualize(item)}
                        title="visualizar"
                        classIcon="bi bi-eye"
                    />
                    <TableIconButton
                        onClickFunction={() => handleEdit(item)}
                        title="editar"
                        classIcon="bi bi-pencil-square"
                    />
                </>
            )}
            <TableIconButton
                onClickFunction={() => handleDelete(item)}
                title="eliminar"
                classIcon="bi bi-trash"
            />
        </>
    );
}

export function DesktopTable({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete, sortConfig, setSortConfig }) {
    const { columns, values } = DATABASE_TABLE.tables;
    const numeric = values.map((key) => isNumericKey(data, key));
    const hasActions = type === 'campaigns' || type === 'seasons' || isCreateType;

    return (
        <div className="table-responsive">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((columnName, index) => (
                            <th scope="col" key={index} className={numeric[index] ? 'data-numeric' : ''}>
                                <button
                                    type="button"
                                    className={`data-sort${sortConfig.key === values[index] ? ' is-sorted' : ''}`}
                                    onClick={() => handleSort(sortConfig, setSortConfig, values[index])}
                                >
                                    {columnName}
                                    <i className={getSortIconClass(values[index], sortConfig)} aria-hidden="true" />
                                </button>
                            </th>
                        ))}
                        {hasActions && <th scope="col" className="text-end">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {values.map((columnKey, colIndex) => (
                                <td className={cellClass(columnKey, numeric[colIndex])} key={colIndex}>
                                    <CellValue item={item} columnKey={columnKey} isCreateType={isCreateType} />
                                </td>
                            ))}
                            {hasActions && (
                                <td>
                                    <div className="d-flex justify-content-end gap-3">
                                        <RowActions
                                            item={item}
                                            type={type}
                                            handleVisualize={handleVisualize}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function MobileTable({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete }) {
    const { columns, values } = DATABASE_TABLE.tables;
    const hasActions = type === 'campaigns' || type === 'seasons' || isCreateType;

    return (
        <div className="d-flex flex-column">
            {data.map((item, index) => (
                <div className="data-row-card d-flex flex-column gap-2" key={index}>
                    {values.map((columnKey, colIndex) => (
                        <div className="d-flex align-items-center justify-content-between gap-3" key={colIndex}>
                            <span className="data-row-label">{columns[colIndex]}</span>
                            <span className="fw-medium text-end">
                                <CellValue item={item} columnKey={columnKey} isCreateType={isCreateType} />
                            </span>
                        </div>
                    ))}
                    {hasActions && (
                        <div className="d-flex justify-content-end gap-3 pt-2">
                            <RowActions
                                item={item}
                                type={type}
                                handleVisualize={handleVisualize}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}