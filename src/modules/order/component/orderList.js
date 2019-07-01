import React from 'react';
import PropTypes from 'prop-types';
import { List, DatePicker, Toast, Button, SearchBar, WingBlank, WhiteSpace, Flex, Calendar, Card } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import moment from 'moment';
import { assign } from 'lodash';
import { CardList } from 'Comps';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item;
const Brief = Item.Brief;

const now = new Date();
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            show: false,
            beginDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            params: {
                pageNumber: 1,
                pageSize: 10
            },

        }
    };

    componentWillMount() {
        this.setState({
            userId: sessionStorage.getItem('userId')
        });
    }

    componentDidMount() {
    }

    onShowCalendar = () => {
        this.setState({ show: true });
    }

    onCloseCalendar = () => {
        this.setState({ show: false });
    }

    onConfirm = (startDateTime, endDateTime) => {
        console.log('startDateTime == ', startDateTime);
        console.log('endDateTime == ', endDateTime);
        const beginDate = moment(startDateTime).format('YYYY-MM-DD');
        const endDate = moment(endDateTime).format('YYYY-MM-DD');
        this.setState({
            params: assign({}, this.state.params, {
                beginDate,
                endDate,
            }),
            show: false,
            beginDate,
            endDate

        }, () => {

        });
    }

    onSearch = keyWords => {
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onCancel = (keyWords) => {
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onClear = (keyWords) => {
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onAddOrder = () => {
        this.context.router.push({
            pathname: '/order/add',
            query: {},
        });
    }

    onDetail = id => {
        this.context.router.push({
            pathname: '/order/add',
            query: {
                orderId: id
            },
        });
    }

    render() {
        const { beginDate, endDate, show, params, userId } = this.state;
        params.userId = userId;
        params.beginDate = beginDate;
        params.endDate = endDate;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <Card full className="order-card" onClick={() => { this.onDetail(obj.id) }}>
                    <Card.Header
                        title={
                            <div className="order-title">
                                <div className="order-id">保单号：{obj.insurancePolicyNo}</div>
                                <div className="order-company">产品名称：{obj.insuranceName}</div>
                            </div>
                        }
                    />
                    <Card.Body>
                        <div className="order-detail">
                            <div className="order-detail-item"> 投保人：{obj.policyholderName}</div>
                            <div className="order-detail-item"> 投保日期：{obj.insuredTime}</div>
                            <div className="order-detail-item">被保人：{obj.insuredName}</div>
                            <div className="order-detail-item">缴费年限：{obj.paymentDuration} 年</div>
                            <div className="order-detail-item">保费：{obj.insurance} 元</div>
                            <div className="order-detail-item">订单渠道：{obj.orderChannel}</div>
                        </div>
                    </Card.Body>
                    <Card.Footer content={
                        <div className="order-footer">
                            备注：<span>{obj.mark}</span>
                        </div>
                    } />
                </Card>
            );
        };
        return (
            <DocumentTitle title='我的订单'>
                <Layout className="order">
                    <Layout.Content>
                        <SearchBar
                            placeholder="请输入要搜索的商品"
                            maxLength={16}
                            onSubmit={this.onSearch}
                            onClear={this.onClear}
                            onCancel={this.onCancel} />
                        <Flex justify='between' className='range-date' onClick={this.onShowCalendar}>
                            <div className='range-date-between'>
                                <Flex>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-kaishishijian'></span>
                                        <span>始：{beginDate}</span>
                                    </Flex>
                                    <div className='separate'>-</div>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-kaishishijian'></span>
                                        <span>终：{endDate}</span>
                                    </Flex>
                                </Flex>
                            </div>
                        </Flex>

                        <CardList
                            pageUrl={'order/queryList'}
                            params={params}
                            row={row}
                            multi
                        />
                        <WhiteSpace size="lg" />

                    </Layout.Content>
                    <Layout.Footer>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <Button type="primary" onClick={this.onAddOrder}>新增订单</Button>
                            <WhiteSpace size="sm" />
                        </WingBlank>
                    </Layout.Footer>
                    <Calendar
                        visible={show}
                        onCancel={this.onCloseCalendar}
                        onConfirm={this.onConfirm}
                        defaultDate={now}
                        showShortcut={true}
                        defaultValue={[new Date(beginDate), new Date(endDate)]}
                        // minDate={new Date(+now)}
                        maxDate={new Date(+now)}
                    />
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
