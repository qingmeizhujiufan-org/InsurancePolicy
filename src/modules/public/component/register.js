import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

import classify_1 from 'Img/hand-loging.png';

const Item = List.Item;
const Brief = Item.Brief;
const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121',
}];

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: data,
            multiple: false,
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
        const { files } = this.state;

        return (
            <DocumentTitle title='用户注册'>
                <Layout className="public">
                    <Layout.Content>
                        <WhiteSpace size="lg" />

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
                                    placeholder="请输入手机验证码"
                                    extra={<span className="tip-btn">获取验证码</span>}
                                >验证码</InputItem>

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
                                    placeholder="请输入新密码"
                                >密码</InputItem>
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
                                    placeholder="请再次输入新密码"
                                >确认密码</InputItem>

                                <WhiteSpace size="lg" />

                                {/* <Item
                                    extra={
                                        <ImagePicker
                                            length="1"
                                            files={files}
                                            onChange={this.onChange}
                                            onImageClick={(index, fs) => console.log(index, fs)}
                                            multiple={this.state.multiple}
                                            disableDelete="true"
                                        />
                                    }
                                    onClick={() => this.selectAvtaor}>头像</Item>
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
                                >昵称</InputItem>
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
                                >所属公司</InputItem> */}
                            </List>
                            <WhiteSpace size="sm" />

                            <Button type="primary" onClick={this.onSubmit}>注册</Button>
                            <WhiteSpace size="sm" />
                        </form>
                    </Layout.Content>
                    <WhiteSpace size="lg" />

                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const Register = createForm()(Index);

export default Register;
