import React, { useState, useEffect } from "react";
import { employeeAPI } from "../../../API/employee-api";
import s from "./Employee.module.css";
import { Button, Table, Paper, TableBody, TableCell, TableContainer, TableHead } from "@mui/material";
import { TablePagination, TableRow, LinearProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const columns = [
    {
        id: "employeeId",
        label: "EmployeeId",
        minWidth: 50,
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "firstName",
        label: "FirstName",
        minWidth: 100,
    },
    {
        id: "lastName",
        label: "LastName",
        minWidth: 100,
    },
    {
        id: "middleName",
        label: "MiddleName",
        minWidth: 100,
    },
    {
        id: "phoneNumber",
        label: "PhoneNumber",
        minWidth: 100,
    },
    {
        id: "address",
        label: "Address",
        minWidth: 150,
    },
];

const Employee = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(false);
    const [errorMes, setErrorMes] = useState("");
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

    const fetchEmployeesData = async () => {
        setLoaded(false);
        const result = await employeeAPI.employees(page + 1, rowsPerPage);
        if (result.seccessfully === true) {
            setData(result.data.list);
            setCount(result.data.totalCount);
            setLoaded(true);
        } else {
            setError(true);
            setErrorMes(result.data.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Список працівників");
        props.changeBackLink("/menu");
        fetchEmployeesData();
    }, []);

    useEffect(() => {
        fetchEmployeesData();
    }, [page, rowsPerPage]);

    const handleCreateButton = () => {
        navigate("/employees/create", { replace: true });
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
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.employeeId}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === "number"
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
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
            </Paper>
            <div className={s.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateButton}
                >
                    Додати
                </Button>
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(Employee);