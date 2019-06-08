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
            <DocumentTitle title='密码修改'>
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
                                    placeholder="请输入旧密码"
                                >旧密码</InputItem>
                                <InputItem
                                    {...getFieldProps('telphone', {
                                        rules: [
                                            { required: true, message: '请输入用户手机号' }
                                        ]
                                    })}
                                    type="password"
                                    clear
                                    error={!!getFieldError('telphone')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('telphone').join('、'));
                                    }}
                                    placeholder="请输入新密码"
                                >新密码</InputItem>
                                <InputItem
                                    {...getFieldProps('password', {
                                        rules: [
                                            { required: true, message: '请输入用户密码' },
                                            { validator: this.validatePhone },
                                        ],
                                    })}
                                    type="password"
                                    clear
                                    error={!!getFieldError('password')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('password').join('、'));
                                    }}
                                    placeholder="请再次输入新密码"
                                    extra={<span className="tip-btn" onClick={this.showPSD}>显示</span>}
                                >确认密码</InputItem>
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
const Changepsd = createForm()(Index);

export default Changepsd;
