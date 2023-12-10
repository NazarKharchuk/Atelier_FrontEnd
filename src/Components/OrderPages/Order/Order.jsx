import React, { useState, useEffect } from "react";
import { orderAPI } from "../../../API/order-api";
import { employeeAPI } from "../../../API/employee-api";
import { worksTypeAPI } from "../../../API/worksType-api";
import s from "./Order.module.css";
import PropTypes from "prop-types";
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert } from "@mui/material";
import { Paper, LinearProgress, TablePagination, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

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
                <TableCell>{row.receivingDate}</TableCell>
                <TableCell>{row.issueDate}</TableCell>
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
                    <IconButton
                        onClick={() => handleEditRow(row.orderId)}
                        color="inherit"
                    >
                        <span className="material-icons md-dark">edit</span>
                    </IconButton>
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

const Order = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(false);
    const [errorMes, setErrorMes] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [worksTypeName, setWorksTypeName] = useState("");
    const [sort, setSort] = useState("");
    const [status, setStatus] = useState("");
    const [listNames, setListNames] = useState([]);
    const [listFirstNames, setListFirstNames] = useState([]);
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setLoaded(false);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        setLoaded(false);
    };

    const fetchOrdersData = async () => {
        setLoaded(false);
        const result = await orderAPI.orders(
            page + 1,
            rowsPerPage,
            sort,
            startDate,
            endDate,
            status,
            employeeName,
            worksTypeName
        );
        if (result.seccessfully === true) {
            setData(result.data.list);
            setCount(result.data.totalCount);
            setLoaded(true);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    const fetchEmployeeFirstNamesData = async () => {
        const result = await employeeAPI.employeeFirstNames();
        if (result.seccessfully === true) {
            setListFirstNames(result.data);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    const fetchWorksTypeNamesData = async () => {
        const result = await worksTypeAPI.worksTypeNames();
        if (result.seccessfully === true) {
            setListNames(result.data);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Список замовлень");
        fetchOrdersData();
        fetchEmployeeFirstNamesData();
        fetchWorksTypeNamesData();
    }, []);

    useEffect(() => {
        fetchOrdersData();
    }, [page, rowsPerPage]);

    const handleCreateButton = () => {
        navigate("/orders/create", { replace: true });
    };

    const handleFilterButton = (event) => {
        setPage(0);
        setLoaded(false);
        fetchOrdersData();
    };

    const handleChangeStartDate = (event) => {
        setStartDate(event.target.value);
    };

    const handleChangeEndDate = (event) => {
        setEndDate(event.target.value);
    };

    const handleChangeEmployeeFirstName = (event) => {
        setEmployeeName(event.target.value);
    };

    const handleChangeWorksTypeName = (event) => {
        setWorksTypeName(event.target.value);
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const handleChangeSort = (event) => {
        setSort(event.target.value);
    };

    const reloadOrdersData = () => {
        fetchOrdersData();
    };

    const ExportFile = async () => {
        var data = await orderAPI.ordersExportData();
        const utf8BOM = '\uFEFF';
        const csvContent = `${utf8BOM}${data}`;
        const downloadUrl = window.URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "Orders.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (error) {
        return (
            <Alert severity="error">{errorMes}</Alert>
        );
    }

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <div className={s.container}>
                <FormControl>
                    <TextField
                        id="start-date"
                        label="Початкова дата"
                        type="date"
                        defaultValue={startDate}
                        onChange={handleChangeStartDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>Шукати за</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        id="end-date"
                        label="Кінцева дата"
                        type="date"
                        defaultValue={endDate}
                        onChange={handleChangeEndDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>Шукати за</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="woks-type-select-helper-label">Послуга</InputLabel>
                    <Select
                        labelId="woks-type-select-helper-label"
                        id="woks-type-select-helper"
                        value={worksTypeName}
                        onChange={handleChangeWorksTypeName}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        {listNames.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Шукати за</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="status-select-helper-label">Статус</InputLabel>
                    <Select
                        labelId="status-select-helper-label"
                        id="status-select-helper"
                        value={status}
                        onChange={handleChangeStatus}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        <MenuItem value="0">Нове</MenuItem>
                        <MenuItem value="1">Виконується</MenuItem>
                        <MenuItem value="2">Завершено</MenuItem>
                    </Select>
                    <FormHelperText>Шукати за</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="employee-select-helper-label">
                        Ім'я працівника
                    </InputLabel>
                    <Select
                        labelId="employee-select-helper-label"
                        id="employee-select-helper"
                        value={employeeName}
                        onChange={handleChangeEmployeeFirstName}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        {listFirstNames.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Шукати за</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="sort-select-helper-label">Порядок</InputLabel>
                    <Select
                        labelId="sort-select-helper-label"
                        id="sort-select-helper"
                        value={sort}
                        onChange={handleChangeSort}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        <MenuItem key={1} value="desc">Спаданням</MenuItem>
                        <MenuItem key={2} value="asc">Зростанням</MenuItem>
                    </Select>
                    <FormHelperText>Сортувати за</FormHelperText>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterButton}
                >
                    Застосувати
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Id замовлення</TableCell>
                            <TableCell>Отримано</TableCell>
                            <TableCell>Видано</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Змінити статус</TableCell>
                            <TableCell>Id послуги</TableCell>
                            <TableCell>Назва послуги</TableCell>
                            <TableCell>Вартість послуги</TableCell>
                            <TableCell>Id працівника</TableCell>
                            <TableCell>Ім'я працівника</TableCell>
                            <TableCell>Прізвище працівника</TableCell>
                            <TableCell>Id клієнта</TableCell>
                            <TableCell>Ім'я клієнта</TableCell>
                            <TableCell>Прізвище клієнта</TableCell>
                            <TableCell>Ціна</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <Row key={row.orderId} row={row} reloadOrdersData={reloadOrdersData} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <div className={s.buttons}>
                <div>
                    <Button variant="contained" color="primary" onClick={ExportFile}>
                        Імпортувати
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate("/orders/statistic");
                        }}
                    >
                        Статистика
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateButton}
                    >
                        Додати
                    </Button>
                </div>
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle })(Order);