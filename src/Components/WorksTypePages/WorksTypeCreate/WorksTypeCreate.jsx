import React, { useEffect } from "react";
import WorksTypeForm from "../WorksTypeForm/WorksTypeForm";
import { worksTypeAPI } from "../../../API/worksType-api";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const WorksTypeCreate = (props) => {
    const initialValues = {
        name: "",
        cost: 10,
        buttonName: "Додати",
    };

    useEffect(() => {
        props.changeHeaderTitle("Додавання нової послуги");
        props.changeBackLink("/worksTypes");
    }, []);

    const fetchWorksTypesData = async (worksType) => {
        const result = await worksTypeAPI.createWorksType(worksType);
        return result;
    };

    return (
        <div>
            <WorksTypeForm
                initialValues={initialValues}
                handleClick={fetchWorksTypesData}
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

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(WorksTypeCreate);