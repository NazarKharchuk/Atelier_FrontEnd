import React, { useEffect } from "react";
import axios from "axios";
import { instance } from "../../API/api";
import { changeHeaderTitle, setUserData } from "../../redux/header-reducer";
import { connect } from "react-redux";
import s from "./Login.module.css";
import { Button, Typography, TextField } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const navigate = useNavigate();
    const initialValues = {
        login: "",
        password: "",
    };

    useEffect(() => {
        props.changeHeaderTitle("Вхід в акаунт");

        const token = localStorage.getItem("token");

        if (token) {
            axios
                .get("https://localhost:44385/api/token/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.seccessfully === true) {
                        console.log("Токен оновлено");
                        props.setUserData(
                            response.data.data.id,
                            response.data.data.name,
                            response.data.data.role
                        );
                        instance.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${token}`;
                        navigate("/menu", { replace: true });
                    } else {
                        localStorage.removeItem("token");
                        console.log(response.data.message);
                    }
                })
                .catch((error) => {
                    localStorage.removeItem("token");
                    console.error("Token verification error:", error);
                });
        }
    }, []);

    const validationSchema = Yup.object().shape({
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
        props2.setSubmitting(true);
        axios
            .post(
                "https://localhost:44385/api/login",
                {
                    login: values.login,
                    password: values.password,
                },
            )
            .then((response) => {
                if (response.data.seccessfully === true) {
                    props2.setSubmitting(false);
                    alert("Вхід успішно виконано");
                    props.setUserData(
                        response.data.data.id,
                        response.data.data.name,
                        response.data.data.role
                    );
                    localStorage.setItem("token", response.data.data.token);
                    instance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${response.data.data.token}`;
                    navigate("/menu", { replace: true });
                } else {
                    alert(response.data.message);
                }
            });
    };
    return (
        <div className={s.loginForm}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {(form_props) => (
                    <Form>
                        <div className={s.form}>
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
                                    placeholder="Вкажіть пароль"
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={s.button}
                                disabled={form_props.isSubmitting}
                            >
                                {form_props.isSubmitting ? "Завантаження" : "Увійти"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle, setUserData })(
    Login
);