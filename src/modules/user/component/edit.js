import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

import classify_1 from 'Img/classify_1.png';

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
            <DocumentTitle title='个人信息修改'>
                <Layout className="user">
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
                                <Item
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
                                >所属公司</InputItem>
                                <WhiteSpace size="lg" />

                                <Item arrow="horizontal" onClick={() => { this.onChangePSD }}>修改密码</Item>
                            </List>
                            <WingBlank>
                                <Button type="primary" onClick={this.onSubmit}>提交</Button>
                            </WingBlank>
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
