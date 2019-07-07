import React from 'react';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon, Toast, Modal, Radio, Button } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { CardList } from 'Comps';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";
import bgImg from 'Img/bg.png';
import avatar from 'Img/hand-loging.png';

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: sessionStorage.getItem('userId'),
            userInfo: {},
            firstUser: {},
            params: {
                pageNumber: 1,
                pageSize: 10
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
        const { time, condition, params, userId } = this.state;
        this.setState({
            params: {
                ...params,
                time: time.value,
                condition: condition.value,
                userId,
            }
        });
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
        const { tempTime, tempCondition, params, userId } = this.state;
        this.setState({
            time: tempTime,
            condition: tempCondition,
            modalShow: false,
            params: {
                ...params,
                time: tempTime.value,
                condition: tempCondition.value,
                userId,
            }
        })
        setTimeout(() => {
            this.querySumOne(tempTime.value, tempCondition.value);
        }, 0);
    }

    toUserCenter = () => {
        this.context.router.push(`/user/personal`);
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
            if (data.success) {
                const backData = data.backData;
                this.setState({
                    userInfo: backData.user,
                    firstUser: backData.firstUser
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    handleLike = (type, thumbupId) => {
        const { time, condition, params, userId } = this.state;
        console.log(userId, thumbupId);
        if (userId === thumbupId) {
            return;
        }
        Toast.loading('', 0);

        const param = {
            userId,
            thumbupId: thumbupId
        };
        const api = type === 1 ? 'user/like' : 'user/unlike';
        axios.post(api, param).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    params: {
                        ...params,
                        time: time.value,
                        condition: condition.value,
                        userId,
                        key: new Date().getTime()
                    }
                });
                Toast.hide()
            } else {
                Toast.fail(data.backMsg, 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const { modalShow, time, condition, tempTime, tempCondition, params, userInfo, firstUser } = this.state;
        const bgFile = firstUser.bgFile;

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
                <div className="condition-btn" onClick={() => {
                    this.onOk()
                }}>
                    <Icon type="check" />确认
                </div>
                <div className="condition-other-btn" onClick={() => {
                    this.toOuterUrl()
                }}>
                    <Button size="small" className="green-blue-btn" style={{ marginRight: '10px' }}>产品销量榜<Icon
                        type="right" /></Button>
                    <Button size="small" className="green-ghost-btn">公司偿付榜<Icon type="right" /></Button>
                </div>
            </div>
        );

        const SortItem = ({ className = '', data = {}, ...restProps }) => (
            <div className={`${className} list-item`} {...restProps}>
                <div className="sort-item-left">
                    <div className="item-sort-num">{data.index}</div>
                    <div className="item-src">
                        {
                            data.headimgurl
                                ? <img src={restUrl.FILE_ASSET + data.headimgurl + data.fileType} />
                                : <img src={avatar} />
                        }

                    </div>
                    <div className="item-info">
                        <div>{data.realname}</div>
                        <div>{data.companyName}</div>
                    </div>
                </div>
                <div className="sort-item-center">{
                    condition.value === 0
                        ? <div className="item-fee-num">{data.orderSum || 0} <span className='unit'>元</span></div>
                        : <div className="item-fee-num">{data.orderNum || 0} <span className='unit'>件</span></div>
                }
                </div>
                <div className="sort-item-right">
                    {
                        data.thumbup
                            ? <div className="item-like-num" onClick={() => this.handleLike(0, data.id)}>
                                <div>{data.thumbupNum}</div>
                                <div className="iconfont icondianzan-xuanzhong text-red"> </div>
                            </div>
                            : <div className="item-like-num" onClick={() => this.handleLike(1, data.id)}>
                                <div>{data.thumbupNum}</div>
                                <div className="iconfont icondianzan-weixuanzhong"></div>
                            </div>
                    }
                </div>
            </div>
        );

        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;

            obj.index = parseInt(rowID) + 1;
            // if (rowID == 0) {
            //     this.setState({
            //         firstUser: obj
            //     })
            // }

            return (
                <SortItem key={rowID} className="user-sum-item" data={obj}></SortItem>
            );
        };

        return (
            <DocumentTitle title='保联榜'>
                <Layout className={`home${modalShow ? ' mask' : ''}`}>
                    <Layout.Content>
                        <div className="user-info-container">
                            <div className="user-bg">
                                {
                                    bgFile && bgFile.id
                                        ? <img className='user-bg' src={restUrl.FILE_ASSET + bgFile.id + bgFile.fileType} alt="" />
                                        : <img className='user-bg' src={bgImg} alt="" />
                                }

                            </div>
                            <Flex justify="center" className="user-info-detail">
                                <div className="user-logo">
                                    {
                                        firstUser && firstUser.headimgurl
                                            ? <img className='user-bg' src={restUrl.FILE_ASSET + firstUser.headimgurl + firstUser.fileType} alt="" />
                                            : <img className='user-bg' src={avatar} alt="" />
                                    }
                                </div>
                                <div className="user-name">{firstUser.realname} &nbsp;获得了第1名</div>
                                <div className="user-operation">
                                    <div className="user-btn" onClick={() => {
                                        this.onAddOrder()
                                    }}>新增订单
                                        </div>
                                    <div className="user-btn" onClick={() => {
                                        this.showModal()
                                    }}>
                                        <div>{time.label}</div>
                                        <div>—</div>
                                        <div>{condition.label}</div>
                                    </div>
                                </div>
                            </Flex>
                        </div>
                        <SortItem className="user-sum-item" data={userInfo} onClick={() => {
                            this.toUserCenter()
                        }} />
                        <CardList
                            className="user-sum-list"
                            pageUrl={'user/querySumList'}
                            params={params}
                            row={row}
                        />

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
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
