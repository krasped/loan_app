const defaultState = {
    //присваивается когда пользователь открыл пирложение
    userEmail: null,
    isLoggedIn: false,
    userToken: null,
    userId: null
};

const autorizationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "AUTORIZATION_STATUS":
            return { ...state, isLoggedIn: action.payload };
        case "USER_EMAIL":
            return { ...state, userEmail: action.payload };
        case "USER_TOKEN":
            return { ...state, userToken: action.payload };
        case "USER_ID":
            return { ...state, userId: action.payload };
        default:
            return state;
    }
};

export default autorizationReducer;
