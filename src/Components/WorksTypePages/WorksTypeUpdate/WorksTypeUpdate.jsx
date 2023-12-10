import React, { useState, useEffect } from "react";
import { worksTypeAPI } from "../../../API/worksType-api";
import WorksTypeForm from "../WorksTypeForm/WorksTypeForm";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const WorksTypeUpdete = (props) => {
    const params = useParams();

    const [loaded, setLoaded] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: "",
        cost: 10,
        buttonName: "Змінити",
    });

    useEffect(() => {
        props.changeHeaderTitle("Редагування послуги");
        props.changeBackLink("/worksTypes");
        async function loadData() {
            const result = await worksTypeAPI.worksType(params.id);
            if (result.seccessfully === true) {
                setInitialValues((initialValues) => ({
                    ...initialValues,
                    name: result.data.name,
                    cost: result.data.cost,
                }));
                setLoaded(true);
            } else {
                console.log(result.message);
            }
        }
        loadData();
    }, []);

    const fetchWorksTypeData = async (worksType) => {
        const result = await worksTypeAPI.updateWorksType(params.id, worksType);
        return result;
    };

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <WorksTypeForm
                initialValues={initialValues}
                handleClick={fetchWorksTypeData}
                type="update"
            />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(WorksTypeUpdete);