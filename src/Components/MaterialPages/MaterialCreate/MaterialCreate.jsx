import React, { useEffect } from "react";
import { materialAPI } from "../../../API/material-api";
import MaterialForm from "../MaterialForm/MaterialForm";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const MaterialCreate = (props) => {
    const initialValues = {
        name: "",
        quantity: 10,
        reserve: 0,
        cost: 10,
        buttonName: "Додати",
    };

    useEffect(() => {
        props.changeHeaderTitle("Додавання нового матеріалу");
    }, []);

    const fetchMaterialsData = async (material) => {
        const result = await materialAPI.createMaterial(material);
        return result;
    };

    return (
        <div>
            <MaterialForm
                initialValues={initialValues}
                handleClick={fetchMaterialsData}
                type="create"
            />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle })(MaterialCreate);