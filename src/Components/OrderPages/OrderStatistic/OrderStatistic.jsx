import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { InputLabel, MenuItem, FormControl, Select, Button, LinearProgress } from "@mui/material";
import { orderAPI } from "../../../API/order-api";
import { changeHeaderTitle } from "../../../redux/header-reducer";
import { connect } from "react-redux";

const OrdersStatistic = (props) => {
    const [year, setYear] = useState();
    const [maxYear, setMaxYear] = useState();
    const [minYear, setMinYear] = useState();
    const [yearsList, setYearsList] = useState();
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const handleChangeYear = (event) => {
        setYear(event.target.value);
    };

    const getOrdersDataForChart = async () => {
        setLoaded(false);
        const result = await orderAPI.getStatisticalData(parseInt(year));
        if (result.seccessfully === true) {
            var array = [];
            result.data.forEach((element) => {
                array.push({
                    monthName: element.monthName,
                    newOrdersCount: element.newOrdersCount,
                    inProcessOrdersCount: element.inProcessOrdersCount,
                    completedOrdersCount: element.completedOrdersCount,
                });
            });
            setData(array);
            setLoaded(true);
        } else {
            console.log(result.message);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Статистика: замовлення");
        async function loadData() {
            const result = await orderAPI.getMinMaxYear();
            if (result.seccessfully === true) {
                setYear(result.data.minYear);
                setMinYear(result.data.minYear);
                setMaxYear(result.data.maxYear);
                var array = [];
                for (var i = result.data.minYear; i <= result.data.maxYear; i++) {
                    array.push(i);
                }
                setYearsList(array);
                setLoaded(true);
            } else {
                console.log(result.message);
            }
        }
        loadData();
    }, []);

    if (!loaded) {
        return <LinearProgress color="secondary" />;
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", padding: "25px" }}>
                <FormControl style={{ width: "150px" }}>
                    <InputLabel id="label">Виберіть рік</InputLabel>
                    <Select
                        labelId="label"
                        id="select"
                        value={year}
                        onChange={handleChangeYear}
                    >
                        {yearsList.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getOrdersDataForChart}
                >
                    Візуалізувати дані про замовлення обраного року
                </Button>
            </div>
            {data.length === 0 ? null : (
                <div>
                    <ResponsiveContainer width="100%" aspect={3}>
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="newOrdersCount" stackId="a" fill="#FF0000" />
                            <Bar dataKey="inProcessOrdersCount" stackId="a" fill="#FFFF00" />
                            <Bar dataKey="completedOrdersCount" stackId="a" fill="#00FF00" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle })(OrdersStatistic);