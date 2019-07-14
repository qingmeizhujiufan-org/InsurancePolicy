import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { List, Flex, WingBlank, WhiteSpace, Icon, Toast, Modal, Radio, Button, PullToRefresh } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import localStorage from 'Utils/localStorage'
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";
import bgImg from 'Img/bg.png';
import avatar from 'Img/hand-loging.png';

const Item = List.Item;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: localStorage.get('userId'),
            userInfo: {},
            firstUser: {},
            outerLink: {},
            refreshing: false,
            hasMore: true,
            pageIndex: 1,
            pageSize: 10,
            height: document.documentElement.clientHeight,
            dataSource: [],
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
        const { time, condition } = this.state;
        this.queryLinkDetail();
        this.querySumOne(time.value, condition.value);
        this.querySumList();

    }

    componentDidMount() {
        const { height } = this.state;
        const hei = height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => {
            this.setState({
                height: hei
            });
        }, 0);
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
            pageIndex: 1
        }, () => {
            this.querySumOne(tempTime.value, tempCondition.value);
            this.querySumList();
        })
    }

    toUserCenter = () => {
        this.context.router.push(`/user/personal`);
    }

    queryLinkDetail = () => {
        axios.get('link/queryDetail').then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                this.setState({
                    outerLink: backData
                });
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
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
                    firstUser: backData.firstUser || {}
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    showAlert = ({ info, url }) => {
        Modal.alert('警告', `${info}，是否确定？`, [
            {
                text: '取消', onPress: () => {
                    this.setState({
                        canAdd: false,
                        errMsg: info
                    })
                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    this.context.router.push({
                        pathname: url
                    })
                }
            },
        ]);
    }

    handleLike = (type, thumbupId) => {
        const { userId } = this.state;
        if (!userId) {
            this.showAlert({
                info: '请先登录',
                url: '/public/login'
            })
            return;
        }
        if (userId === thumbupId) {
            return;
        }
        const param = {
            userId,
            thumbupId: thumbupId
        };
        const api = type === 1 ? 'user/like' : 'user/unlike';
        axios.post(api, param).then(res => res.data).then(data => {
            if (data.success) {
                this.querySumList()
            } else {
                Toast.fail(data.backMsg, 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    onRefresh = () => {

        const { hasMore } = this.state;
        let newPageIndex = this.state.pageIndex + 1;
        if (!hasMore) {
            return;
        }

        this.setState({
            refreshing: true,
            pageIndex: newPageIndex
        }, () => {
            this.querySumList();
        });
    }

    querySumList = () => {
        const { pageIndex, userId, pageSize, time, condition, dataSource } = this.state;
        const newSize = pageSize * pageIndex;
        const params = {
            pageNumber: 1,
            pageSize: newSize,
            userId,
            time: time.value,
            condition: condition.value
        }

        axios.get('user/querySumList', {
            params: params
        }).then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                const totalPages = Math.ceil(backData.totalElements / pageSize);
                this.setState({
                    dataSource: backData.content,
                    hasMore: pageIndex < totalPages
                }, () => {
                });
            } else {
                Toast.fail(data.backMsg, 2);
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

    render() {
        const {
            userId,
            modalShow,
            time,
            condition,
            tempTime,
            tempCondition,
            dataSource,
            userInfo,
            firstUser,
            refreshing,
            height,
            hasMore,
            outerLink
        } = this.state;
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
                    <i className="iconfont iconqueding" /> &nbsp;确认
                </div>
                <div className="condition-other-btn" onClick={() => {
                    this.toOuterUrl()
                }}>
                    <Button
                        size="small"
                        className="green-blue-btn"
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            window.location.href = `${outerLink.productSellingUrl}`
                        }}>产品销量榜
                        <Icon
                            type="right"
                        /></Button>
                    <Button
                        size="small"
                        className="green-ghost-btn"
                        onClick={() => {
                            window.location.href = `${outerLink.companyPayUrl}`
                        }}>公司偿付榜<Icon type="right" /></Button>
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
                        {
                            ['realname', 'companyName'].map(item => {
                                return data[item]
                                    ? <div key={item}>{data[item]}</div>
                                    : <div key={item}>未知</div>
                            })
                        }
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
                                <div className="iconfont icondianzan-xuanzhong text-red"></div>
                            </div>
                            : <div className="item-like-num" onClick={() => this.handleLike(1, data.id)}>
                                <div>{data.thumbupNum}</div>
                                <div className="iconfont icondianzan-weixuanzhong"></div>
                            </div>
                    }
                </div>
            </div>
        );

        const UnLogin = ({ className = '', data = {}, ...restProps }) => (
            <div className="login-area">
                <div className="login-area-left">
                    <div className="item-sort-num">0</div>
                    <div className="item-src">
                        <img src={avatar} />
                    </div>
                    <div className="item-info">未登录</div>
                </div>
                <div className="login-area-right" onClick={() => { this.context.router.push('/public/login') }}>
                    <span>去登录</span>
                    <i className="iconfont icongengduo"></i>
                </div>
            </div>
        )

        return (
            <DocumentTitle title='保联榜'>
                <Layout className={`home${modalShow ? ' mask' : ''}`}>
                    <Layout.Content>
                        <div className="user-info-container">
                            <div className="user-bg">
                                {
                                    bgFile && bgFile.id
                                        ?
                                        <img className='user-bg' src={restUrl.FILE_ASSET + bgFile.id + bgFile.fileType}
                                            alt="" />
                                        : <img className='user-bg' src={bgImg} alt="" />
                                }

                            </div>
                            <Flex justify="center" className="user-info-detail">
                                <div className="user-logo">
                                    {
                                        firstUser && firstUser.headimgurl
                                            ? <img className='user-bg'
                                                src={restUrl.FILE_ASSET + firstUser.headimgurl + firstUser.fileType}
                                                alt="" />
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
                        {
                            userId
                                ? <SortItem className="user-sum-item" data={userInfo} onClick={() => {
                                    this.toUserCenter()
                                }} />
                                : <UnLogin />

                        }
                        <WhiteSpace size="lg" />

                        <PullToRefresh
                            className="sum-list"
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
                                        <div className="loader-inner">
                                            <Icon type="up" /><span>上拉加载</span>
                                        </div>
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
                            {dataSource.map((item, index) => (
                                <SortItem key={index}
                                    className="user-sum-item"
                                    data={{
                                        ...item,
                                        index: index + 1
                                    }}>
                                </SortItem>
                            ))}
                        </PullToRefresh>

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
