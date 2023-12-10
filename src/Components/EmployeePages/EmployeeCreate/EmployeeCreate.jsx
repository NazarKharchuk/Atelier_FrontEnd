import React, { useEffect } from "react";
import { employeeAPI } from "../../../API/employee-api";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const EmployeeCreate = (props) => {
    const initialValues = {
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        address: "",
        login: "",
        password: "",
        buttonName: "Додати",
    };

    useEffect(() => {
        props.changeHeaderTitle("Додавання нового працівника");
        props.changeBackLink("/employees");
    }, []);

    const fetchCreateEmployee = async (employee) => {
        const result = await employeeAPI.createEmployee(employee);
        return result;
    };

    return (
        <div>
            <EmployeeForm
                initialValues={initialValues}
                handleClick={fetchCreateEmployee}
            />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(EmployeeCreate);