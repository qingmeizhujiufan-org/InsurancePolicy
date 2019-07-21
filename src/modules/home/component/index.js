import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Flex, WhiteSpace, Icon, Toast, Modal, Button, ListView } from 'antd-mobile';
import { Layout, Empty } from 'zui-mobile';
import { assign, isEqual } from 'lodash';
import localStorage from 'Utils/localStorage'
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";
import bgImg from 'Img/bg.png';
import avatar from 'Img/hand-loging.png';

function MyBody(props) {
    return (
        <div className='zui-cardlist-body'>
            {props.children}
        </div>
    );
}

class Index extends React.Component {
    constructor(props) {
        super(props);

        let dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            userId: localStorage.get('userId'),
            userInfo: {},
            firstUser: {},
            params: {
                pageNumber: 1,
                pageSize: 10
            },
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
            dataSource,
            initLoaded: false,
            refreshing: false,
            isLoading: false,
            listData: [],
            pageIndex: 0,
            height: 0
        }
    };

    componentWillMount() {
        const { time, condition, params, userId } = this.state;
        this.setState({
            params: {
                ...params,
                time: time.value,
                condition: condition.value,
                userId
            }
        })
        this.queryLinkDetail();
        this.querySumOne(time.value, condition.value);
        window.addEventListener('resize', this.settingHeight);
    }

    componentDidMount() {
        this.getSumList();
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource } = this.state;
        if (('pageUrl' in nextProps && isEqual(this.props.pageUrl, nextProps.pageUrl) === false)
            || ('params' in nextProps && isEqual(this.props.params, nextProps.params) === false)) {
            this.setState({
                dataSource: dataSource.cloneWithRows({}),
                listData: [],
                refreshing: true,
                isLoading: true,
                pageIndex: 0,
                params: nextProps.params
            },
                () => {
                    ReactDOM.findDOMNode(this.lv).scrollTop = 0;
                    this.getListData(
                        (data) => {
                            if (data.success && data.backData) {
                                const content = data.backData.content ? data.backData.content : [];
                                this.rData = this.genData(content);
                                this.setState({
                                    dataSource: dataSource.cloneWithRows(this.rData),
                                    listData: content,
                                    totalPages: data.backData.totalPages,
                                    hasMore: this.state.pageIndex < data.backData.totalPages - 1
                                });
                            } else {
                                Toast.info(data.backMsg);
                                this.rData = {};
                                this.setState({
                                    dataSource: dataSource.cloneWithRows(this.rData),
                                    listData: [],
                                    totalPages: 0,
                                    hasMore: false
                                });
                            }
                            this.setState({
                                refreshing: false,
                                isLoading: false,
                            });
                        }
                    );
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.settingHeight);
    }

    settingHeight = () => {

        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const _domNode = ReactDOM.findDOMNode(this.lv);
        const clientRect = _domNode.getBoundingClientRect();
        const height = clientHeight - clientRect.top;

        this.setState({ height });
    }

    genData(data) {
        let dataBlob = {};
        for (let i = 0; i < data.length; i++) {
            dataBlob[`${i}`] = data[i];
        }
        return dataBlob;
    }

    onEndReached = event => {
        const { hasMore } = this.state;
        if (!hasMore) {
            return;
        }
        this.setState(
            {
                isLoading: true,
                pageIndex: ++this.state.pageIndex
            }, () => {
                this.getListData(data => {
                    const { listData, pageIndex, totalPages } = this.state;
                    const content = listData.concat(data.backData.content ? data.backData.content : []);
                    this.rData = this.genData(content);
                    let dataSource = this.state.dataSource.cloneWithRows(this.rData);
                    this.setState({
                        dataSource: dataSource,
                        isLoading: false,
                        listData: content,
                        hasMore: pageIndex < totalPages - 1
                    });
                });
            }
        );
    }

    getListData = (callback) => {
        let { params, pageIndex } = this.state;
        params = assign(params, { pageNumber: ++pageIndex });
        axios.get('user/querySumList', { params }).then(res => res.data).then(data => {

            if (typeof callback === 'function')
                callback(data);
        }
        );
    }

    getSumList = () => {
        const { dataSource } = this.state;
        this.settingHeight();
        setTimeout(() => {
            this.setState({
                refreshing: true,
                pageIndex: 0,
                initLoaded: false,
                isLoading: false,
                listData: [],
                dataSource: dataSource.cloneWithRows({}),
            }, () => {
                this.getListData(
                    (data) => {
                        if (data.success && data.backData) {
                            const content = data.backData.content ? data.backData.content : [];
                            let listData = this.genData(content);
                            this.setState({
                                dataSource: dataSource.cloneWithRows(listData),
                                listData: content,
                                totalPages: data.backData.totalPages,
                                hasMore: this.state.pageIndex < data.backData.totalPages - 1
                            });
                        } else {
                            Toast.info(data.backMsg);
                        }
                        this.setState({
                            refreshing: false,
                            initLoaded: true
                        });
                    }
                );
            }
            );
        }, 100);
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
        const { tempTime, tempCondition, params, userId } = this.state;
        this.setState({
            time: tempTime,
            condition: tempCondition,
            modalShow: false,
            params: {
                ...params,
                time: tempTime.value,
                condition: tempCondition.value,
                userId
            }
        }, () => {
            this.querySumOne(tempTime.value, tempCondition.value);
            this.getSumList()
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

    handleLike = (type, data) => {
        const { userId } = this.state;

        const { id } = data;
        if (!userId) {
            this.showAlert({
                info: '请先登录',
                url: '/public/login'
            })
            return;
        }
        if (userId === id) {  // 排除自己点赞自己
            return;
        }


        let param = {
            userId,
            thumbupId: id
        };
        const api = type === 0 ? 'user/unlike' : 'user/like'


        axios.post(api, param).then(res => res.data).then(data => {
            if (data.success) {
                this.setState({
                    params: Object.assign({}, this.state.params, { flag: new Date().getTime() })
                }, () => {
                    this.refreshList(id, data.backData, type)
                })
            } else {
                Toast.fail(data.backMsg, 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }


    refreshList = (id, obj, type) => {
        const { listData, dataSource } = this.state

        const newListData = listData.map((item) => {
            if (item.id === id) {
                const newItem = {
                    ...item,
                    thumbupNum: obj.thumbupNum,
                    thumbup: type ? true : false
                }

                return newItem
            }
            return item
        })

        this.setState({
            dataSource: dataSource.cloneWithRows(newListData),
            listData: newListData
        }, () => { })
    }

    // querySumList = () => {
    //     const { pageIndex, userId, pageSize, time, condition, dataSource } = this.state;
    //     const newSize = pageSize * pageIndex;
    //     const params = {
    //         pageNumber: 1,
    //         pageSize: newSize,
    //         userId,
    //         time: time.value,
    //         condition: condition.value
    //     }

    //     axios.get('user/querySumList', {
    //         params: params
    //     }).then(res => res.data).then(data => {
    //         if (data.success) {
    //             const backData = data.backData;
    //             const totalPages = Math.ceil(backData.totalElements / pageSize);
    //             this.setState({
    //                 dataSource: backData.content,
    //                 hasMore: pageIndex < totalPages
    //             }, () => {
    //             });
    //         } else {
    //             Toast.fail(data.backMsg, 2);
    //         }
    //         this.setState({
    //             refreshing: false
    //         });
    //     }).catch(err => {
    //         this.setState({
    //             refreshing: false
    //         });
    //         Toast.fail('服务异常', 2);
    //     })
    // }

    render() {
        const {
            userId,
            modalShow,
            time,
            condition,
            tempTime,
            tempCondition,
            userInfo,
            firstUser,
            outerLink,
            dataSource,
            initLoaded,
            refreshing,
            isLoading,
            listData
        } = this.state;

        const empty = listData.length === 0;

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
                <div className="condition-other-btn">
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
                            ? <div className="item-like-num" onClick={() => this.handleLike(0, data)}>
                                <div>{data.thumbupNum}</div>
                                <div className="iconfont icondianzan-xuanzhong text-red"></div>
                            </div>
                            : <div className="item-like-num" onClick={() => this.handleLike(1, data)}>
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
            return (
                <SortItem key={rowID} className="user-sum-item" data={obj}></SortItem>
            );
        };


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

                        <ListView
                            ref={el => this.lv = el}
                            dataSource={dataSource}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                                {
                                    empty
                                        ?
                                        <Empty />
                                        :
                                        initLoaded && !refreshing ? (isLoading ? '正在加载...' : '没有了啦~') : null
                                }
                            </div>)}
                            renderBodyComponent={() => <MyBody />}
                            renderRow={row}
                            className="zui-cardlist"
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                            pageSize={4}
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={500}
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
