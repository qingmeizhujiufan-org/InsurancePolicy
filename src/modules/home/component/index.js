import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
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
            <DocumentTitle title='保险微信平台'>
                <Layout className="home">
                    <Layout.Content>
                        <div className="user-info-container">
                            <WhiteSpace />
                            <WingBlank>
                                <Flex justify="center" className="user-info-detail">
                                    <div className="user-logo"></div>
                                    <div className="user-name">
                                        <div>王玮</div>
                                        <div>阿大大</div>
                                    </div>
                                    <div className="user-btn"></div>
                                </Flex>
                                <WhiteSpace />
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
                            <WhiteSpace />

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
