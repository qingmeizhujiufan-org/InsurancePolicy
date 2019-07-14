import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, WhiteSpace } from 'antd-mobile';
import { Layout, TimeShow } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item;
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputType1: 'password',
            inputType2: 'password',
            code: '',
            isStart: false
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
            telephone,
            type: '4'
        }
        axios.get('user/getCode', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success && data.backData) {
                this.setState({
                    isStart: true
                })
                Toast.success(data.backMsg, 1);
                setTimeout(() => {
                    this.setState({
                        isStart: false
                    })
                }, 60000)
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

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                Toast.loading('正在注册', 0);
                const values = this.props.form.getFieldsValue(['telephone', 'code', 'password']);
                const param = Object.assign({}, values);
                axios.post('user/add', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('注册成功', 1, () => {
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
        const { inputType1, inputType2, code, isStart } = this.state;

        return (
            <DocumentTitle title='用户注册'>
                <Layout className="public">
                    <Layout.Content>
                        <WhiteSpace size="lg" />
                        <form>
                            <List>
                                <InputItem
                                    {...getFieldProps('telephone', {

                                        rules: [
                                            { required: true, message: '请输入用户手机号' },
                                            { validator: this.validatePhone },
                                        ]
                                    })}
                                    clear
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
                                    placeholder="请输入手机验证码"
                                    extra={
                                        isStart
                                            ? <TimeShow time={60} />
                                            : <span className="tip-btn blue" onClick={() => this.getCode()}>获取</span>
                                    }
                                >验证码</InputItem>

                                <WhiteSpace size="lg" />
                                <InputItem
                                    {...getFieldProps('password', {
                                        rules: [
                                            { required: true, message: '请输入密码' }
                                        ]
                                    })}
                                    type={inputType1}
                                    clear
                                    placeholder="请输入新密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(1)}></i>}
                                >密码</InputItem>
                                <InputItem
                                    {...getFieldProps('password2', {
                                        rules: [
                                            { required: true, message: '请输入用户密码' },
                                            { validator: this.validatePassword },
                                        ],
                                    })}
                                    type={inputType2}
                                    clear
                                    placeholder="请再次输入新密码"
                                    extra={<i className="tip-btn iconfont iconchakan" onClick={() => this.showPassword(2)}></i>}
                                >确认密码</InputItem>

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
                                    {...getFieldProps('telephone', {
                                        rules: [
                                            { required: true, message: '请输入用户手机号' }
                                        ]
                                    })}
                                    clear
                                    error={!!getFieldError('telephone')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('telephone').join('、'));
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

                            <Button type="primary" onClick={this.onSubmit} style={{ marginTop: '1rem' }}>注册</Button>
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
const Register = createForm()(Index);

export default Register;
