import React, { useEffect } from "react";
import { clientAPI } from "../../../API/client-api";
import ClientForm from "../ClientForm/ClientForm";
import s from "./ClientCreate.module.css";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const ClientCreate = (props) => {
    const initialValues = {
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        address: "",
        buttonName: "Додати",
    };

    useEffect(() => {
        props.changeHeaderTitle("Додавання нового клієнта");
    }, []);

    const fetchClientsData = async (client) => {
        const result = await clientAPI.createClient(client);
        return result;
    };

    return (
        <div className={s.clientCreate}>
            <ClientForm
                initialValues={initialValues}
                handleClick={fetchClientsData}
            />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle })(ClientCreate);