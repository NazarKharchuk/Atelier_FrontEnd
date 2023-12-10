import React, { useState, useEffect } from "react";
import OrderForm from "../OrderForm/OrderForm";
import { materialAPI } from "../../../API/material-api";
import { clientAPI } from "../../../API/client-api";
import { worksTypeAPI } from "../../../API/worksType-api";
import { employeeAPI } from "../../../API/employee-api";
import { orderAPI } from "../../../API/order-api";
import LinearProgress from "@mui/material/LinearProgress";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const OrderCreate = (props) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("0");
    const [worksTypeId, setWorksTypeId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [clientId, setClientId] = useState("");
    const [loaded, setLoaded] = useState(false);

    const [lists, setLists] = useState({
        listWorksTypes: [],
        listEmployees: [],
        listClients: [],
        listMaterials: [],
    });

    const [materials, setMaterials] = useState([]);

    const initialValues = {
        startDate,
        endDate,
        status,
        worksTypeId,
        worksTypeId,
        employeeId,
        clientId,
    };

    const handleChangeStartDate = (event) => {
        setStartDate(event.target.value);
    };

    const handleChangeEndDate = (event) => {
        setEndDate(event.target.value);
    };

    const handleChangeStatus = (event) => {
        console.log("Створити замовленя можна лише зі статусом \"Нове\"");
    };

    const handleChangeWorksTypeId = (event) => {
        setWorksTypeId(event.target.value);
    };

    const handleChangeEmployeeId = (event) => {
        setEmployeeId(event.target.value);
    };

    const handleChangeClientId = (event) => {
        setClientId(event.target.value);
    };

    const handleCreateMaterial = (value) => {
        setMaterials([
            ...materials,
            {
                materialId: value.materialId,
                name: value.name,
                quantity: value.quantity,
                cost: value.cost,
                reserve: parseFloat(value.reserve) + parseFloat(value.count),
                count: value.count,
            },
        ]);
        return { seccessfully: true, message: "" };
    };

    const fetchOrderCreate = async () => {
        var res_order = {
            receivingDate: startDate,
            issueDate: endDate,
            status: parseInt(status),
            workTypeId: parseInt(worksTypeId),
            employeeId: parseInt(employeeId),
            clientId: parseInt(clientId),
        };
        var res_materials = [];
        res_materials = materials.map((material) => ({
            materialId: parseInt(material.materialId),
            count: parseFloat(material.count),
        }));
        var result = await orderAPI.createOrder(res_order, res_materials);
        return result;
    };

    const handleOrder = async () => {
        const res = await fetchOrderCreate();
        return res;
    };

    const handleDeleteMaterial = async (id) => {
        var new_materials = materials.filter((item) => item.materialId !== id);
        setMaterials(new_materials);
    };

    const handles = {
        handleChangeStartDate,
        handleChangeEndDate,
        handleChangeStatus,
        handleChangeWorksTypeId,
        handleChangeWorksTypeId,
        handleChangeEmployeeId,
        handleChangeClientId,
        handleOrder,
        handleCreateMaterial,
        handleDeleteMaterial,
    };

    useEffect(() => {
        props.changeHeaderTitle("Додавання нового замовлення");
        async function loadData() {
            const cResult = await clientAPI.clientsSelectData();
            const wResult = await worksTypeAPI.worksTypesSelectData();
            const eResult = await employeeAPI.employeesSelectData();
            const mResult = await materialAPI.materialsSelectData();
            setLists((lists) => ({
                ...lists,
                listClients: cResult.data,
                listWorksTypes: wResult.data,
                listEmployees: eResult.data,
                listMaterials: mResult.data,
            }));
            setLoaded(true);
        }
        loadData();
    }, []);

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <OrderForm
                type="create"
                initialValues={initialValues}
                handles={handles}
                lists={lists}
                materials={materials}
            />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle })(OrderCreate);