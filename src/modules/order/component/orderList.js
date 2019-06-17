import React from 'react';
import PropTypes from 'prop-types';
import { List, DatePicker, Toast, Button, SearchBar, WingBlank, WhiteSpace, Flex, Calendar, Card } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import moment from 'moment';

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
            show: false,
            rangeDate: {
                beginDate: moment().format('YYYY-MM-DD'),
                endDate: moment().add(1, 'd').format('YYYY-MM-DD')
            },
        }
    };

    componentWillMount() {
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
        const beginDate = new moment(startDateTime).format('YYYY-MM-DD');
        const endDate = new moment(endDateTime).format('YYYY-MM-DD');
        this.setState({
            show: false,
            rangeDate: {
                beginDate,
                endDate,

            }
        }, () => {

        });
    }


    onAddOrder = () => {
        const id = '1';
        this.context.router.push(`/order/add/${id}`);
    }

    render() {
        const { rangeDate, show } = this.state;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <List.item key={rowID} onClick={() => this.detail(obj.id)}></List.item>
            );
        };
        return (
            <DocumentTitle title='我的订单'>
                <Layout className="order">
                    <Layout.Content>
                        <SearchBar placeholder="请输入要搜索的商品" maxLength={16} onSubmit={this.onSearch} />
                        <Flex justify='between' className='range-date' onClick={this.onShowCalendar}>
                            <div className='range-date-between'>
                                <Flex>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-kaishishijian'></span>
                                        <span>{rangeDate.beginDate}</span>
                                    </Flex>
                                    <div className='separate'>-</div>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-kaishishijian'></span>
                                        <span>{rangeDate.endDate}</span>
                                    </Flex>
                                </Flex>
                            </div>
                        </Flex>
                        <Card full className="order-card">
                            <Card.Header
                                title={
                                    <div className="order-title">
                                        <div className="order-id">保单号：13123131313</div>
                                        <div className="order-company">产品名称：人寿</div>
                                    </div>
                                }
                            />
                            <Card.Body>
                                <div className="order-detail">
                                    <div className="order-detail-item"> 投保人：李四</div>
                                    <div className="order-detail-item"> 生效日期：2019-06-17</div>
                                    <div className="order-detail-item">被保人：威利斯</div>
                                    <div className="order-detail-item">缴费年限：2年</div>
                                    <div className="order-detail-item">保费：12123元</div>
                                    <div className="order-detail-item">订单渠道：人寿</div>
                                </div>
                            </Card.Body>
                            <Card.Footer content={
                                <div className="order-footer">
                                    备注：<span>dasda</span>
                                </div>
                            } />
                        </Card>
                        {/* <CardList
                            pageUrl={'food/queryList'}
                            params={params}
                            row={row}
                            multi
                        /> */}
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
