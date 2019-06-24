/*
 *  create by zhongzheng in 2018/11/11.
 */

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Icon } from 'antd-mobile';
import Loadable from 'react-loadable';

function Loading(props) {
    if (props.error) {
        return <div>错误! <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.timedOut) {
        return <div>已经超时加载... <button onClick={props.retry}>点击重试</button></div>;
    } else if (props.pastDelay) {
        return (
            <div style={{
                padding: '30px 0',
                textAlign: 'center'
            }}><Icon type='loading' /></div>
        );
    } else {
        return null;
    }
}

const App = Loadable({
    loader: () => import('../modules/App'),
    loading: Loading
});

/* 首页 */
const Index = Loadable({
    loader: () => import('../modules/home/component/index'),
    loading: Loading
});

/* 订单列表 */
const OrderList = Loadable({
    loader: () => import('../modules/order/component/orderList'),
    loading: Loading
})

/* 添加订单 */
const OrderAdd = Loadable({
    loader: () => import('../modules/order/component/orderAdd'),
    loading: Loading
})

/* 客户列表 */
const CustomList = Loadable({
    loader: () => import('../modules/custom/component/customList'),
    loading: Loading
})

/* 添加客户 */
const CustomAdd = Loadable({
    loader: () => import('../modules/custom/component/customAdd'),
    loading: Loading
})

// 登录
const Login = Loadable({
    loader: () => import('../modules/public/component/login'),
    loading: Loading
})

// 注册
const Register = Loadable({
    loader: () => import('../modules/public/component/register'),
    loading: Loading
})

// 找回密码
const Retrievepsd = Loadable({
    loader: () => import('../modules/public/component/retrievepsd'),
    loading: Loading
})

// 个人中心
const Personal = Loadable({
    loader: () => import('../modules/user/component'),
    loading: Loading
})

// 修改个人信息
const Edit = Loadable({
    loader: () => import('../modules/user/component/edit'),
    loading: Loading
})

// 修改密码
const Changepsd = Loadable({
    loader: () => import('../modules/user/component/changepsd'),
    loading: Loading
})

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="public" component={App}>
            <IndexRoute component={Login} />
            <Route path="login" component={Login} />
            <Route path="register" component={Register} />
            <Route path="retrievepad" component={Retrievepsd} />
        </Route>
        <Route path="order" component={App}>
            <IndexRoute component={OrderList} />
            <Route path="list" component={OrderList} />
            <Route path="add" component={OrderAdd} />
        </Route>
        <Route path="custom" component={App}>
            <IndexRoute component={CustomList} />
            <Route path="list" component={CustomList} />
            <Route path="add" component={CustomAdd} />
        </Route>
        <Route path="user" component={App}>
            <IndexRoute component={Personal} />
            <Route path="personal" component={Personal} />
            <Route path="edit" component={Edit} />
            <Route path="changepsd" component={Changepsd} />
        </Route>
    </Route>
);
