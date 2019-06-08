import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

import classify_1 from 'Img/classify_1.png';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    onSubmit = id => {
        this.context.router.push(`/${id}`);
    }

    onRetrieve = id => {
        this.context.router.push(`/public/retrievepad`);
    }

    onRegister = () => {
        this.context.router.push(`/public/register`);
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { } = this.state;

        return (
            <DocumentTitle title='登录'>
                <Layout className="login">
                    <WingBlank>
                        <Layout.Content>
                            <div className="login-logo">
                                <div className="login-logo-container">
                                    <img src={classify_1} alt="" />
                                </div>
                            </div>
                            <form>
                                <List
                                    renderFooter={
                                        () =>
                                            getFieldError('telphone')
                                            && getFieldError('password')

                                    }
                                >
                                    <InputItem
                                        {...getFieldProps('telphone', {
                                            rules: [
                                                { required: true, message: '请输入用户手机号' }
                                            ]
                                        })}
                                        clear
                                        error={!!getFieldError('telphone')}
                                        onErrorClick={() => {
                                            Toast.info(getFieldError('telphone').join('、'));
                                        }}
                                        placeholder="请输入注册手机号"
                                    />
                                    <InputItem
                                        {...getFieldProps('password', {
                                            rules: [
                                                { required: true, message: '请输入用户密码' },
                                                { validator: this.validatePhone },
                                            ],
                                        })}
                                        clear
                                        error={!!getFieldError('password')}
                                        onErrorClick={() => {
                                            Toast.info(getFieldError('password').join('、'));
                                        }}
                                        placeholder="请输入注册密码"
                                    />
                                </List>
                            </form>
                        </Layout.Content>
                        <Layout.Footer className='footer'>
                            <div className="tip-btn text-right" onClick={this.onRetrieve}>找回密码</div><WhiteSpace size="lg" />
                            <Button type="primary" onClick={this.onSubmit}>登录</Button><WhiteSpace size="lg" />
                            <Button onClick={this.onRegister}>注册</Button>
                        </Layout.Footer>
                    </WingBlank>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const Login = createForm()(Index);

export default Login;
