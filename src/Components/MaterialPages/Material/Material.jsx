import React, { useState, useEffect } from "react";
import { materialAPI } from "../../../API/material-api";
import s from "./Material.module.css";
import { Button, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { LinearProgress, IconButton, Alert, InputLabel, MenuItem, FormHelperText, FormControl, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const columns = [
    {
        id: "materialId",
        label: "MaterialId",
        minWidth: 100,
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "name",
        label: "Name",
        minWidth: 100,
    },
    {
        id: "quantity",
        label: "Quantity",
        minWidth: 100,
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "reserve",
        label: "Reserve",
        minWidth: 100,
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "cost",
        label: "Cost",
        minWidth: 150,
        format: (value) => value.toLocaleString("en-US"),
    },
];

const Material = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(false);
    const [errorMes, setErrorMes] = useState("");
    const [name, setName] = useState("");
    const [sort, setSort] = useState("");
    const [listNames, setListNames] = useState([]);
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

    const fetchMaterialsData = async () => {
        setLoaded(false);
        const result = await materialAPI.materials(
            page + 1,
            rowsPerPage,
            name,
            sort
        );
        if (result.seccessfully === true) {
            setData(result.data.list);
            setCount(result.data.totalCount);
            setLoaded(true);
        } else {
            setError(true);
            setErrorMes(result.data.message);
        }
    };

    const fetchNamesData = async () => {
        const result = await materialAPI.materialsNames();
        if (result.seccessfully === true) {
            setListNames(result.data);
        } else {
            setError(true);
            setErrorMes(result.data.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Список матеріалів");
        fetchMaterialsData();
        fetchNamesData();
    }, []);

    useEffect(() => {
        setLoaded(false);
        fetchMaterialsData();
    }, [page, rowsPerPage]);

    const handleEditRow = (materialId) => {
        console.log(materialId);
        navigate("/materials/update/" + materialId, { replace: true });
    };

    const handleCreateButton = () => {
        navigate("/materials/create", { replace: true });
    };

    const handleFilterButton = (event) => {
        setPage(0);
        setLoaded(false);
        fetchMaterialsData();
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeSort = (event) => {
        setSort(event.target.value);
    };

    const ExportFile = async () => {
        var data = await materialAPI.materialsExportData();
        const utf8BOM = '\uFEFF';
        const csvContent = `${utf8BOM}${data}`;
        const downloadUrl = window.URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "Materials.csv");
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
                    <InputLabel id="name-select-helper-label">Назва матеріалу</InputLabel>
                    <Select
                        labelId="name-select-helper-label"
                        id="name-select-helper"
                        value={name}
                        onChange={handleChangeName}
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
                    <FormHelperText>Пошук за назвою матеріалу</FormHelperText>
                </FormControl>

                <FormControl>
                    <InputLabel id="sort-select-helper-label">Сортувати за</InputLabel>
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
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.materialId}
                                    >
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
                                                onClick={() => handleEditRow(row.materialId)}
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
                <div>
                    <Button variant="contained" color="primary" onClick={ExportFile}>
                        Імпортувати
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate("/materials/statistic");
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

export default connect(mapStateToProps, { changeHeaderTitle })(Material);