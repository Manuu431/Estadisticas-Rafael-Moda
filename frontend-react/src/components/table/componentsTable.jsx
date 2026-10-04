import { TableIconButton } from '../smallComponents.jsx';
import { formatDate, handleSort, getSortIconClass } from '../../utils/tableUtils.js';
import { getValueLabel } from '../../config/labels.js';
import { formatEuros } from '../../utils/format.js';
import SalesTable from './SalesTable.jsx';

const isNumericKey = (data, key) => {
    if (key === 'id') return false;
    const row = data.find((item) => item[key] !== null && item[key] !== undefined && item[key] !== '');
    return row ? !isNaN(Number(row[key])) : false;
};

const cellClass = (columnKey, isNumeric) =>
    `${isNumeric ? 'data-numeric' : ''}${columnKey === 'profit' || columnKey === 'profits' ? ' data-positive' : ''}`.trim();

const MONEY_KEYS = ['amount', 'cost', 'profit', 'profits', 'expenses', 'balance', 'unit_price', 'unit_cost'];

const isMoney = (columnKey, value) =>
    MONEY_KEYS.includes(columnKey) && value !== null && value !== undefined && value !== '';

const cellText = (item, columnKey, isCreateType) => {
    const value = getValueLabel(columnKey, item[columnKey]);
    if (value === null || value === undefined || value === '') return '';
    if (isMoney(columnKey, value)) return formatEuros(value);
    if (!isCreateType && columnKey.toLowerCase().includes('date')) return formatDate(value);
    return String(value);
};

function CellValue({ item, columnKey, isCreateType }) {
    const value = getValueLabel(columnKey, item[columnKey]);

    if (isMoney(columnKey, value)) {
        return formatEuros(value);
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

function GenericTable({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete, sortConfig, setSortConfig }) {
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

export function DesktopTable(props) {
    return props.type === 'sales' ? <SalesTable data={props.data} /> : <GenericTable {...props} />;
}

function CardList({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete }) {
    const { columns, values } = DATABASE_TABLE.tables;
    const mobile = DATABASE_TABLE.mobile ?? { title: values[1] ?? values[0], meta: values.slice(2, 4), value: null };
    const hasActions = type === 'campaigns' || type === 'seasons' || isCreateType;
    const valueLabel = mobile.value ? columns[values.indexOf(mobile.value)] : null;

    return (
        <ul className="m-list list-unstyled m-0">
            {data.map((item) => (
                <li className="m-item d-flex flex-column gap-1" key={item.id}>
                    <div className="d-flex align-items-baseline gap-3">
                        <span className="m-item-title flex-grow-1 text-truncate">{cellText(item, mobile.title, isCreateType)}</span>
                        {mobile.value ? (
                            <span className="m-item-value flex-shrink-0">
                                <span className="visually-hidden">{valueLabel}: </span>
                                {cellText(item, mobile.value, isCreateType)}
                            </span>
                        ) : null}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="m-item-meta flex-grow-1 text-truncate">
                            {mobile.meta.map((key) => cellText(item, key, isCreateType)).filter(Boolean).join(' · ')}
                        </span>
                        {hasActions && (
                            <span className="d-flex align-items-center gap-3 flex-shrink-0">
                                <RowActions
                                    item={item}
                                    type={type}
                                    handleVisualize={handleVisualize}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            </span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export const MobileTable = CardList;