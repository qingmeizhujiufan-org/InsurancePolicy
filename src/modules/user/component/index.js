import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
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
        const { } = this.state;

        return (
            <DocumentTitle title='个人中心'>
                <Layout className="personal">
                    <Layout.Content>
                        <div className="user-info-container">
                            <WhiteSpace size="lg" />
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
                            <WhiteSpace size="lg" />

                        </div>
                        <div className="user-gird-container">
                            <div className="user-gird">
                                <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" alt="" />
                                <div className="user-gird-text">我的订单</div>
                            </div>
                            <div className="user-gird">
                                <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" alt="" />
                                <div className="user-gird-text">我的客户</div>
                            </div>
                        </div>
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
