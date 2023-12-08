import React from "react";
import s from "./WorksTypeForm.module.css";
import { Button, Typography, TextField } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const WorksTypeForm = (props) => {
    const initialValues = props.initialValues;
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Назва послуги обов'язкова")
            .max(30, "Максимальна довжина: 30 символів"),
        cost: Yup.number()
            .required("Кількість матеріалу обов'язкова")
            .min(1, "Мінімальне значення: 1")
    });

    const onSubmit = async (values, props2) => {
        const res = await props.handleClick(values);
        if (res.seccessfully === true) {
            props2.setSubmitting(false);
            alert("Дія виконана успішно!");
            navigate("/worksTypes/", { replace: true });
        } else {
            console.log(res.message);
            alert(res.message);
            navigate("/worksTypes/", { replace: true });
        }
    };

    return (
        <div className={s.materialForm}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {(props2) => (
                    <Form>
                        <div className={s.form}>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Назва послуги:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Назва послуги"
                                    name="name"
                                    placeholder="Введіть назву послуги"
                                    required
                                    helperText={
                                        <ErrorMessage name="name">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Вартість послуги:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Вартість послуги"
                                    name="cost"
                                    placeholder="Введіть вартість послуги"
                                    required
                                    helperText={
                                        <ErrorMessage name="cost">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                        </div>
                        <div className={s.buttons}>
                            <NavLink to="/worksTypes">
                                <Button variant="contained" className={s.button}>
                                    Скасувати
                                </Button>
                            </NavLink>
                            <Button
                                type="submit"
                                variant="contained"
                                className={s.button}
                                color="primary"
                                disabled={props2.isSubmitting}
                            >
                                {props2.isSubmitting
                                    ? "Завантаження"
                                    : props2.values.buttonName}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default WorksTypeForm;