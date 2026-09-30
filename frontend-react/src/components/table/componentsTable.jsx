import { TableIconButton } from '../smallComponents.jsx';
import { formatDate, handleSort, getSortIconClass } from '../../utils/tableUtils.js';

export function DesktopTable({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete, sortConfig, setSortConfig }) {
    return (
        <table className="table responsive-mode table-bordered border-dark table-striped table-hover w-100 text-center">
            <thead>
                <tr>
                    {DATABASE_TABLE.tables.columns.map((columnName, index) => (
                        <th scope='col' className="text-white align-middle" key={index}>
                            <div className="d-flex justify-content-center align-items-center gap-2 cursor-pointer">
                                <span className="fs-5">{columnName}</span>
                                <i
                                    className={`${getSortIconClass(DATABASE_TABLE.tables.values[index], sortConfig)} icon`}
                                    onClick={() => handleSort(sortConfig, setSortConfig, DATABASE_TABLE.tables.values[index])}
                                >
                                </i>
                            </div>
                        </th>
                    ))}
                    {(type === "campaigns" || type === "seasons" || isCreateType) && (
                        <th scope='col' className="text-white align-middle">
                            <div className="d-flex justify-content-center">
                                <span className="fs-5">Acciones</span>
                            </div>
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr className="text-center" key={index}>
                        {DATABASE_TABLE.tables.values.map((columnKey, colIndex) => {
                            let value = item[columnKey];
                            if (!isCreateType && columnKey.toLowerCase().includes("date") && value) {
                                value = formatDate(value);
                            }
                            return (
                                <td className="py-1 align-middle text-center" key={colIndex}>
                                    {value}
                                </td>
                            );
                        })}
                        {(type === "campaigns" || type === "seasons") && (
                            <td className="py-1 align-middle tdIcons">
                                <div className="d-flex justify-content-center gap-4">
                                    {(item.expenses == null || item.profits == null || item.expenses == 0 || item.profits == 0) ? (
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
                                </div>
                            </td>
                        )}
                        {isCreateType && (
                            <td className="py-1 align-middle tdIcons">
                                <div className="d-flex justify-content-center gap-4">
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
                                    <TableIconButton
                                        onClickFunction={() => handleDelete(item)}
                                        title="eliminar"
                                        classIcon="bi bi-trash"
                                    />
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function MobileTable({ data, DATABASE_TABLE, type, isCreateType, handleVisualize, handleEdit, handleDelete }) {
    return (
        <div className="d-flex flex-column gap-3">
            {data.map((item, index) => (
                <div key={index} className="border p-3 rounded shadow-sm bg-light">
                    {DATABASE_TABLE.tables.values.map((key, i) => (
                        <div key={i} className="mb-1">
                            <span className='ms-3 fw-bold'>{DATABASE_TABLE.tables.columns[i]}: </span>{item[key]}
                        </div>
                    ))}
                    {(type === "campaigns" || type === "seasons") && (
                        <div className="mt-3 d-flex justify-content-around">
                            {(item.expenses == null || item.profits == null || item.expenses == 0 || item.profits == 0) ? (
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
                        </div>
                    )}
                    {isCreateType && (
                        <div className="mt-3 d-flex justify-content-around">
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
                            <TableIconButton
                                onClickFunction={() => handleDelete(item)}
                                title="eliminar"
                                classIcon="bi bi-trash"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}