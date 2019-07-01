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
            check: false,
            inputType1: 'password',
            inputType2: 'password',
            code: '',
            telephone: ''
        }
    };

    componentWillMount() {
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

    getCode = () => {
        const telephone = this.props.form.getFieldValue('telephone');
        const reg = /^1[3-9]\d{9}$/;
        if (!reg.test(telephone)) {
            Toast.fail('请输入正确的手机号', 1);
            return;
        }
        Toast.loading('正在获取', 0);

        const param = {
            telephone
        }
        axios.get('user/getCode', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success && data.backData) {
                const backData = data.backData;
                this.setState({
                    code: backData.code
                });
                Toast.success(data.backMsg, 1);
            } else {
                Toast.fail(data.backMsg, 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })

    }

    validatePhone = (rule, value, callback) => {
        const reg = /^1[3-9]\d{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    validatePassword = (rule, value, callback) => {
        const password = this.props.form.getFieldValue('password');
        if (password && value !== password) {
            callback(new Error('两次密码不一样'));
        } else {
            callback();
        }
    }

    onNext = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                Toast.loading('', 0);
                const values = this.props.form.getFieldsValue();
                const param = Object.assign({}, values);
                axios.post('user/checkCode', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.hide();
                        this.setState({
                            check: true,
                            telephone: param.telephone
                        })
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

        })
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                Toast.loading('正在找回', 0);
                const values = this.props.form.getFieldsValue(['password']);
                const param = Object.assign({}, { telephone: this.state.telephone }, values);
                axios.post('user/retrievePassword', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('找回成功', 1, () => {
                            this.context.router.push(`/public/login`);
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
        const { check, code, inputType1, inputType2 } = this.state;

        return (
            <DocumentTitle title='找回密码'>
                <Layout className="public">
                    <Layout.Content>
                        {!check ? (
                            <form>
                                <List>
                                    <WhiteSpace size="lg" />
                                    <InputItem
                                        {...getFieldProps('telephone', {
                                            rules: [
                                                { required: true, message: '请输入用户手机号' },
                                                { validator: this.validatePhone },
                                            ]
                                        })}
                                        clear
                                        error={!!getFieldError('telephone')}
                                        onErrorClick={() => {
                                            Toast.info(getFieldError('telephone').join('、'));
                                        }}
                                        placeholder="请输入注册手机号"
                                    >手机号</InputItem>
                                    <InputItem
                                        {...getFieldProps('code', {
                                            initialValue: code,
                                            rules: [
                                                { required: true, message: '请输入验证码' },
                                            ],
                                        })}
                                        clear
                                        error={!!getFieldError('code')}
                                        onErrorClick={() => {
                                            Toast.info(getFieldError('code').join('、'));
                                        }}
                                        placeholder="请输入手机验证码"
                                        extra={
                                            <span className="tip-btn blue" onClick={() => this.getCode()}>获取验证码</span>
                                        }
                                    >验证码</InputItem>
                                </List>
                                <WhiteSpace size="lg" />
                                <WhiteSpace size="lg" />

                                <WingBlank>
                                    <Button type="primary" onClick={this.onNext}>下一步</Button>
                                </WingBlank>
                            </form>
                        ) : (
                                <form>
                                    <List>
                                        <WhiteSpace size="lg" />

                                        <InputItem
                                            {...getFieldProps('password', {
                                                rules: [
                                                    { required: true, message: '请输入密码' }
                                                ]
                                            })}
                                            type={inputType1}
                                            clear
                                            error={!!getFieldError('password')}
                                            onErrorClick={() => {
                                                Toast.info(getFieldError('password').join('、'));
                                            }}
                                            placeholder="请输入新密码"
                                            extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(1)}></i>}
                                        >新密码</InputItem>
                                        <InputItem
                                            {...getFieldProps('password2', {
                                                rules: [
                                                    { required: true, message: '请输入用户密码' },
                                                    { validator: this.validatePassword },
                                                ],
                                            })}
                                            type={inputType2}
                                            clear
                                            error={!!getFieldError('password2')}
                                            onErrorClick={() => {
                                                Toast.info(getFieldError('password2').join('、'));
                                            }}
                                            placeholder="请再次输入新密码"
                                            extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(2)}></i>}
                                        >确认密码</InputItem>
                                    </List>
                                    <WhiteSpace size="lg" />
                                    <WhiteSpace size="lg" />

                                    <WingBlank>
                                        <Button type="primary" onClick={this.onSubmit}>提交</Button>
                                    </WingBlank>
                                </form>
                            )
                        }
                    </Layout.Content>
                </Layout>
            </DocumentTitle >
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const Retrieve = createForm()(Index);

export default Retrieve;
