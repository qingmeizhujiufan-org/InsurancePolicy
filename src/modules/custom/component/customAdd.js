import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Picker, List, Button, InputItem, Toast, TextareaItem, WhiteSpace, Icon } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import { assign } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item;

const sexs = [{
    label: '男',
    value: 1,
},
{
    label: '女',
    value: 0,
}];

const now = new Date();

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            custId: null,
            custom: {},
            type: 'add'
        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.getItem('userId')
        });
    }

    componentDidMount() {
        let query = this.props.location.query;
        if (query.custId) {
            this.setState({
                custId: query.custId,
                type: 'update'
            });
            setTimeout(() => {
                this.queryCustDetail()
            }, 0);
        }
    }

    queryCustDetail = id => {
        Toast.loading('正在加载', 0);
        const { userId, custId } = this.state;
        const param = {
            id: custId,
            userId
        }
        axios.get('custom/queryOne', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.backData) {
                const backData = data.backData;
                this.setState({
                    custom: backData
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
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
                const { custId, userId, type } = this.state;
                Toast.loading('正在提交', 0);
                const values = this.props.form.getFieldsValue();
                const param = assign({}, { userId }, values);
                param.customSex = param.customSex[0];
                if (custId) {
                    param.id = custId;
                }

                axios.post(`custom/${type}`, param).then(res => res.data).then(data => {
                    if (data.success) {
                        Toast.success('提交成功', 1, () => {
                            this.context.router.push(`/custom/list`);
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

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { custom, type } = this.state;

        return (
            <DocumentTitle title={type === 'add' ? '新增客户' : '修改客户'}>
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

                                    placeholder="请输入客户姓名"
                                >客户姓名</InputItem>
                                <DatePicker
                                    {...getFieldProps('customBirth', {
                                        initialValue: custom.customBirth ? new Date(custom.customBirth) : '',
                                        rules: [
                                            { required: true, message: '请选择客户生日' },
                                            { validator: this.validateDatePicker },
                                        ],
                                    })}
                                    mode="date"

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

                                    placeholder="请输入电话后四位"
                                >电话后四位</InputItem>
                                <Picker
                                    data={sexs}
                                    cols={1}
                                    {...getFieldProps('customSex', {
                                        initialValue: custom.customSex ? [custom.customSex] : '',
                                        rules: [
                                            { required: true, message: '请选择客户性别' }
                                        ],
                                    })}

                                >
                                    <Item arrow="horizontal">客户性别</Item>
                                </Picker>
                                <TextareaItem
                                    {...getFieldProps('mark', {
                                        initialValue: custom.mark,
                                    })}
                                    placeholder="备注消息"
                                    rows={5}
                                    count={100}
                                />
                            </List>
                            <div className="add-tip"><i className="iconfont iconguanyu" />&nbsp;点击内容即可编辑修改</div>
                            <Button type="primary" onClick={this.onSubmit}>提交</Button>


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
