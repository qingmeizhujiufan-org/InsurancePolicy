import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Picker, List, Button, InputItem, Toast, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import { assign } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

import classify_1 from 'Img/classify_1.png';

const Item = List.Item;
const Brief = Item.Brief;
const sexs = [{
    label: '男',
    value: 1,
},
{
    label: '女',
    value: 0,
}];

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            custId: null,
            custom: {}
        }
    };

    componentWillMount() {
        this.setState({
            id: this.props.params.id
        });
    }

    componentDidMount() {
        if (this.props.params.custId) {
            this.setState({
                custId: this.props.params.custId
            }, () => {
                this.queryCustDetail(this.props.param.custId)
            });
        }
    }

    validateDatePicker = (rule, date, callback) => {
        if (date && date.getMinutes() !== 15) {
            callback();
        } else {
            callback(new Error('15 is invalid'));
        }
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^[0-9]{4}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                const values = this.props.form.getFieldsValue();
                const param = assign({}, { userId: this.state.id }, values);
                param.customSex = param.customSex[0];
                axios.post('custom/add', param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('添加成功', 1);
                        this.context.router.push(`/custom/list/${this.state.id}`);
                    } else {
                        Toast.fail('添加失败', 2);
                    }
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
        const { custom } = this.state;

        return (
            <DocumentTitle title='新增客户'>
                <Layout className="custom">
                    <Layout.Content>
                        <WhiteSpace size="lg" />
                        <form>
                            <List>
                                <InputItem
                                    {...getFieldProps('customName', {
                                        initialValue: custom.customName,
                                        rules: [
                                            { required: true, message: '请输入客户姓名' }
                                        ]
                                    })}
                                    clear
                                    error={!!getFieldError('customName')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('customName').join('、'));
                                    }}
                                    placeholder="请输入客户姓名"
                                >客户姓名</InputItem>
                                <DatePicker
                                    {...getFieldProps('customBirth', {
                                        initialValue: custom.customBirth,
                                        rules: [
                                            { required: true, message: '请选择客户生日' },
                                            { validator: this.validateDatePicker },
                                        ],
                                    })}
                                    mode="date"
                                    error={!!getFieldError('customBirth')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('customBirth').join('、'));
                                    }}
                                >
                                    <Item arrow="horizontal">客户生日</Item>
                                </DatePicker>
                                <InputItem
                                    {...getFieldProps('customTel', {
                                        initialValue: custom.customTel,
                                        rules: [
                                            { required: true, message: '请输入电话后四位' },
                                            { validator: this.validatePhone },
                                        ],
                                    })}
                                    clear
                                    error={!!getFieldError('customTel')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('customTel').join('、'));
                                    }}
                                    placeholder="请输入电话后四位"
                                >电话后四位</InputItem>
                                <Picker
                                    data={sexs}
                                    cols={1}
                                    {...getFieldProps('customSex', {
                                        initialValue: [custom.customSex || 1],
                                        rules: [
                                            { required: true, message: '请选择客户性别' }
                                        ],
                                    })}
                                    error={!!getFieldError('customSex')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('customSex').join('、'));
                                    }}
                                >
                                    <Item arrow="horizontal">客户性别</Item>
                                </Picker>
                            </List>
                            <WhiteSpace size="lg" />

                            <WhiteSpace size="sm" />
                            <Button type="primary" onClick={this.onSubmit}>提交</Button>
                            <WhiteSpace size="sm" />

                        </form>
                    </Layout.Content>
                </Layout>
            </DocumentTitle >
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}
const CustomAdd = createForm()(Index);

export default CustomAdd;
