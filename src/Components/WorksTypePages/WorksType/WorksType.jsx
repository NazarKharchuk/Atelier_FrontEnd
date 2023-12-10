import React, { useState, useEffect } from "react";
import { worksTypeAPI } from "../../../API/worksType-api";
import s from "./WorksType.module.css";
import { Table, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { Button, LinearProgress, IconButton, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const columns = [
    {
        id: "worksTypeId",
        label: "WorksTypeId",
        minWidth: 100,
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "name",
        label: "Name",
        minWidth: 150,
    },
    {
        id: "cost",
        label: "Cost",
        minWidth: 100,
        format: (value) => value.toLocaleString("en-US"),
    },
];

const WorksType = (props) => {
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

    const fetchWorksTypesData = async () => {
        setLoaded(false);
        const result = await worksTypeAPI.worksTypes(page + 1, rowsPerPage);
        if (result.seccessfully === true) {
            setData(result.data.list);
            setCount(result.data.totalCount);
            setLoaded(true);
        } else {
            setError(true);
            setErrorMes(result.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Список послуг");
        props.changeBackLink("/menu");
        fetchWorksTypesData();
    }, []);

    useEffect(() => {
        setLoaded(false);
        fetchWorksTypesData();
    }, [page, rowsPerPage]);

    const handleEditRow = (worksTypeId) => {
        navigate("/worksTypes/update/" + worksTypeId, { replace: true });
    };

    const handleCreateButton = () => {
        navigate("/worksTypes/create", { replace: true });
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.worksTypeId}>
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
                                                onClick={() => handleEditRow(row.worksTypeId)}
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

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(WorksType);