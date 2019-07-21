import React from 'react';
import PropTypes from 'prop-types';
import { Modal, List, Icon, Toast, Button, SearchBar, DatePicker, Flex, Calendar, Card } from 'antd-mobile';
import { Layout, Empty } from 'zui-mobile';
import { CardList } from 'Comps';
import localStorage from 'Utils/localStorage'
import moment from 'moment';
import { assign } from 'lodash'
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item;

const now = new Date();
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            show: false,
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            // beginDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
            // endDate: moment().format('YYYY-MM-DD'),
            keyWords: '',
            empty: false

        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.get('userId')
        });
    }

    componentDidMount() {
    }

    // queryOrderList = () => {
    //     const { userId, params, beginDate, endDate } = this.state;

    //     const param = {
    //         userId,
    //         beginDate,
    //         endDate,
    //         ...params
    //     }
    //     Toast.loading('', 0);

    //     axios.get('order/queryList', {
    //         params: param
    //     }).then(res => res.data).then(data => {
    //         if (data.success) {
    //             const backData = data.backData;

    //             this.setState({
    //                 empty: backData.totalElements === 0

    //             });
    //             Toast.hide()
    //         } else {
    //             Toast.fail('查询失败', 2);
    //         }

    //     }).catch(err => {

    //         Toast.fail('服务异常', 2);
    //     })
    // }

    // onShowCalendar = () => {
    //     this.setState({ show: true });
    // }

    // onCloseCalendar = () => {
    //     this.setState({ show: false });
    // }

    // onConfirm = (startDateTime, endDateTime) => {
    //     console.log('startDateTime == ', startDateTime);
    //     console.log('endDateTime == ', endDateTime);
    //     const beginDate = moment(startDateTime).format('YYYY-MM-DD');
    //     const endDate = moment(endDateTime).format('YYYY-MM-DD');
    //     this.setState({
    //         params: assign({}, this.state.params, {
    //             beginDate,
    //             endDate,
    //         }),
    //         show: false,
    //         beginDate,
    //         endDate
    //     });
    // }

    setBeginDate = date => {
        console.log(date)
        this.setState({
            beginDate: moment(date).format('YYYY-MM-DD')
        }, () => {
            this.checkDate()
        })
    }

    setEndDate = date => {
        this.setState({
            endDate: moment(date).format('YYYY-MM-DD')
        }, () => {
            this.checkDate()
        })
    }

    resetBeginDate = () => {
        this.setState({
            beginDate: null
        }, () => {
            this.checkDate()
        })
    }

    resetEndDate = () => {
        this.setState({
            endDate: null
        }, () => {
            this.checkDate()
        })
    }

    checkDate = () => {

        const { beginDate, endDate } = this.state;
        if (beginDate && endDate) {
            const begin = new Date(beginDate).getTime()
            const end = new Date(endDate).getTime()

            if (begin > end) {
                Toast.fail('起始时间不能大于终止时间！', 2)
                return
            }
        }

        this.setState({
            params: assign({}, this.state.params, {
                beginDate,
                endDate
            })
        })
    }

    onSearch = keyWords => {
        this.setState({
            keyWords: keyWords,
            params: assign({}, this.state.params, { keyWords })
        });
    }

    onCancel = () => {
        this.setState({
            keyWords: '',
            params: assign({}, this.state.params, { keyWords: '' })
        });
    }

    onClear = () => {
        this.setState({
            keyWords: '',
            params: assign({}, this.state.params, { keyWords: '' })
        });
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
            }
        });
    }

    onDeleteComfirm = (e, id) => {
        console.log(e)
        e.preventDefault();
        Modal.alert('提示', '是否确定删除?', [
            {
                text: '取消',
                onPress: () => console.log('cancel'), style: 'default'
            },
            {
                text: '确定',
                onPress: () => this.onDelete(id)
            },
        ]);
    }

    onDelete = id => {
        Toast.loading('正在删除', 0);

        axios.post('order/delete', { id }).then(res => res.data).then(data => {
            if (data.success) {

                Toast.success('删除成功', 2, () => {
                    this.setState({
                        params: assign({}, this.state.params, { flag: new Date().getTime() })
                    })
                });

            } else {
                Toast.fail('删除失败', 2);
            }
        }).catch(() => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const { beginDate, endDate, show, params, userId } = this.state;
        params.userId = userId;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <Card full className="order-card" key={rowID}>
                    <Card.Header
                        title={
                            <div className="order-title">
                                <div className="order-id">保单号：{obj.insurancePolicyNo}</div>
                            </div>
                        }
                        extra={<span style={{ color: '#f61a1a', fontSize: '.28rem' }} onClick={(e) => this.onDeleteComfirm(e, obj.id)}>删除</span>}
                    />
                    <Card.Body onClick={() => { this.onDetail(obj.id) }}>
                        <div className="order-company">产品名称：{obj.insuranceName}</div>
                        <div className="order-detail">
                            <div className="order-detail-item"> 投保人：{obj.policyholderName}</div>
                            <div className="order-detail-item"> 生效时间：{obj.insuredTime}</div>
                            <div className="order-detail-item">被保人：{obj.insuredName}</div>
                            <div className="order-detail-item">缴费年限：{obj.paymentDuration} 年</div>
                            <div className="order-detail-item">保费：{obj.insurance} 元</div>
                            <div className="order-detail-item">订单渠道：{obj.channelName}</div>
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
                            placeholder="请输入保单号或保单相关姓名"
                            maxLength={16}
                            onSubmit={this.onSearch}
                            onClear={this.onClear}
                            onCancel={this.onCancel} />
                        <Flex justify='between' className='range-date'>
                            <div className='range-date-between'>

                                <DatePicker
                                    mode="date"
                                    extra="请选择"
                                    format="YYYY-MM-DD"
                                    value={beginDate ? new Date(beginDate) : null}
                                    onOk={date => this.setBeginDate(date)}
                                    onDismiss={() => { this.resetBeginDate() }}
                                >
                                    <List.Item className='wrap-date' extra={beginDate}>始：</List.Item>
                                </DatePicker>
                                <div className='separate'>-</div>
                                <DatePicker
                                    mode="date"
                                    extra="请选择"
                                    format="YYYY-MM-DD"
                                    value={endDate ? new Date(endDate) : null}
                                    onOk={date => this.setEndDate(date)}
                                    onDismiss={() => { this.resetEndDate() }}
                                >
                                    <List.Item className='wrap-date' extra={endDate}>终：</List.Item>
                                </DatePicker>
                            </div>
                        </Flex>
                        <CardList
                            className="order-list"
                            pageUrl={'order/queryList'}
                            params={params}
                            row={row}
                            multi
                        />
                    </Layout.Content>
                    <Layout.Footer>
                        <Button type="primary" onClick={this.onAddOrder}>新增订单</Button>
                    </Layout.Footer>
                    {/* <Calendar
                        visible={show}
                        onCancel={this.onCloseCalendar}
                        onConfirm={this.onConfirm}
                        defaultDate={now}
                        showShortcut={true}
                        defaultValue={[new Date(beginDate), new Date(endDate)]}
                        minDate={new Date(+now)}
                        maxDate={new Date(+now)}
                    /> */}
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
