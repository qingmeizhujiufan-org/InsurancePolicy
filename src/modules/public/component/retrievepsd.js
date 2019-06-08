import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

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


    onSubmit = () => {
        this.context.router.push(`/personal`);
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { } = this.state;

        return (
            <DocumentTitle title='找回密码'>
                <Layout className="public">
                    <Layout.Content>
                        <form>
                            <List
                                renderFooter={
                                    () =>
                                        getFieldError('telphone')
                                        && getFieldError('password')

                                }
                            >
                                <WhiteSpace size="lg" />
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
                                >手机号</InputItem>
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
                                    placeholder="请输入验证码"
                                    extra={<span className="tip-btn">获取验证码</span>}
                                >验证码</InputItem>
                            </List>
                            <WingBlank>
                                <Button type="primary" onClick={this.onSubmit}>提交</Button>
                            </WingBlank>
                        </form>
                    </Layout.Content>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const Retrieve = createForm()(Index);

export default Retrieve;
