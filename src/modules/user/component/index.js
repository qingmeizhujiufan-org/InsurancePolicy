import React from 'react';
import PropTypes from 'prop-types';
import { List, Tabs, Flex, WingBlank, WhiteSpace, Icon, ImagePicker } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
const data = [];

const tabs = [
    { title: '阅读排行', sub: '1' },
    { title: '季度排行', sub: '2' },
    { title: '年度排行', sub: '3' },
];


class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: data,
            sum1: {},
            sum2: {},
            sum: {}
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }

    toEdit = () => {
        this.context.router.push(`/user/edit`);
    }

    toOrderList = () => {
        this.context.router.push(`/order/list`);

    }

    toCustomList = () => {
        this.context.router.push(`/custom/list`);
    }

    render() {
        const { files } = this.state;

        const UserSumItem = ({ className = '', data, ...restProps }) => (
            <div className={`${className} user-sum-item`} {...restProps}>
                <div className="sum-item">
                    <div><span className="sum-info">4343434</span>元</div>
                    <div className="sum-title">累计保费</div>
                </div>
                <div className="sum-item">
                    <div><span className="sum-info">23232</span>件</div>
                    <div className="sum-title">保单数量</div>
                </div>
            </div>
        );

        return (
            <DocumentTitle title='个人中心'>
                <Layout className="personal">
                    <Layout.Content>
                        <div className="user-img-container">
                            <ImagePicker
                                files={files}
                                onChange={this.onChange}
                                selectable={true}
                                disableDelete={true}
                                length={1}
                                multiple={false} />
                        </div>
                        <div className="user-info-container">
                            <WhiteSpace size="lg" />
                            <div className="user-name">
                                张三
                                <Icon
                                    type="check"
                                    style={{ verticalAlign: 'middle', marginLeft: '10px' }}
                                    onClick={() => { this.toEdit() }} />
                            </div>
                            <WhiteSpace size="sm" />
                            <div className="user-company">中国人寿</div>
                            <WhiteSpace size="lg" />
                            <div className="user-logo">
                                <img src="https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg" alt="" />
                            </div>
                        </div>
                        <WhiteSpace size="lg" />
                        <Tabs
                            className="user-tab"
                            tabs={tabs}
                            initialPage={1}
                            renderTab={tab => <span>{tab.title}</span>}
                        >
                            <div className="user-tab-item">
                                <UserSumItem />
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem />
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem />
                            </div>
                        </Tabs>
                        <WhiteSpace size="lg" />

                        <List className="my-list">
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { this.toCustomList() }}>
                                我的客户
                            </Item>
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { this.toOrderList() }}>我的订单
                            </Item>
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { this.toMall() }}>积分商城
                            </Item>
                        </List>

                        <WhiteSpace size="lg" />

                        <List className="my-list">
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { }}>客户咨询
                            </Item>
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { }}>意见反馈
                            </Item>
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { }}>关于保联汇
                            </Item>
                            <Item
                                thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                arrow="horizontal" onClick={() => { }}>Title
                            </Item>
                        </List>
                        <WhiteSpace size="lg" />

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
