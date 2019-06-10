import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon, Drawer, Radio, Button } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;

const SortItemLeft = ({ className = '', data, ...restProps }) => (
    <div className={`${className} sort-item-left`} {...restProps}>
        <div className="item-sort-num">1</div>
        <div className="item-src">
            <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" />
        </div>
    </div>
);

const SortItemRight = ({ className = '', data, ...restProps }) => (
    <div className={`${className} sort-item-right`} {...restProps}>
        <div className="item-fee-num">7777</div>
        <div className="item-like-num">
            <div>12345</div>
            <Icon type="check" />
        </div>
    </div>
);
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            param1: 0,
            param2: 0
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    showDrawer = () => {
        this.setState({
            open: true
        });
    }

    onChange1 = (value) => {
        this.setState({
            param1: value,
        });
    }


    onChange2 = (value) => {
        this.setState({
            param2: value,
        });
    }

    showHotel = id => {
        this.context.router.push(`/hotel/detail/${id}`);
    }

    showTravel = id => {
        this.context.router.push(`/travel/detail/${id}`);
    }

    userCenter = () => {
        this.context.router.push(`/personal`);
    }

    render() {
        const { open, param1, param2 } = this.state;
        const data1 = [
            { value: 0, label: '月度排行' },
            { value: 1, label: '季度排行' },
            { value: 2, label: '年度排行' },
        ];
        const data2 = [
            { value: 0, label: 'basketball', extra: 'details' },
            { value: 1, label: 'football', extra: 'details' },
        ];
        const sidebar = (
            <div>
                <h3>时间段</h3>
                <List>
                    <div className="sidebar-item">
                        <h3>时间段</h3>
                        {data1.map(i => {
                            let type = param1 === i.value ? 'primary' : 'default';
                            return (
                                <Button
                                    key={i.value}
                                    type={type}
                                    onClick={() => this.onChange1(i.value)}>
                                    {i.label}
                                </Button>)
                        }
                        )}
                    </div>
                    <div className="sidebar-item">
                        <h3>现实条件</h3>
                        {data2.map(i => {
                            let type = param1 === i.value ? 'primary' : 'default';
                            return (
                                <Button
                                    key={i.value}
                                    type={type}
                                    onClick={() => this.onChange1(i.value)}>
                                    {i.label}
                                </Button>)
                        })
                        }
                    </div>
                </List >
            </div>
        );

        return (
            <DocumentTitle title='保险微信平台'>
                <Layout className="home">
                    <Layout.Content>
                        <div className="user-info-container">
                            <WhiteSpace size="lg" />
                            <WingBlank>
                                <Flex justify="center" className="user-info-detail">
                                    <div className="user-logo">
                                        <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" alt="" />
                                    </div>
                                    <div className="user-name">
                                        <div>王玮</div>
                                        <div>阿大大</div>
                                    </div>
                                    <div className="user-btn">新增订单</div>
                                </Flex>
                                <WhiteSpace size="lg" />

                                <Flex justify="center" className="user-info-detail">
                                    <Flex.Item>
                                        <div>1</div>
                                        <div>排名</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div>1</div>
                                        <div>个人保费</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div>1</div>
                                        <div>产品销量</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div>1232323</div>
                                        <div>公司赔偿</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div>123</div>
                                        <div>点赞</div>
                                    </Flex.Item>
                                </Flex>
                            </WingBlank>
                            <WhiteSpace size="lg" />
                        </div>
                        <List>
                            <Item arrow="horizontal" onClick={() => this.showDrawer()}>月排行-个人保费</Item>
                        </List>
                        <WhiteSpace size="lg" />
                        <List>
                            <Item
                                multipleLine
                                thumb={<SortItemLeft />}
                                extra={<SortItemRight />}>
                                Title <Brief>subtitle</Brief>
                            </Item>
                            <Item
                                multipleLine
                                thumb={<SortItemLeft />}
                                extra={<SortItemRight />}>
                                Title <Brief>subtitle</Brief>
                            </Item>
                            <Item
                                multipleLine
                                thumb={<SortItemLeft />}
                                extra={<SortItemRight />}>
                                Title <Brief>subtitle</Brief>
                            </Item>
                        </List>

                    </Layout.Content>
                    <Drawer
                        className="my-drawer"
                        style={{ minHeight: document.documentElement.clientHeight }}
                        position="right"
                        enableDragHandle
                        contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                        sidebar={sidebar}
                        open={open}
                        onOpenChange={this.onOpenChange}
                    >
                    </Drawer>
                </Layout>
            </DocumentTitle >
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
