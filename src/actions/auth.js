import * as ActionTypes from './ActionTypes';

export const login = (email, password, authToken, roles) => {
    return {
        type: ActionTypes.LOGIN,
        email: email,
        password: password,
        authToken: authToken,
        roles: roles
    };
};

export const logout = () => {
    return {
        type: ActionTypes.LOGOUT
    };
};