import React, { useState, useEffect } from "react";
import { clientAPI } from "../../../API/client-api";
import ClientForm from "../ClientForm/ClientForm";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const ClientUpdate = (props) => {
    const params = useParams();

    const [loaded, setLoaded] = useState(false);
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        address: "",
        buttonName: "Змінити",
    });

    useEffect(() => {
        props.changeHeaderTitle("Редагування клієнта");
        props.changeBackLink("/clients");
        async function loadData() {
            const result = await clientAPI.client(params.id);
            setInitialValues((initialValues) => ({
                ...initialValues,
                firstName: result.data.firstName,
                lastName: result.data.lastName,
                middleName: result.data.middleName,
                address: result.data.address,
                phoneNumber: result.data.phoneNumber,
            }));
            setLoaded(true);
        }
        loadData();
    }, []);

    const fetchClientsData = async (client) => {
        const result = await clientAPI.updateClient(params.id, client);
        return result;
    };

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
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

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(ClientUpdate);