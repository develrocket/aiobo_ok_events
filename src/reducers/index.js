import {combineReducers} from 'redux';
import auth from './auth';
import service from './service';

const rootReducer = combineReducers({
    auth,
    service
});

export default rootReducer;