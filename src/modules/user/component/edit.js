import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import { assign } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

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
            user: {}
        }
    };

    componentWillMount() {
        this.setState({
            userId: sessionStorage.getItem('userId')
        });
        setTimeout(() => {
            this.queryOneUser()
        }, 0);
    }

    componentDidMount() {
    }

    queryOneUser = () => {
        Toast.loading('正在加载', 0);

        const param = {
            id: this.state.userId
        };

        axios.get('user/queryOneUser', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.backData) {
                const backData = data.backData;
                this.setState({
                    user: backData || {},
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                const { orderId, userId, type } = this.state;
                Toast.loading('正在提交', 0);
                const values = this.props.form.getFieldsValue();
                const param = assign({}, { id: userId }, values);

                axios.post(`user/update`, param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.fail('提交成功', 2, () => {
                            this.context.router.push(`user/personal`);
                        });
                    } else {
                        Toast.fail('提交失败', 2);
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

    onChangePSD = () => {
        this.context.router.push(`user/changepsd`);
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { files, user } = this.state;

        return (
            <DocumentTitle title='个人信息修改'>
                <Layout className="user">
                    <Layout.Content>
                        <form>
                            <List>
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
                                    {...getFieldProps('realname', {
                                        initialValue: user.realname,
                                        rules: [
                                            { required: true, message: '请输入姓名' }
                                        ]
                                    })}
                                    clear
                                    error={!!getFieldError('realname')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('realname').join('、'));
                                    }}
                                    placeholder="请输入"
                                >姓名</InputItem>

                                <InputItem
                                    {...getFieldProps('company', {
                                        initialValue: user.company,
                                        rules: [
                                            { required: true, message: '请输入所属公司' },
                                            { validator: this.validatePhone },
                                        ],
                                    })}
                                    clear
                                    error={!!getFieldError('password')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('password').join('、'));
                                    }}
                                    placeholder="请输入"
                                >所属公司</InputItem>
                                <WhiteSpace size="lg" />

                                <Item arrow="horizontal" onClick={() => { this.onChangePSD() }}>修改密码</Item>
                            </List>
                            <WhiteSpace size="lg" />
                            <WhiteSpace size="lg" />

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
const Register = createForm()(Index);

export default Register;
