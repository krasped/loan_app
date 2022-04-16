const defaultState = {
    //присваивается когда пользователь открыл пирложение
    userEmail: null,
    isLoggedIn: false
};

const autorizationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "AUTORIZATION_STATUS":
            return { ...state, isLoggedIn: action.payload };
        case "USER_EMAIL":
            return { ...state, userEmail: action.payload };

        default:
            return state;
    }
};

export default autorizationReducer;
