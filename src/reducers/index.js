import {combineReducers} from 'redux';
//注册路由组件需要的reducer
import { routerReducer } from 'react-router-redux';

import cardList from './cardList';

/**
 * 将所有State组织成一个状态树来进行维护
 */
export default combineReducers({
    routerReducer,
    cardList
});