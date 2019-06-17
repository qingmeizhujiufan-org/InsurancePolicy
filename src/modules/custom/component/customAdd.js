import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Picker, List, Button, InputItem, Toast, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
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

        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    validateDatePicker = (rule, date, callback) => {
        if (date && date.getMinutes() !== 15) {
            callback();
        } else {
            callback(new Error('15 is invalid'));
        }
    }


    onSubmit = () => {
        this.context.router.push(`/personal`);
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { } = this.state;

        return (
            <DocumentTitle title='新增客户'>
                <Layout className="custom">
                    <Layout.Content>
                        <WhiteSpace size="lg" />
                        <form>
                            <List
                                renderFooter={
                                    () =>
                                        getFieldError('name')
                                        && getFieldError('birth') && getFieldError('telphone') && getFieldError('sex')

                                }
                            >
                                <InputItem
                                    {...getFieldProps('name', {
                                        rules: [
                                            { required: true, message: '请输入客户姓名' }
                                        ]
                                    })}
                                    clear
                                    error={!!getFieldError('name')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('name').join('、'));
                                    }}
                                    placeholder="请输入客户姓名"
                                >客户姓名</InputItem>
                                <DatePicker
                                    {...getFieldProps('birth', {
                                        // initialValue: this.state.dpValue,
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
                                    {...getFieldProps('telphone', {
                                        rules: [
                                            { required: true, message: '请输入电话后四位' },
                                            { validator: this.validatePhone },
                                        ],
                                    })}
                                    clear
                                    error={!!getFieldError('telphone')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('telphone').join('、'));
                                    }}
                                    placeholder="请输入电话后四位"
                                >电话后四位</InputItem>
                                <Picker
                                    data={sexs}
                                    cols={1}
                                    {...getFieldProps('sex', {
                                        initialValue: [1],
                                    })}
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
