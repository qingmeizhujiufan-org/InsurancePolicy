import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, ImagePicker, WingBlank, WhiteSpace, Picker } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import { assign, find } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

import avator from 'Img/hand-loging.png';

const Item = List.Item;
const Brief = Item.Brief;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            multiple: false,
            user: {},
            companyList: [],
            headimgurl: '',
            fileType: ''
        }
    };

    componentWillMount() {
        this.queryCompanyList();

        this.setState({
            userId: sessionStorage.getItem('userId')
        });
    }

    componentDidMount() {
        this.queryOneUser();
    }

    queryCompanyList = () => {
        const param = {
            pageSize: 1000,
            pageNumber: 1
        };
        axios.get('insuranceCompany/queryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                let backData = data.backData.content || [];
                let companyList = backData.map(item => {
                    return {
                        value: item.id,
                        label: item.companyName
                    }
                })

                this.setState({
                    companyList: companyList,
                });
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    onChange = e => {
        const files = e.target.files;
        console.log('onChange === ', files);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', restUrl.FILE_UPLOAD_HOST + 'file/upload');
        const data = new FormData();

        data.append('file', files[0]);

        xhr.send(data);

        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            console.log('response == ', response);
            this.setState({
                headimgurl: response.id,
                fileType: response.fileType
            });
        });
        xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
        });
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
                    fileType: backData.fileType,
                    headimgurl: backData.headimgurl
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
                const { headimgurl, userId } = this.state;
                Toast.loading('正在提交', 0);
                const values = this.props.form.getFieldsValue();
                values.company = values.company[0];
                const param = assign({}, { id: userId, headimgurl: headimgurl }, values);

                axios.post(`user/update`, param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('提交成功', 2, () => {
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
        const { user, companyList, headimgurl, fileType } = this.state;

        return (
            <DocumentTitle title='个人信息修改'>
                <Layout className="user">
                    <Layout.Content>
                        <WhiteSpace size="lg" />
                        <form>
                            <List>
                                <Item
                                    extra={
                                        <div className="item-img-container">
                                            {
                                                headimgurl
                                                    ? <img className="user-bg" src={restUrl.FILE_ASSET + headimgurl + fileType} alt="" />
                                                    : <img className="user-bg" src={avator} alt="" />
                                            }
                                            <input
                                                type='file'
                                                accept='image/jpeg'
                                                className='upload-user-bg'
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    }
                                    arrow="horizontal"
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
                                <Picker
                                    data={companyList}
                                    cols={1}
                                    onOk={this.onOk}
                                    {...getFieldProps('company', {
                                        initialValue: user.company ? [user.company] : '',
                                        rules: [
                                            { required: true, message: '请输入所属公司' }
                                        ],
                                    })}
                                >
                                    <Item arrow="horizontal">所属公司</Item>
                                </Picker>

                                <WhiteSpace size="lg" />

                                <Item arrow="horizontal" onClick={() => { this.onChangePSD() }}>修改密码</Item>
                            </List>
                            <Button type="primary" onClick={this.onSubmit} style={{ marginTop: '1rem' }}>提交</Button>
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
