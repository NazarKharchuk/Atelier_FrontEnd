import React from "react";
import s from "./MaterialForm.module.css";
import { Button, Typography, TextField } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const MaterialForm = (props) => {
    const initialValues = props.initialValues;
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Назва матеріалу обов'язкова")
            .max(30, "Максимальна довжина: 30 символів"),
        quantity: Yup.number()
            .required("Кількість матеріалу обов'язкова")
            .min(1, "Мінімальне значення: 1")
            .test('isLarger', 'Кількість не може бути меншою резерву', (value, testContext) => {
                if (testContext.parent.reserve > value) return false
                return true
            }),
        reserve: Yup.number()
            .required("Oбов'язкова")
            .min(0, "Мінімальне значення: 0"),
        cost: Yup.number()
            .required("Вартість матеріалу обов'язкова")
            .min(1, "Мінімальне значення: 1"),
    });

    const onSubmit = async (values, props2) => {
        console.log(values);
        const res = await props.handleClick(values);
        if (res.seccessfully === true) {
            /*props2.resetForm();*/
            props2.setSubmitting(false);
            alert("Дія виконана успішно!");
            navigate("/materials/", { replace: true });
        } else {
            console.log(res.message);
            alert(res.message);
            navigate("/materials/", { replace: true });
        }
    };

    return (
        <div className={s.materialForm}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                buttonName="MyButton"
            >
                {(props2) => (
                    <Form>
                        <div className={s.form}>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Назва матеріалу:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Назва матеріалу"
                                    name="name"
                                    placeholder="Введіть назву матеріалу"
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
                                    Кількість:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Кількість"
                                    name="quantity"
                                    placeholder="Введіть кількість матеріалу"
                                    required
                                    helperText={
                                        <ErrorMessage name="quantity">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Резерв:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Резерв"
                                    name="reserve"
                                    placeholder="Введіть резерв"
                                    required
                                    disabled={true}
                                    helperText={
                                        <ErrorMessage name="reserve">
                                            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                                        </ErrorMessage>
                                    }
                                />
                            </div>
                            <div className={s.formRow}>
                                <Typography variant="body1" className={s.formRowText}>
                                    Вартість:
                                </Typography>
                                <Field
                                    as={TextField}
                                    id="standard-basic"
                                    label="Вартість"
                                    name="cost"
                                    placeholder="Введіть вартість"
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
                            <NavLink to="/materials">
                                <Button variant="contained" className={s.button} disabled={props2.isSubmitting}>
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

export default MaterialForm;