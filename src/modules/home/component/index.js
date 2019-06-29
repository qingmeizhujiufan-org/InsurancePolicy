import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon, Modal, Radio, Button } from 'antd-mobile';
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
            userId: null,
            modalShow: false,
            time: {
                value: 0,
                label: '月度排行'
            },
            condition: {
                value: 0,
                label: '累计保费'
            },
            tempTime: {},
            tempCondition: {},
        }
    };

    componentWillMount() {
        this.setState({
            userId: sessionStorage.getItem('userId')
        });
    }

    componentDidMount() {
    }

    /** 
     * 新增订单
     */
    onAddOrder = () => {
        const id = sessionStorage.getItem('userId');
        this.context.router.push(`/order/add/${id}`);
    }

    showModal = () => {
        const { time, condition } = this.state;
        this.setState({
            tempTime: time,
            tempCondition: condition,
            modalShow: true
        })
    }

    onClose = () => {
        const { time, condition } = this.state;
        this.setState({
            modalShow: false
        })
    }

    onChange1 = (value) => {
        this.setState({
            tempTime: value,
        });
    }

    onChange2 = (value) => {
        this.setState({
            tempCondition: value,
        });
    }

    onOk = () => {
        const { tempTime, tempCondition } = this.state;
        this.setState({
            time: tempTime,
            condition: tempCondition,
            modalShow: false
        }, () => {
            this.querySortList(tempTime.value, tempCondition.value);
        })
    }

    toUserCenter = () => {
        this.context.router.push(`/user/personal`);
    }

    onLike = id => {
        this.context.router.push(`/travel/detail/${id}`);
    }

    querySortList = (key1, key2) => {

    }

    render() {
        const { modalShow, time, condition, tempTime, tempCondition } = this.state;
        const times = [
            { value: 0, label: '月度排行' },
            { value: 1, label: '季度排行' },
            { value: 2, label: '年度排行' },
        ];
        const conditions = [
            { value: 0, label: '累计保费' },
            { value: 1, label: '保单数量' },
        ];
        const CutModal = ({ className = '', data, ...restProps }) => (
            <div className="condition-container">
                <div className="condition-title">时间段</div>
                <div className="condition-item">
                    {times.map(i => {
                        let type = tempTime.value === i.value ? 'primary' : 'default';
                        return (
                            <Button
                                key={i.value}
                                type={type}
                                size='small'
                                onClick={() => this.onChange1(i)}>
                                {i.label}
                            </Button>)
                    }
                    )}
                </div>
                <div className="condition-title">显示条件</div>
                <div className="condition-item">
                    {conditions.map(i => {
                        let type = tempCondition.value === i.value ? 'primary' : 'default';
                        return (
                            <Button
                                key={i.value}
                                type={type}
                                size='small'
                                onClick={() => this.onChange2(i)}>
                                {i.label}
                            </Button>)
                    })
                    }
                </div>
                <WhiteSpace size="lg" />
                <div className="condition-btn" onClick={() => { this.onOk() }}>
                    <Icon type="check" />确认
                </div>
                <div className="condition-other-btn" onClick={() => { this.toOuterUrl() }}>
                    <Button size="small" className="green-blue-btn" style={{ marginRight: '10px' }}>产品销量榜<Icon type="right" /></Button>
                    <Button size="small" className="green-ghost-btn">公司偿付榜<Icon type="right" /></Button>
                </div>
            </div>
        );

        return (
            <DocumentTitle title='保联榜'>
                <Layout className="home">
                    <Layout.Content>
                        <div className="user-info-container">
                            <WingBlank>
                                <Flex justify="center" className="user-info-detail">
                                    <div className="user-logo">
                                        <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" alt="" />
                                    </div>
                                    <div className="user-name">王玮获得了第1名</div>
                                    <div className="user-operation">
                                        <div className="user-btn" onClick={() => { this.onAddOrder() }}>新增订单</div>
                                        <div className="user-btn" onClick={() => { this.showModal() }}>
                                            <div>{time.label}</div>
                                            <div>—</div>
                                            <div>{condition.label}</div>
                                        </div>
                                    </div>
                                </Flex>
                            </WingBlank>
                        </div>
                        <List>
                            <Item
                                onClick={() => { this.toUserCenter() }}
                                multipleLine
                                thumb={<SortItemLeft />}
                                extra={<SortItemRight />}>
                                Title <Brief>subtitle</Brief>
                            </Item>
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

                        <Modal
                            className="home-modal"
                            visible={modalShow}
                            transparent
                            maskClosable={true}
                            onClose={() => this.onClose()}
                            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <CutModal />
                        </Modal>

                    </Layout.Content>
                </Layout>
            </DocumentTitle >
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
