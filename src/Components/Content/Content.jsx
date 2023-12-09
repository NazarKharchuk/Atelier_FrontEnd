import React from "react";
import { connect } from "react-redux";
import MainMenu from "../MainMenu/MainMenu";
import s from "./Content.module.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Client from "../ClientPages/Client/Client";
import ClientCreate from "../ClientPages/ClientCreate/ClientCreate";
import ClientUpdate from "../ClientPages/ClientUpdate/ClientUpdate";
import WorksType from "../WorksTypePages/WorksType/WorksType";
import WorksTypeCreate from "../WorksTypePages/WorksTypeCreate/WorksTypeCreate";
import WorksTypeUpdate from "../WorksTypePages/WorksTypeUpdate/WorksTypeUpdate";
import Material from "../MaterialPages/Material/Material";
import MaterialCreate from "../MaterialPages/MaterialCreate/MaterialCreate";
import MaterialUpdate from "../MaterialPages/MaterialUpdate/MaterialUpdate";
import MaterialsStatistic from "../MaterialPages/MaterialsStatistic/MaterialsStatistic";
import Order from "../OrderPages/Order/Order";
import OrderCreate from "../OrderPages/OrderCreate/OrderCreate";
import OrderUpdate from "../OrderPages/OrderUpdate/OrderUpdate";
import OrderStatistic from "../OrderPages/OrderStatistic/OrderStatistic";
import Employee from "../EmployeePages/Employee/Employee";
import EmployeeCreate from "../EmployeePages/EmployeeCreate/EmployeeCreate";
import Login from "../LoginPages/Login";

const Content = (props) => {
    return (
        <div className={s.content}>
            <div>
                <Routes>
                    <Route path="/menu" element={<MainMenu />} />
                    <Route path="/clients" element={<Client />} />
                    <Route path="/clients/create" element={<ClientCreate />} />
                    <Route path="/clients/update/:id" element={<ClientUpdate />} />
                    <Route path="/worksTypes" element={<WorksType />} />
                    <Route path="/worksTypes/create" element={<WorksTypeCreate />} />
                    <Route path="/worksTypes/update/:id" element={<WorksTypeUpdate />} />
                    <Route path="/materials" element={<Material />} />
                    <Route path="/materials/create" element={<MaterialCreate />} />
                    <Route path="/materials/update/:id" element={<MaterialUpdate />} />
                    <Route path="/materials/statistic" element={<MaterialsStatistic />} />
                    <Route path="/orders" element={<Order />} />
                    <Route path="/orders/create" element={<OrderCreate />} />
                    <Route path="/orders/update/:id" element={<OrderUpdate />} />
                    <Route path="/orders/statistic" element={<OrderStatistic />} />
                    <Route path="/employees" element={<Employee />} />
                    <Route path="/employees/create" element={<EmployeeCreate />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/menu" replace />} />
                </Routes>
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, {})(Content);