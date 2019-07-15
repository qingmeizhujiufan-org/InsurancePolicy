import React from 'react';
import PropTypes from 'prop-types';
import { Modal, List, Icon, Toast, Button, SearchBar, PullToRefresh, Flex, Calendar, Card } from 'antd-mobile';
import { Layout, Empty } from 'zui-mobile';
import localStorage from 'Utils/localStorage'
import moment from 'moment';
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
            beginDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            refreshing: false,
            hasMore: true,
            pageIndex: 1,
            pageSize: 10,
            height: document.documentElement.clientHeight,
            dataSource: [],
            empty: false

        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.get('userId')
        }, () => {
            this.queryOrderList()
        });
    }

    componentDidMount() {
    }

    queryOrderList = () => {
        const { userId, pageSize, pageNumber, pageIndex, keyWords, beginDate, endDate } = this.state;
        const newSize = pageSize * pageIndex;
        const param = {
            userId,
            pageSize: newSize,
            pageNumber,
            keyWords,
            beginDate,
            endDate
        }
        Toast.loading('', 0);

        axios.get('order/queryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                const totalPages = Math.ceil(backData.totalElements / pageSize);
                this.setState({
                    dataSource: backData.content,
                    empty: backData.totalElements === 0,
                    hasMore: pageIndex < totalPages
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
            this.setState({
                refreshing: false
            });
        }).catch(err => {
            this.setState({
                refreshing: false
            });
            Toast.fail('服务异常', 2);
        })
    }

    onRefresh = () => {
        const { hasMore, pageIndex } = this.state;
        let newPageIndex = pageIndex + 1;
        if (!hasMore) {
            return;
        }

        this.setState({
            refreshing: true,
            pageIndex: newPageIndex
        }, () => {
            this.queryOrderList();
        });
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
            pageIndex: 1,
            show: false,
            beginDate,
            endDate
        }, () => {
            this.queryOrderList()
        });
    }

    onSearch = keyWords => {
        this.setState({
            keyWords,
            pageIndex: 1
        }, () => {
            this.queryOrderList();
        });
    }

    onCancel = () => {
        this.setState({
            keyWords: '',
            pageIndex: 1
        }, () => {
            this.queryOrderList();
        });
    }

    onClear = () => {
        this.setState({
            keyWords: '',
            pageIndex: 1
        }, () => {
            this.queryOrderList();
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
                Toast.success('提交成功', 1, () => {
                    this.onClear();
                });
                Toast.success('删除成功', 2);

            } else {
                Toast.fail('删除失败', 2);
            }
        }).catch(() => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const {
            beginDate,
            endDate,
            show,
            dataSource,
            refreshing,
            height,
            hasMore,
            empty
        } = this.state;

        return (
            <DocumentTitle title='我的订单'>
                <Layout className="order">
                    <Layout.Content>
                        <SearchBar
                            placeholder="请输入关键字"
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

                        {
                            empty
                                ? <Empty />
                                :
                                <PullToRefresh
                                    className="order-list"
                                    damping={100}
                                    ref={el => this.ptr = el}
                                    style={{
                                        height: height,
                                        overflow: 'auto',
                                    }}
                                    indicator={{

                                        activate: (
                                            <div className='loader'>
                                                <div className="loader-inner">
                                                    <Icon type="down" /> <span>释放加载</span>
                                                </div>
                                            </div>
                                        ),

                                        deactivate: (
                                            <div className='loader'>
                                                {
                                                    hasMore
                                                        ? <div className="loader-inner">
                                                            <Icon type="up" /> <span>上拉加载</span>
                                                        </div>
                                                        : <div className="loader-inner">
                                                            <span>没有了！</span>
                                                        </div>
                                                }
                                            </div>
                                        ),

                                        release: (
                                            <div className='loader'>
                                                <div className="loader-inner">
                                                    <Icon type="loading" /><span>正在加载</span>
                                                </div>
                                            </div>
                                        ),

                                        finish: (
                                            <div className='loader'>
                                                {
                                                    hasMore
                                                        ? <div className="loader-inner">
                                                            <Icon type="up" /> <span>上拉加载</span>
                                                        </div>
                                                        : <div className="loader-inner">
                                                            <span>没有了！</span>
                                                        </div>
                                                }
                                            </div>
                                        )

                                    }}
                                    direction={'up'}
                                    refreshing={refreshing}
                                    onRefresh={() => { this.onRefresh() }}
                                >
                                    {dataSource.map((obj, index) => (

                                        <Card full className="order-card" key={index} onClick={() => { this.onDetail(obj.id) }}>
                                            <Card.Header
                                                title={
                                                    <div className="order-title">
                                                        <div className="order-id">保单号：{obj.insurancePolicyNo}</div>
                                                    </div>
                                                }
                                                extra={<span style={{ color: '#f61a1a', fontSize: '.28rem' }} onClick={(e) => this.onDeleteComfirm(e, obj.id)}>删除</span>}
                                            />
                                            <Card.Body>
                                                <div className="order-company">产品名称：{obj.insuranceName}</div>

                                                <div className="order-detail">
                                                    <div className="order-detail-item"> 投保人：{obj.policyholderName}</div>
                                                    <div className="order-detail-item"> 投保日期：{obj.insuredTime}</div>
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

                                    ))}

                                </PullToRefresh>
                        }
                    </Layout.Content>
                    <Layout.Footer>
                        <Button type="primary" onClick={this.onAddOrder}>新增订单</Button>
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
