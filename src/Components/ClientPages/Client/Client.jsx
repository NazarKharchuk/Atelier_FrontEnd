import React, { useState, useEffect } from "react";
import { clientAPI } from "../../../API/client-api";
import s from "./Client.module.css";
import { Button, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { LinearProgress, IconButton, Alert, InputLabel, MenuItem, FormHelperText, FormControl, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const columns = [
    {
        id: "clientId",
        label: "ClientId",
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

const Client = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(false);
    const [errorMes, setErrorMes] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sort, setSort] = useState("");
    const [listFirstNames, setListFirstNames] = useState([]);
    const [listLastNames, setListLastNames] = useState([]);
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

    const fetchClientsData = async () => {
        setLoaded(false);
        const result = await clientAPI.clients(
            page + 1,
            rowsPerPage,
            firstName,
            lastName,
            sort
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

    const fetchFirstNamesData = async () => {
        const result = await clientAPI.clientsFirstNames();
        if (result.seccessfully === true) {
            setListFirstNames(result.data);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    const fetchLastNamesData = async () => {
        const result = await clientAPI.clientsLastNames();
        if (result.seccessfully === true) {
            setListLastNames(result.data);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Список клієнтів");
        props.changeBackLink("/menu");
        fetchClientsData();
        fetchFirstNamesData();
        fetchLastNamesData();
    }, []);

    useEffect(() => {
        setLoaded(false);
        fetchClientsData();
    }, [page, rowsPerPage]);

    const handleEditRow = (clientId) => {
        console.log(clientId);
        navigate("/clients/update/" + clientId, { replace: true });
    };

    const handleCreateButton = () => {
        navigate("/clients/create", { replace: true });
    };

    const handleFilterButton = (event) => {
        setPage(0);
        setLoaded(false);
        fetchClientsData();
    };

    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    };

    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    };

    const handleChangeSort = (event) => {
        setSort(event.target.value);
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
                    <InputLabel id="first-name-select-helper-label">Ім'я</InputLabel>
                    <Select
                        labelId="first-name-select-helper-label"
                        id="first-name-select-helper"
                        value={firstName}
                        onChange={handleChangeFirstName}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        {listFirstNames.map((item) => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Пошук за ім'ям</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="last-name-select-helper-label">Прізвище</InputLabel>
                    <Select
                        labelId="last-name-select-helper-label"
                        id="last-name-select-helper"
                        value={lastName}
                        onChange={handleChangeLastName}
                    >
                        <MenuItem key={""} value="">
                            <em>-</em>
                        </MenuItem>
                        {listLastNames.map((item) => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Пошук за прізвищем</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="sort-select-helper-label">Сортувати за</InputLabel>
                    <Select
                        labelId="sort-select-helper-label"
                        id="sort-select-helper"
                        value={sort}
                        onChange={handleChangeSort}
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>
                        <MenuItem key={1} value="desc">Спаданням</MenuItem>
                        <MenuItem key={2} value="asc">Зростанням</MenuItem>
                    </Select>
                    <FormHelperText>Порядок сортування</FormHelperText>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterButton}
                >
                    Застосувати
                </Button>
            </div>
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.clientId}>
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
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleEditRow(row.clientId)}
                                                color="inherit"
                                            >
                                                <span className="material-icons md-dark">edit</span>
                                            </IconButton>
                                        </TableCell>
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

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(Client);