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
// sessionStorage.userId = '10c2db90-63ef-11e9-a530-1dc6d07de126';
/* 正式环境测试用户 */
// sessionStorage.userId = 'bdce2c80-6e77-11e9-b23f-cd2cb6481b7f';
if (!sessionStorage.userId) {
    if (code && state === 'STATE') {
        const params = {code};
        axios.get('app/login', {params}).then(res => res.data).then(data => {
            if (data.success) {
                const userinfo = data.backData && data.backData[0];
                sessionStorage.setItem('userId', userinfo.id);
                sessionStorage.setItem('nickname', userinfo.nickname);
                sessionStorage.setItem('headimgurl', userinfo.headimgurl);

                ReactDOM.render(
                    <Router history={hashHistory} routes={routes}/>
                    , window.document.getElementById('main')
                );
            } else {
                alert('登录失败，请退出重试！');
            }
        });
    } else {
        const appid = 'wxdd6ab56296fa5c11';
        const redirect_uri = encodeURIComponent(window.location.href);
        const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        window.location.replace(url);
    }
} else {
    ReactDOM.render(
        <Router history={hashHistory} routes={routes}/>
        , window.document.getElementById('main')
    );
}
