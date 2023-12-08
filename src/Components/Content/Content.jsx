import React from "react";
import { connect } from "react-redux";
import MainMenu from "../MainMenu/MainMenu";
import s from "./Content.module.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Client from "../ClientPages/Client/Client";

const Content = (props) => {
    return (
        <div className={s.content}>
            <div>
                <Routes>
                    <Route path="/menu" element={<MainMenu />} />
                    <Route path="/clients" element={<Client />} />
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