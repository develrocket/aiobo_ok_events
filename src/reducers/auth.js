import * as ActionTypes from '../actions/ActionTypes';
import axios from 'react-native-axios';

const defaultState = {
    isLoggedIn: false,
    email: '',
    password: '',
    authToken: '',
    roles: []
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            axios.defaults.headers.common['AIOBO-TOKEN'] = action.authToken;

            return Object.assign({}, state, {
                isLoggedIn: true,
                email: action.email,
                password: action.password,
                authToken: action.authToken,
                roles: action.roles
            });
        case ActionTypes.LOGOUT:
            return Object.assign({}, state, {
                isLoggedIn: false,
                email: '',
                password: '',
                authToken: '',
                roles: []
            });
        default:
            return state;
    }
}