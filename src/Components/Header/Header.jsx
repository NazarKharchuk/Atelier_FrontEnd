import React from "react";
import { connect } from "react-redux";
import { Typography, AppBar, Toolbar } from '@mui/material';

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    userName: {},
});

const Header = (props) => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" >
                        {props.header.headerTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        header: state.header,
    };
};

export default connect(mapStateToProps, { })(Header);