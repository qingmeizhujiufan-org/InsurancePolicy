import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Toast, Flex, Modal, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import '../index.less';
import restUrl from "RestUrl";
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import assign from 'lodash/assign';
import {Layout, List, InputItem, BaseInfo, Stepper} from "Comps/zui-mobile";
import moment from 'moment';
import {shiftThousands} from 'Utils/util';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: [0]
        }
    };

    componentDidMount() {
    }

    delParticipant = index => {
        const count = this.state.count;
        count.splice(index, 1);
        this.setState({count});
    }

    addParticipant = () => {
        const values = this.props.form.getFieldsValue();
        const count = this.state.count;
        const num = values.manNum + values.childNum;
        if (num > count.length) {
            count.push(count.length);
            this.setState({count});
        } else {
            Modal.alert('当前人数已达上线');
        }
    }

    signUp = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const {state} = this.props.location;
                const count = this.state.count;
                let {travelId, travelkeeperId, manPrice, childPrice} = state;
                if (count.length !== values.manNum + values.childNum) {
                    Modal.alert('参与人人数不符，请完善信息');
                    return;
                }

                manPrice = parseFloat(manPrice);
                childPrice = parseFloat(childPrice);
                values.travelId = travelId;
                values.travelkeeperId = travelkeeperId;
                values.userId = sessionStorage.userId;
                values.signDate = new moment().format('YYYY-MM-DD');
                values.totalMoney = manPrice * (values.manNum || 1) + childPrice * (values.childNum || 0);
                console.log('values == ', values);
                axios.post('/travel/signTravel', values).then(res => res.data).then(data => {
                    if (data.success) {
                        this.props.form.resetFields();
                        this.setState({count: [0]});
                        Modal.alert('您已报名成功！', '稍后客服人员会联系您，您也可以在我的订单中查询', [
                            {
                                text: '查看订单',
                                onPress: () => {
                                    this.context.router.push('/travelOrder');
                                }
                            }
                        ]);
                    }
                });
            } else {
                Modal.alert('请输入必填项');
            }
        });
    }

    render() {
        const {count} = this.state;
        const {getFieldProps} = this.props.form;
        const values = this.props.form.getFieldsValue();
        const {state} = this.props.location;
        let {manPrice, childPrice} = state;
        manPrice = parseFloat(manPrice);
        childPrice = parseFloat(childPrice);
        const totalMoney = manPrice * (values.manNum || 1) + childPrice * (values.childNum || 0);

        return (
            <DocumentTitle title='报名信息'>
                <Layout className="travel-sign-info" withFooter>
                    <Layout.Content>
                        <Flex className='tip' align='start'>
                            <div className='icon'><span className=''>!</span></div>
                            <div className='text'>
                                <div>自驾游报名须知</div>
                                <ul className='zui-list-unstyled notice-list'>
                                    <li>1、报名后客服会电话联系您。</li>
                                    <li>2、集合地点领队出发前通知。</li>
                                    <li>3、姓名和身份证号用于买保险。</li>
                                    <li>4、车牌号用于排车队号。</li>
                                </ul>
                            </div>
                        </Flex>
                        <List>
                            <List.Item
                                wrap
                                extra={new moment().format('YYYY-MM-DD')}
                            >报名团期</List.Item>
                            <List.Item
                                wrap
                                extra={
                                    <Stepper
                                        min={1}
                                        {...getFieldProps('manNum', {
                                            initialValue: 1
                                        })}
                                    />}
                            >大人<span className='person-price'>{manPrice}/人</span></List.Item>
                            <List.Item
                                wrap
                                extra={
                                    <Stepper
                                        min={0}
                                        {...getFieldProps('childNum', {
                                            initialValue: 0
                                        })}
                                    />}
                            >小孩（1.2米以下）<span className='person-price'>{childPrice}/人</span></List.Item>
                            <InputItem
                                {...getFieldProps('contract', {
                                    rules: [{
                                        required: true, message: '请输入',
                                    }],
                                })}
                                placeholder='（必填）请输入'
                            >联系人</InputItem>
                            <InputItem
                                {...getFieldProps('contractPhone', {
                                    rules: [{
                                        required: true, message: '请输入',
                                    }],
                                })}
                                placeholder='（必填）请输入'
                            >联系人电话</InputItem>
                            <InputItem
                                {...getFieldProps('plateNumber', {
                                    rules: [{
                                        required: true, message: '请输入',
                                    }],
                                })}
                                placeholder='（必填）请输入'
                            >车牌号</InputItem>
                        </List>
                        <List className='participant'>
                            {
                                count.map((item, index) => {
                                    return (
                                        <div key={index} className='participant-item'>
                                            <div style={{
                                                height: 10,
                                                backgroundColor: '#f7f7f7'
                                            }}></div>
                                            <InputItem
                                                {...getFieldProps(`participants[${index}].name`, {
                                                    rules: [{
                                                        required: true, message: '请输入',
                                                    }],
                                                })}
                                                placeholder='（必填）请输入'
                                            >参与人姓名</InputItem>
                                            <InputItem
                                                {...getFieldProps(`participants[${index}].card`, {
                                                    rules: [{
                                                        required: true, message: '请输入',
                                                    }],
                                                })}
                                                placeholder='（必填）请输入'
                                            >身份证号码</InputItem>
                                            <Flex className='btn-group' justify='end'>
                                                {
                                                    index !== 0 ? <span className='del'
                                                                        onClick={() => this.delParticipant(index)}>删除</span> : null
                                                }
                                                <Button
                                                    className='add'
                                                    type="ghost"
                                                    inline
                                                    size="small"
                                                    onClick={this.addParticipant}
                                                >新增</Button>
                                            </Flex>
                                        </div>
                                    )
                                })
                            }
                        </List>
                    </Layout.Content>
                    <Layout.Footer>
                        <Flex className='footer-btn-group'>
                            <div className='total-money'>总金额：<span className='money'>
                                <em className='unit'>¥ </em>{shiftThousands(totalMoney, 2)}</span></div>
                            <div className='post-sign' onClick={this.signUp}>提交报名</div>
                        </Flex>
                    </Layout.Footer>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

const WrapIndex = createForm()(Index);

export default WrapIndex;
