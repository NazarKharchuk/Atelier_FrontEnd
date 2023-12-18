import React, { useState } from "react";
import { orderAPI } from "../../../API/order-api";
import PropTypes from "prop-types";
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Row(props) {
    const { row, reloadOrdersData } = props;
    const [open, setOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(row.status);
    const navigate = useNavigate();

    const handleEditRow = (orderId) => {
        navigate("/orders/update/" + orderId, { replace: true });
    };

    const lookup = { 0: "Нове", 1: "Виконується", 2: "Завершено" };

    const availableStatuses = Object.keys(lookup).filter(
        (status) => status >= row.status
    );

    const showSaveButton = row.status !== 2 && (newStatus > row.status);
    const showStatusSelect = row.status !== 2;

    const handleStatusChange = (event) => {
        if (event.target.value >= row.status) {
            setNewStatus(event.target.value);
        }
        else {
            console.log("Неможливо \"зменшити\" статус");
        }
    };

    const fetchOrderUpdateStatus = async () => {
        var result = await orderAPI.updateOrderStatus(row.orderId, parseInt(newStatus));
        return result;
    };

    const handleSaveStatus = async () => {
        const result = await fetchOrderUpdateStatus();
        if (result.seccessfully === true) {
            alert("Статус оновлено успішно!");
            reloadOrdersData();
        } else {
            alert(result.message);
        }
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <span className="material-icons md-dark">keyboard_arrow_up</span>
                            : <span className="material-icons md-dark">keyboard_arrow_down</span>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.orderId}
                </TableCell>
                <TableCell>{new Date(row.receivingDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(row.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{lookup[row.status]}</TableCell>
                <TableCell>
                    {showStatusSelect ? (
                        <Select value={newStatus} onChange={handleStatusChange}>
                            {availableStatuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {lookup[status]}
                                </MenuItem>
                            ))}
                        </Select>
                    ) : (
                        <>-</>
                    )}
                    {showSaveButton && (
                        <IconButton onClick={handleSaveStatus} color="primary">
                            <span className="material-icons md-dark">save</span>
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>{row.workTypeId}</TableCell>
                <TableCell>{row.workTypeName}</TableCell>
                <TableCell>{row.workTypeCost}</TableCell>
                <TableCell>{row.employeeId}</TableCell>
                <TableCell>{row.employeeFirstName}</TableCell>
                <TableCell>{row.employeeLastName}</TableCell>
                <TableCell>{row.clientId}</TableCell>
                <TableCell>{row.clientFirstName}</TableCell>
                <TableCell>{row.clientLastName}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>
                    {showStatusSelect ? (
                        <IconButton
                            onClick={() => handleEditRow(row.orderId)}
                            color="inherit"
                        >
                            <span className="material-icons md-dark">edit</span>
                        </IconButton>
                    ) : (
                        <></>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={3}>
                            <Typography variant="h6" gutterBottom component="div">
                                Матеріали замовлення
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id матеріалу</TableCell>
                                        <TableCell>Назва матеріалу</TableCell>
                                        <TableCell>Кількість</TableCell>
                                        <TableCell>Вартість</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.materials.map((materialRow) => (
                                        <TableRow key={materialRow.materialId}>
                                            <TableCell component="th" scope="row">
                                                {materialRow.materialId}
                                            </TableCell>
                                            <TableCell>{materialRow.name}</TableCell>
                                            <TableCell>{materialRow.count}</TableCell>
                                            <TableCell>{materialRow.cost}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        orderId: PropTypes.number.isRequired,
        receivingDate: PropTypes.string.isRequired,
        issueDate: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        workTypeId: PropTypes.number.isRequired,
        workTypeName: PropTypes.string.isRequired,
        workTypeCost: PropTypes.number.isRequired,
        employeeId: PropTypes.number,
        employeeFirstName: PropTypes.string,
        employeeLastName: PropTypes.string,
        clientId: PropTypes.number.isRequired,
        clientFirstName: PropTypes.string.isRequired,
        clientLastName: PropTypes.string.isRequired,
        materials: PropTypes.arrayOf(
            PropTypes.shape({
                materialId: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                cost: PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
    reloadOrdersData: PropTypes.func.isRequired,
};

export default Row;