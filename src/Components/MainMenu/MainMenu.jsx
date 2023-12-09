import React, { useEffect } from "react";
import s from "./MainMenu.module.css";
import { NavLink } from "react-router-dom";
import { changeHeaderTitle } from "../../redux/header-reducer";
import { connect } from "react-redux";
import { Button, Box } from "@mui/material";

const MainMenu = (props) => {
  useEffect(() => {
    props.changeHeaderTitle("Меню");
  }, []);

  return (
    <Box className={s.menuContainer}>
      <NavLink to="/orders" className={s.menuLink}>
        <Button variant="contained" color="primary" size="large" className={s.menuButton}>
          Замовлення
        </Button>
      </NavLink>

      <NavLink to="/materials" className={s.menuLink}>
        <Button variant="contained" color="primary" size="large" className={s.menuButton}>
          Матеріали
        </Button>
      </NavLink>

      <NavLink to="/clients" className={s.menuLink}>
        <Button variant="contained" color="primary" size="large" className={s.menuButton}>
          Замовники
        </Button>
      </NavLink>

      {props.header.role === 1 ? (
        <>
          <NavLink to="/employees" className={s.menuLink}>
            <Button variant="contained" color="primary" size="large" className={s.menuButton}>
              Співробітники
            </Button>
          </NavLink>

          <NavLink to="/worksTypes" className={s.menuLink}>
            <Button variant="contained" color="primary" size="large" className={s.menuButton}>
              Послуги
            </Button>
          </NavLink>
        </>
      ) : null}
    </Box>
  );
};

let mapStateToProps = (state) => {
  return {
    header: state.header,
  };
};

export default connect(mapStateToProps, { changeHeaderTitle })(MainMenu);