import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon, Toast, Modal, Radio, Button } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { CardList } from 'Comps';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            userInfo: {},
            params: {
                pageNumber: 1,
                pageSize: 10,
                time: 0, // 统计时间
                condition: 0, //统计类型
            },
            firstName: null,
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
        const { time, condition } = this.state;
        this.querySumOne(time.value, condition.value);
    }

    /** 
     * 新增订单
     */
    onAddOrder = () => {
        this.context.router.push(`/order/add`);
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
            modalShow: false,
            params: {
                ...params,
                time: tempTime.value,
                condition: tempCondition.value
            }
        })
        setTimeout(() => {
            this.querySumOne(tempTime.value, tempCondition.value);
        }, 0);
    }

    toUserCenter = () => {
        this.context.router.push(`/user/personal`);
    }

    onLike = id => {
        this.context.router.push(`/travel/detail/${id}`);
    }

    querySumOne = (key1, key2) => {
        Toast.loading('正在加载', 0);
        const { userId } = this.state;
        const param = {
            id: userId,
            time: key1,
            condition: key2
        };
        axios.get('user/querySumOne', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.backData) {
                const backData = data.backData;
                this.setState({
                    userInfo: backData
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const { modalShow, time, condition, tempTime, tempCondition, params, userInfo } = this.state;
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

        const SortItemLeft = ({ className = '', data, ...restProps }) => (
            <div className={`${className} sort-item-left`} {...restProps}>
                <div className="item-sort-num">1</div>
                <div className="item-src">
                    <img src="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" />
                </div>
                <div className="item-info">

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

        const SortItem = ({ className = '', data, ...restProps }) => (
            <div className={`${className} list-item`} {...restProps}>
                <SortItemLeft />
                <SortItemRight />
            </div>
        );

        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <SortItem
                    key={rowID}
                    onClick={() => this.queryDetail(obj.id)}>
                </SortItem>
            );
        };

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
                        {/* <CardList
                            className="user-sum-list"
                            pageUrl={'user/querySumList'}
                            params={params}
                            row={row}
                            multi
                        /> */}

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
