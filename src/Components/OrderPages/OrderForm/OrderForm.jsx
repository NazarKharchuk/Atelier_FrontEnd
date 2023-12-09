import React, { useState, useEffect } from "react";
import s from "./OrderForm.module.css";
import { MenuItem, FormControl, Select, Button, TextField, Typography, InputLabel, Table, TableBody } from "@mui/material";
import { TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OrderForm = (props) => {
    const { type, initialValues, handles, lists, materials } = props;

    const navigate = useNavigate();

    const [newMaterialId, setNewMaterialId] = useState("");
    const [newMaterialName, setNewMaterialName] = useState("");
    const [newMaterialQuantity, setNewMaterialQuantity] = useState("");
    const [newMaterialReserve, setNewMaterialReserve] = useState("");
    const [newMaterialCost, setNewMaterialCost] = useState("");
    const [newMaterialCount, setNewMaterialCount] = useState("");
    const [newMaterialMessage, setNewMaterialMessage] = useState("");
    const [newOrderMessage, setNewOrderMessage] = useState("");
    const [materialLoading, setmaterialLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);

    const handleChangeMaterialName = (event) => {
        setNewMaterialMessage("");
        console.log("new material - " + event.target.value);
        if (event.target.value !== "") {
            const material = lists.listMaterials.filter(
                (x) => x.materialId === event.target.value
            );
            setNewMaterialId(material[0].materialId);
            setNewMaterialQuantity(material[0].quantity);
            setNewMaterialReserve(material[0].reserve);
            setNewMaterialCost(material[0].cost);
        } else {
            setNewMaterialId("");
            setNewMaterialQuantity("");
            setNewMaterialReserve("");
            setNewMaterialCost("");
        }
        setNewMaterialName(event.target.value);
        setNewMaterialCount("");
    };

    const handleChangeMaterialCount = (event) => {
        setNewMaterialMessage("");
        setNewMaterialCount(event.target.value);
        console.log("new material count - " + event.target.value);
        if (event.target.value <= 0) {
            setNewMaterialMessage("Невалідна кількість матеріалу");
        }
        if (event.target.value > newMaterialQuantity - newMaterialReserve) {
            setNewMaterialMessage("Така кількість матеріалу недоступна");
        }
    };

    const handleCreateMaterial = async () => {
        if (newMaterialName === "" || newMaterialCount === "") {
            alert("Не всі обов'язкові поля заповнені");
        } else {
            const material = materials.filter((x) => x.materialId === newMaterialId);
            console.log(material.length);
            if (material.length < 1) {
                setmaterialLoading(true);
                const materialData = lists.listMaterials.filter(
                    (x) => x.materialId === newMaterialId
                );
                const res = await handles.handleCreateMaterial({
                    materialId: newMaterialId,
                    name: materialData[0].name,
                    quantity: newMaterialQuantity,
                    cost: newMaterialCost,
                    reserve: newMaterialReserve,
                    count: newMaterialCount,
                });
                if (res.seccessfully === true) {
                    setNewMaterialId("");
                    setNewMaterialQuantity("");
                    setNewMaterialReserve("");
                    setNewMaterialCost("");
                    setNewMaterialName("");
                    setNewMaterialCount("");
                    alert("Дія виконана успішно!");
                } else {
                    alert(res.message);
                }
                setmaterialLoading(false);
            } else {
                alert("Цей матеріал вже використовується у замовленні");
            }
        }
    };

    const handleOrder = async () => {
        if (
            initialValues.startDate === "" ||
            initialValues.endDate === "" ||
            initialValues.status === "" ||
            initialValues.worksTypeId === "" ||
            initialValues.worksTypeId === "" ||
            initialValues.employeeId === "" ||
            initialValues.clientId === ""
        ) {
            alert("Не всі обов'язкові поля заповнені");
        } else {
            const d = new Date();
            debugger;
            if (
                Date.parse(initialValues.startDate) >
                Date.parse(initialValues.endDate) ||
                Date.parse(initialValues.startDate) > d
            ) {
                alert("Некоректна початкова дата");
                return;
            }
            if (Date.parse(initialValues.endDate) < d) {
                alert("Некоректна кінцева дата");
                return;
            }
            if (type!=="update" && initialValues.status === "2") {
                alert("Не можна створитти завершене замовлення");
                return;
            }
            setOrderLoading(true);
            var res = await handles.handleOrder();
            if (res.seccessfully === true) {
                alert("Дія виконана успішно!");
                navigate("/orders/", { replace: true });
            } else {
                alert(res.message);
            }
            setOrderLoading(false);
        }
    };

    return (
        <div className={s.orderForm}>
            <div className={s.form}>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Дата прийняття замовлення*:
                    </Typography>
                    <FormControl>
                        <TextField
                            id="start-date-select-helper"
                            label="Початкова дата"
                            type="date"
                            defaultValue={initialValues.startDate}
                            onChange={handles.handleChangeStartDate}
                            disabled={type === "update"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </div>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Дата видачі замовлення*:
                    </Typography>
                    <FormControl>
                        <TextField
                            id="end-date-select-helper"
                            label="Кінцева дата"
                            type="date"
                            defaultValue={initialValues.endDate}
                            onChange={handles.handleChangeEndDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </div>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Статус*:
                    </Typography>
                    <FormControl>
                        <InputLabel id="status-select-helper-label">Статус</InputLabel>
                        <Select
                            labelId="status-select-helper-label"
                            id="status-select-helper"
                            value={initialValues.status}
                            onChange={handles.handleChangeStatus}
                        >
                            <MenuItem key={""} value="">
                                <em>-</em>
                            </MenuItem>
                            <MenuItem key={0} value="0">Нове</MenuItem>
                            <MenuItem key={1} value="1">Виконується</MenuItem>
                            <MenuItem key={2} value="2">Завершено</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Послуга*:
                    </Typography>
                    <FormControl>
                        <InputLabel id="woks-type-id-select-helper-label">
                            Послуга
                        </InputLabel>
                        <Select
                            labelId="woks-type-id-select-helper-label"
                            id="woks-type-id-select-helper"
                            value={initialValues.worksTypeId}
                            onChange={handles.handleChangeWorksTypeId}
                            disabled={type === "update"}
                        >
                            <MenuItem key={""} value="">
                                <em>-</em>
                            </MenuItem>
                            {lists.listWorksTypes.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.str}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Працівник*:
                    </Typography>
                    <FormControl>
                        <InputLabel id="employee-id-select-helper-label">
                            Працівник
                        </InputLabel>
                        <Select
                            labelId="employee-id-select-helper-label"
                            id="employee-id-select-helper"
                            value={initialValues.employeeId}
                            onChange={handles.handleChangeEmployeeId}
                        >
                            <MenuItem key={""} value="">
                                <em>-</em>
                            </MenuItem>
                            {lists.listEmployees.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.str}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={s.formRow}>
                    <Typography variant="body1" className={s.formRowText}>
                        Клієнт*:
                    </Typography>
                    <FormControl>
                        <InputLabel id="client-id-select-helper-label">Клієнт</InputLabel>
                        <Select
                            labelId="client-id-select-helper-label"
                            id="client-id-select-helper"
                            value={initialValues.clientId}
                            onChange={handles.handleChangeClientId}
                            disabled={type === "update"}
                        >
                            <MenuItem key={""} value="">
                                <em>-</em>
                            </MenuItem>
                            {lists.listClients.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.str}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <br />
            <hr />
            <Typography variant="h6" className={s.materialFormRowText}>
                Матеріали замовлення:
            </Typography>
            {materials.length === 0 ? (
                "В даному замовленні матеріалів немає"
            ) : (
                <div>
                    <TableContainer component={Paper}>
                        <Table aria-label="material table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Матеріал</TableCell>
                                    <TableCell>Загальна кількість</TableCell>
                                    <TableCell>Зарезервовано</TableCell>
                                    <TableCell>Вартість</TableCell>
                                    <TableCell>Потрібна кількість</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {materials.map((row) => (
                                    <TableRow key={row.materialId}>
                                        <TableCell component="th" scope="row">
                                            {row.materialId}
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>{row.reserve}</TableCell>
                                        <TableCell>{row.cost}</TableCell>
                                        <TableCell>{row.count}</TableCell>
                                        <TableCell>
                                            {" "}
                                            <IconButton
                                                onClick={() =>
                                                    handles.handleDeleteMaterial(row.materialId)
                                                }
                                                color="inherit"
                                            >
                                                <span className="material-icons md-dark">delete</span>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <Typography variant="h6" className={s.materialFormRowText}>
                Додати новий матеріал для замовлення:
            </Typography>
            {newMaterialMessage && (
                <Typography variant="h6" className={s.error}>
                    {newMaterialMessage}
                </Typography>
            )}
            <div className={s.materialForm}>
                <div className={s.materialFormCol}>
                    <Typography variant="body1" className={s.materialFormRowText}>
                        Id матеріалу:
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="Id матеріалу"
                        name="materialId"
                        value={newMaterialId}
                        disabled={true}
                    />
                </div>
                <div className={s.materialFormCol}>
                    <Typography variant="body1">Id матеріалу*:</Typography>
                    <FormControl>
                        <InputLabel id="material-name-select-helper-label">
                            Матеріал
                        </InputLabel>
                        <Select
                            labelId="material-name-select-helper-label"
                            id="material-name-select-helper"
                            value={newMaterialName}
                            style={{ width: 180 }}
                            onChange={handleChangeMaterialName}
                        >
                            <MenuItem key={""} value="">
                                <em>-</em>
                            </MenuItem>
                            {lists.listMaterials.map((item) => (
                                <MenuItem key={item.materialId} value={item.materialId}>
                                    {"id: " + item.materialId + "; name: " + item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={s.materialFormCol}>
                    <Typography variant="body1">Матеріалу всього:</Typography>
                    <TextField
                        id="standard-basic"
                        label="Id матеріалу"
                        name="materialQantity"
                        value={newMaterialQuantity}
                        disabled={true}
                    />
                </div>
                <div className={s.materialFormCol}>
                    <Typography variant="body1">Резерв:</Typography>
                    <TextField
                        id="standard-basic"
                        label="Резерв"
                        name="reserve"
                        value={newMaterialReserve}
                        disabled={true}
                    />
                </div>
                <div className={s.materialFormCol}>
                    <Typography variant="body1">Вартість:</Typography>
                    <TextField
                        id="standard-basic"
                        label="Вартість"
                        name="cost"
                        value={newMaterialCost}
                        disabled={true}
                    />
                </div>
                <div className={s.materialFormCol}>
                    <Typography variant="body1" className={s.materialFormRowText}>
                        Потрібна кількість*:
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="Потрібна кількість"
                        name="count"
                        value={newMaterialCount}
                        onChange={handleChangeMaterialCount}
                        disabled={newMaterialName === ""}
                    />
                </div>
                <div className={s.materialFormCol}>
                    <div className={s.buttons}>
                        <Button
                            variant="contained"
                            className={s.materialButton}
                            color="primary"
                            onClick={handleCreateMaterial}
                            disabled={newMaterialMessage !== "" || materialLoading}
                        >
                            {materialLoading ? "Завантаження" : "Додати"}
                        </Button>
                    </div>
                </div>
            </div>
            <div className={s.buttonsErrors}>
                <div>
                    {newOrderMessage && (
                        <Typography variant="h6" className={s.error}>
                            {newOrderMessage}
                        </Typography>
                    )}
                </div>
                <div className={s.buttons}>
                    <NavLink to="/orders">
                        <Button variant="contained" className={s.button} disabled={orderLoading}>
                            Скасувати
                        </Button>
                    </NavLink>
                    <Button
                        variant="contained"
                        color="primary"
                        className={s.button}
                        onClick={handleOrder}
                        disabled={newOrderMessage !== "" || orderLoading}
                    >
                        {orderLoading
                            ? "Завантаження"
                            : type == "create"
                                ? "Створити"
                                : "Оновити"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;