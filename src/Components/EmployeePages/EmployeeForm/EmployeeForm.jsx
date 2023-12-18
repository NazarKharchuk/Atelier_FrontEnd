import React from "react";
import s from "./EmployeeForm.module.css";
import { Button, Typography, TextField } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const EmploeeForm = (props) => {
    const initialValues = props.initialValues;
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required("Ім'я обов'язкове")
            .max(20, "Максимальна довжина: 20 символів")
            .matches(/^[^\d]*$/, "Ім'я не повинно містити цифри"),
        lastName: Yup.string()
            .required("Прізвище обов'язкове")
            .max(20, "Максимальна довжина: 20 символів")
            .matches(/^[^\d]*$/, "Прізвище не повинно містити цифри"),
        middleName: Yup.string().max(20, "Максимальна довжина: 20 символів")
            .matches(/^[^\d]*$/, "По-батькові не повинно містити цифри"),
        phoneNumber: Yup.string()
            .required("Номер телефону обов'язковий")
            .matches(/^(?:\+38)?[0-9]{10}$/, "Не правильний номер"),
        address: Yup.string().max(50, "Максимальна довжина: 50 символів"),
        login: Yup.string()
            .required("Логін обов'язковий")
            .max(30, "Максимальна довжина: 30 символів")
            .min(5, "Мінімальна довжина: 5 символів"),
        password: Yup.string()
            .required("Пароль обов'язковий")
            .max(30, "Максимальна довжина: 30 символів")
            .min(5, "Мінімальна довжина: 5 символів"),
    });

    const onSubmit = async (values, props2) => {
        const res = await props.handleClick(values);
        if (res.seccessfully === true) {
            props2.setSubmitting(false);
            alert("Дія виконана успішно!");
            navigate("/employees/", { replace: true });
        } else {
            console.log(res.message);
            alert(res.message);
            navigate("/employees/", { replace: true });
        }
    };

    return (
        <div className={s.employeeForm}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                buttonName="MyButton"
            >
                {(props) => (
                    <Form>
                        <div className={s.form}>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Ім'я:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-firstName"
                                    label="Ім'я"
                                    name="firstName"
                                    placeholder="Введіть ім'я"
                                    required
                                    helperText={
                                        <ErrorMessage name="firstName">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Прізвище:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-lastName"
                                    label="Прізвище"
                                    name="lastName"
                                    placeholder="Введіть прізвище"
                                    required
                                    helperText={
                                        <ErrorMessage name="lastName">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    По батькові:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-middleName"
                                    label="Ім'я по батькові"
                                    name="middleName"
                                    placeholder="Введіть ім'я по батькові"
                                    helperText={
                                        <ErrorMessage name="middleName">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Номер телефону:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-phoneNumber"
                                    label="Номер телефону"
                                    name="phoneNumber"
                                    placeholder="Введіть номер телефону"
                                    required
                                    helperText={
                                        <ErrorMessage name="phoneNumber">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Адреса:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-address"
                                    label="Адреса"
                                    name="address"
                                    placeholder="Введіть адресу"
                                    helperText={
                                        <ErrorMessage name="address">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Логін:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-login"
                                    label="Логін"
                                    name="login"
                                    placeholder="Придумайте логін"
                                    required
                                    helperText={
                                        <ErrorMessage name="login">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Пароль:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic-password"
                                    label="Пароль"
                                    name="password"
                                    placeholder="Придумайте пароль"
                                    type="password"
                                    required
                                    helperText={
                                        <ErrorMessage name="password">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                        </div>
                        <div className={s.buttons}>
                            <NavLink to="/employees">
                                <Button variant="contained" className={s.button} disabled={props.isSubmitting}>
                                    Скасувати
                                </Button>
                            </NavLink>
                            <Button
                                type="submit"
                                variant="contained"
                                className={s.button}
                                color="primary"
                                disabled={props.isSubmitting}
                            >
                                {props.isSubmitting ? "Завантаження" : props.values.buttonName}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EmploeeForm;