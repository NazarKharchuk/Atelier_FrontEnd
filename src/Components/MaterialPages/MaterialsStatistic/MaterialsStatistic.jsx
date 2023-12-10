import React, { useState, useEffect } from "react";
import { materialAPI } from "../../../API/material-api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Box, LinearProgress, Input, InputLabel, MenuItem, FormControl, Select, Chip, Button } from "@mui/material";
import { changeHeaderTitle, changeBackLink } from "../../../redux/header-reducer";
import { connect } from "react-redux";
import s from "./MaterialsStatistic.module.css";
import { useTheme } from '@mui/material/styles';

function getStyles(material, selectedMaterialNames, theme) {
    return {
        fontWeight:
            selectedMaterialNames.indexOf(material) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const MaterialsStatistic = (props) => {
    const theme = useTheme();

    const [selectedMaterialNames, setSelectedMaterialNames] = useState([]);
    const [dataForChart, setDataForChart] = useState([]);
    const [allMaterials, setAllMaterials] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const getMaterialsDataForChart = () => {
        var array = [];
        allMaterials.forEach((material) => {
            selectedMaterialNames.forEach((name) => {
                if (name === material.name) {
                    array.push({
                        materialId: material.materialId,
                        name: material.name,
                        free: parseFloat(material.quantity) - parseFloat(material.reserve),
                        reserve: material.reserve,
                        cost: material.cost,
                    });
                }
            });
        });
        setDataForChart(array);
    };

    const handleChange = (event) => {
        if (event.target.value.length > 20) {
            alert("Можна вибрати до 20 матеріалів");
        } else {
            setSelectedMaterialNames(event.target.value);
        }
    };

    useEffect(() => {
        props.changeHeaderTitle("Статистика: матеріали");
        props.changeBackLink("/materials");
        async function loadData() {
            const result = await materialAPI.materialsSelectData();
            if (result.seccessfully === true) {
                setAllMaterials(result.data);
                setLoaded(true);
            }
            else {
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
            <div className={s.container}>
                <FormControl sx={{ minWidth: '200px' }}>
                    <InputLabel id="demo-mutiple-chip-label">Матеріали</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={selectedMaterialNames}
                        onChange={handleChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {allMaterials.map((material) => (
                            <MenuItem
                                key={material.materialId}
                                value={material.name}
                                style={getStyles(material.name, selectedMaterialNames, theme)}
                            >
                                {material.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getMaterialsDataForChart}
                >
                    Візуалізувати дані обраних матеріалів
                </Button>
            </div>
            {dataForChart.length === 0 ? null : (
                <div>
                    <ResponsiveContainer width="100%" aspect={3}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={dataForChart}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="reserve"
                                stackId="1"
                                stroke="#6495ED"
                                fill="#6495ED"
                            />
                            <Area
                                type="monotone"
                                dataKey="free"
                                stackId="1"
                                stroke="#87CEFA"
                                fill="#87CEFA"
                            />
                        </AreaChart>
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

export default connect(mapStateToProps, { changeHeaderTitle, changeBackLink })(MaterialsStatistic);