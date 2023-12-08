const CHANGE_HEADER_TITLE = "CHANGE_HEADER_TITLE";
const SET_USER_DATA = "SET_USER_DATA";
const USER_LOGOUT = "USER_LOGOUT";

let initialState = {
    headerTitle: "Title",
    backLink: "/menu",
    userName: null,
    myId: null,
    isAuth: false,
    role: null,
};

const headerReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_HEADER_TITLE: {
            return {
                ...state,
                headerTitle: action.title,
            };
        }
        case SET_USER_DATA: {
            return {
                ...state,
                myId: action.id,
                userName: action.name,
                role: action.role,
                isAuth: true,
            };
        }
        case USER_LOGOUT: {
            return {
                ...state,
                myId: null,
                userName: null,
                role: null,
                isAuth: false,
            };
        }
        default:
            return state;
    }
};

export const changeHeaderTitle = (title) => ({
    type: CHANGE_HEADER_TITLE,
    title: title,
});

export const setUserData = (id, name, role) => ({
    type: SET_USER_DATA,
    id: id,
    name: name,
    role: role,
});

export const userLogout = () => ({
    type: USER_LOGOUT,
});

export default headerReducer;