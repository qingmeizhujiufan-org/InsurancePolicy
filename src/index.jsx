import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from 'routes/index';
import './index.less';//全局样式
import './assets/css/iconfont.css';
import { getRequest } from "Utils/util";
import axios from "Utils/axios";

const query = getRequest();
const { code, state } = query;

/* 开发环境测试用户 */
// localStorage.userId = '30b13970-0052-11e9-8735-190581b1698d';
/* 正式环境测试用户 */
// localStorage.userId = 'bdce2c80-6e77-11e9-b23f-cd2cb6481b7f';

ReactDOM.render(
    <Router history={hashHistory} routes={routes} />
    , window.document.getElementById('main')
);
