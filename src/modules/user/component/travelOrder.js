import React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Card, Button, Icon, Toast, Flex} from 'antd-mobile';
import '../index.less';
import {Layout} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";
import {List} from 'Comps';
import axios from "Utils/axios";

const stateList = [{
    title: '待出行',
    state: 0
}, {
    title: '已结束',
    state: 3
}];

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            userId: sessionStorage.userId,
            curState: 0
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    tabChange = (tab) => {
        this.setState({
            params: {
                pageNumber: 1,
                pageSize: 10,
                userId: this.state.userId,
                state: tab.state
            },
            curState: tab.state
        });
    }

    onDetail = id => {
        this.context.router.push(`/travelOrder/detail/${id}`);
    }

    onDelete = (e, id) => {
        e.stopPropagation();
        let param = {};
        param.id = id;
        param.state = 1;
        axios.post('travelKeeper/orderCheck', param).then(res => res.data).then(data => {
            if (data.success) {
                Toast.success('订单取消成功!', 1);
                this.setState({
                    params: {
                        pageNumber: 1,
                        pageSize: 10
                    }
                })
            } else {
                Toast.fail('订单取消失败!', 1);
            }
        })
    }

    render() {
        const {params, userId, curState} = this.state;
        params.userId = userId;
        params.state = curState;

        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            const travel = obj.Travel;
            return (
                <Card
                    key={rowID}
                    className='am-card-full order-card'
                >
                    <Card.Header
                        title={
                            <Flex className='card-head-title'>
                                <span className='iconfont icon-fangjianxinxi'></span>
                                <div>{travel.travelTheme}</div>
                            </Flex>}
                        extra={<span>{obj.state === 0 ? '待出行' : '交易已关闭'}</span>}
                    />
                    <Card.Body>
                        <div className='card-body-title'>{travel.travelTheme}</div>
                        <div className='card-body-middle'>
                            <div>出发<span className="highlight">{travel.travelBeginTime}</span></div>
                            <div>返回<span className="highlight">{travel.travelEndTime}</span></div>
                            <div className="highlight">{travel.travelLastTime}</div>
                        </div>
                        <div className='card-body-desc'>包含：{travel.travelHas}</div>
                        <div className='card-body-footer'>￥<span className='money'>{obj.totalMoney}</span></div>
                    </Card.Body>
                    <Card.Footer
                        // content={'预定时间：' + obj.created_at}
                        extra={
                            <Button
                                size='small'
                                style={{float: 'right', color: '#888'}}
                                onClick={() => this.onDetail(obj.id)}
                            >查看订单</Button>
                        }/>
                </Card>
            );
        }

        return (
            <DocumentTitle title='旅游订单'>
                <Layout className="travel-order">
                    <Layout.Content>
                        <Tabs
                            tabs={stateList}
                            swipeable={false}
                            animated={false}
                            onChange={this.tabChange}
                            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6}/>}
                        >
                            <List
                                pageUrl={'travel/queryOrderList'}
                                params={params}
                                row={row}
                            />
                        </Tabs>
                    </Layout.Content>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
