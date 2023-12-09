import React, { useState, useEffect } from "react";
import { materialAPI } from "../../../API/material-api";
import MaterialForm from "../MaterialForm/MaterialForm";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const MaterialUpdete = (props) => {
    const params = useParams();

    const [loaded, setLoaded] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: "",
        quantity: 10,
        reserve: 0,
        cost: 10,
        buttonName: "Змінити",
    });

    useEffect(() => {
        props.changeHeaderTitle("Редагування матеріалу");
        async function loadData() {
            const result = await materialAPI.material(params.id);
            if (result.seccessfully === true) {
                setInitialValues((initialValues) => ({
                    ...initialValues,
                    name: result.data.name,
                    quantity: result.data.quantity,
                    reserve: result.data.reserve,
                    cost: result.data.cost,
                }));
                setLoaded(true);
            }
            else {
                console.log(result.data.message);
            }
        }
        loadData();
    }, []);

    const fetchMaterialData = async (material) => {
        const result = await materialAPI.updateMaterial(params.id, material);
        return result;
    };

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <MaterialForm
                initialValues={initialValues}
                handleClick={fetchMaterialData}
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

export default connect(mapStateToProps, { changeHeaderTitle })(MaterialUpdete);