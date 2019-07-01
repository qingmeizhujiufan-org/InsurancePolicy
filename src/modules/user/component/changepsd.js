import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import { assign } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            inputType1: 'password',
            inputType2: 'password',
            inputType3: 'password',

        }
    };

    componentWillMount() {
        this.setState({
            userId: sessionStorage.getItem('userId')
        });
    }

    componentDidMount() {
    }

    showPassword = (type) => {
        const target = `inputType${type}`;
        const showType = this.state[target];
        console.log(target, showType)

        this.setState({
            [target]: showType === 'password' ? 'text' : 'password'
        });
    }

    validatePassword = (rule, value, callback) => {
        const newPassword = this.props.form.getFieldValue('password');
        if (newPassword && value !== newPassword) {
            callback(new Error('两次密码不一样'));
        } else {
            callback();
        }
    }


    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                const { orderId, userId, type } = this.state;
                Toast.loading('正在提交', 0);
                const values = this.props.form.getFieldsValue(['oldPassword', 'password']);
                const param = assign({}, { id: userId }, values);

                axios.post(`user/changePassword`, param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('提交成功', 1, () => {
                            this.context.router.push(`user/personal`);
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

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { inputType1, inputType2, inputType3 } = this.state;

        return (
            <DocumentTitle title='密码修改'>
                <Layout className="user">
                    <Layout.Content>
                        <form>
                            <List>
                                <WhiteSpace size="lg" />
                                <InputItem
                                    {...getFieldProps('oldPassword', {
                                        rules: [
                                            { required: true, message: '请输入旧密码' }
                                        ]
                                    })}
                                    type={inputType1}
                                    clear
                                    error={!!getFieldError('oldPassword')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('oldPassword').join('、'));
                                    }}
                                    placeholder="请输入旧密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(1)}></i>}
                                >旧密码</InputItem>
                                <WhiteSpace size="lg" />

                                <InputItem
                                    {...getFieldProps('password', {
                                        rules: [
                                            { required: true, message: '请输入新密码' }
                                        ]
                                    })}
                                    type={inputType2}

                                    clear
                                    error={!!getFieldError('password')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('telphone').join('、'));
                                    }}
                                    placeholder="请输入新密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(2)}></i>}
                                >新密码</InputItem>
                                <InputItem
                                    {...getFieldProps('password2', {
                                        rules: [
                                            { required: true, message: '请再次输入新密码' },
                                            { validator: this.validatePassword },
                                        ],
                                    })}
                                    type={inputType3}
                                    clear
                                    error={!!getFieldError('password2')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('password2').join('、'));
                                    }}
                                    placeholder="请再次输入新密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(3)}></i>}

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
