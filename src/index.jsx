import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from 'routes/index';
import './index.less';//全局样式
import './assets/css/iconfont.css';
import {getRequest} from "Utils/util";
import axios from "Utils/axios";

const query = getRequest();
const {code, state} = query;

/* 开发环境测试用户 */
sessionStorage.userId = '10c2db90-63ef-11e9-a530-1dc6d07de126';
/* 正式环境测试用户 */
// sessionStorage.userId = 'bdce2c80-6e77-11e9-b23f-cd2cb6481b7f';

ReactDOM.render(
    <Router history={hashHistory} routes={routes}/>
    , window.document.getElementById('main')
);
