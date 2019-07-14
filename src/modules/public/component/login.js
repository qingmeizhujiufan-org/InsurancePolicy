import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import classify_1 from 'Img/hand-loging.png';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'password'
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^1[3-9]\d{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                Toast.loading('正在登录', 0);
                const values = this.props.form.getFieldsValue(['oldPassword', 'password']);
                const param = Object.assign({}, values);
                axios.post('user/login', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('登录成功', 1, () => {
                            localStorage.userId = data.backData.id;
                            this.context.router.push(`/index`);
                        });
                    } else {
                        Toast.fail(data.backMsg, 2);
                    }
                }).catch(() => {
                    Toast.fail('服务异常', 2);
                })
            } else {
                let errors = [];
                for (let key in error) {
                    errors.push(error[key].errors[0].message)
                }
                Toast.fail(errors[0], 1);
            }
        });
    }

    onRetrieve = id => {
        this.context.router.push(`/public/retrievepad`);
    }

    onRegister = () => {
        this.context.router.push(`/public/register`);
    }

    showPassword = () => {
        const showType = this.state.type;
        this.setState({
            type: showType === 'password' ? 'text' : 'password'
        });
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { type } = this.state;

        return (
            <DocumentTitle title='登录'>
                <Layout className="login">

                    <Layout.Content>
                        <div className="login-logo">
                            <div className="login-logo-container">
                                <img src={classify_1} alt="" />
                            </div>
                        </div>
                        <form>
                            <List>
                                <InputItem
                                    {...getFieldProps('telphone', {

                                        rules: [
                                            { required: true, message: '请输入用户手机号' },
                                            { validator: this.validatePhone },
                                        ]
                                    })}
                                    clear

                                    placeholder="请输入注册手机号"
                                ><i className="iconfont iconyonghu" /></InputItem>
                                <InputItem
                                    {...getFieldProps('password', {

                                        rules: [
                                            { required: true, message: '请输入用户密码' },
                                        ],
                                    })}
                                    type={type}
                                    clear
                                    placeholder="请输入密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword()}></i>}
                                ><i className="iconfont iconmima" /></InputItem>
                            </List>
                        </form>
                        <div className="tip text-right" onClick={() => this.onRetrieve()}>找回密码？</div>
                        <Button type="primary" onClick={() => this.onSubmit()}>登录</Button>
                        <Button onClick={() => this.onRegister()}>注册</Button>
                    </Layout.Content>
                </Layout>
            </DocumentTitle >
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const Login = createForm()(Index);

export default Login;
