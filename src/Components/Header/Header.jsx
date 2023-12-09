import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { changeHeaderTitle, userLogout } from "../../redux/header-reducer";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../API/api";
import s from "./Header.module.css"

const Header = (props) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const menuId = "primary-search-account-menu";

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {props.header.isAuth ? (
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        props.userLogout();
                        localStorage.removeItem("token");
                        delete instance.defaults.headers.common["Authorization"];
                        navigate("/login", { replace: true });
                    }}
                >
                    Вийти
                </MenuItem>
            ) : (
                <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                    Увійти
                </MenuItem>
            )}
        </Menu>
    );

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {props.header.isAuth && (
                        <IconButton
                            edge="start"
                            className={s.backButton}
                            color="inherit"
                            aria-label="back"
                            component={Link}
                            to={props.header.backLink}
                        >
                            <span className="material-icons md-dark">arrow_back_ios</span>
                        </IconButton>
                    )}
                    <Typography variant="h5" className={s.title}>
                        {props.header.headerTitle}
                    </Typography>
                    <Typography variant="body1" className={s.userName}>
                        {props.header.userName}
                    </Typography>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <span className="material-icons md-dark">account_circle</span>
                    </IconButton>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { changeHeaderTitle, userLogout })(Header);