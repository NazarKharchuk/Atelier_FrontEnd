import React, { useState, useEffect } from "react";
import OrderForm from "../OrderForm/OrderForm";
import { materialAPI } from "../../../API/material-api";
import { clientAPI } from "../../../API/client-api";
import { worksTypeAPI } from "../../../API/worksType-api";
import { employeeAPI } from "../../../API/employee-api";
import { orderAPI } from "../../../API/order-api";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "react-router-dom";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const OrderUpdate = (props) => {
    const params = useParams();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
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

    var initialValues = {
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
        if (event.target.value >= status) {
            setStatus(event.target.value);
        }
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

    const handleCreateMaterial = async (value) => {
        var new_material = {
            materialId: parseInt(value.materialId),
            count: parseFloat(value.count),
        };
        const result = await orderAPI.createOrderMaterial(params.id, new_material);
        const mResult = await materialAPI.materialsSelectData();
        setLists((lists) => ({
            ...lists,
            listMaterials: mResult.data,
        }));
        var o_materials = await orderAPI.orderMaterials(params.id);
        var fullMaterialData = [];
        o_materials.data.forEach((new_m) => {
            const element = mResult.data.find((e) => e.materialId === new_m.materialId);
            if (element) {
                fullMaterialData.push({
                    materialId: element.materialId,
                    name: element.name,
                    quantity: element.quantity,
                    cost: element.cost,
                    reserve: element.reserve,
                    count: new_m.count,
                });
            }
        });
        setMaterials(fullMaterialData);
        return result;
    };

    const fetchOrderUpdate = async () => {
        var res_order = {
            receivingDate: startDate,
            issueDate: endDate,
            status: parseInt(status),
            workTypeId: parseInt(worksTypeId),
            employeeId: parseInt(employeeId),
            clientId: parseInt(clientId),
        };
        var result = await orderAPI.updateOrder(params.id, res_order);
        return result;
    };

    const handleOrder = async () => {
        const res = await fetchOrderUpdate();
        const result = await orderAPI.order(params.id);
        setStartDate(result.data.receivingDate.split("T")[0]);
        setEndDate(result.data.issueDate.split("T")[0]);
        setStatus(result.data.status);
        setWorksTypeId(result.data.workTypeId);
        setEmployeeId(result.data.employeeId);
        setClientId(result.data.clientId);
        return res;
    };

    const handleDeleteMaterial = async (id) => {
        await orderAPI.deleteOrderMaterial(params.id, id);
        const mResult = await materialAPI.materialsSelectData();
        setLists((lists) => ({
            ...lists,
            listMaterials: mResult.data,
        }));
        var o_materials = await orderAPI.orderMaterials(params.id);
        console.log(o_materials);
        var fullMaterialData = [];
        o_materials.data.forEach((new_m) => {
            const element = lists.listMaterials.find((e) => e.materialId === new_m.materialId);
            if (element) {
                fullMaterialData.push({
                    materialId: element.materialId,
                    name: element.name,
                    quantity: element.quantity,
                    cost: element.cost,
                    reserve: element.reserve,
                    count: new_m.count,
                });
            }
        });
        setMaterials(fullMaterialData);
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
        props.changeHeaderTitle("Редагування замовлення");
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
            const result = await orderAPI.order(params.id);
            if (result.seccessfully === true) {
                setStartDate(result.data.receivingDate.split("T")[0]);
                setEndDate(result.data.issueDate.split("T")[0]);
                setStatus(result.data.status);
                setWorksTypeId(result.data.workTypeId);
                setEmployeeId(result.data.employeeId);
                setClientId(result.data.clientId);
                var o_materials = await orderAPI.orderMaterials(params.id);
                var fullMaterialData = [];
                mResult.data.forEach((element) => {
                    o_materials.data.forEach((new_m) => {
                        if (new_m.materialId === element.materialId) {
                            fullMaterialData.push({
                                materialId: element.materialId,
                                name: element.name,
                                quantity: element.quantity,
                                cost: element.cost,
                                reserve: element.reserve,
                                count: new_m.count,
                            });
                        }
                    });
                });
                setMaterials(fullMaterialData);
                setLoaded(true);
            } else {
                console.log(result.message);
            }
        }
        loadData();
    }, []);

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <OrderForm
                type="update"
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

export default connect(mapStateToProps, { changeHeaderTitle })(OrderUpdate);