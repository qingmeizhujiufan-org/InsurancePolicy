import React from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, Toast } from 'antd-mobile';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import axios from 'axios';
import { Empty } from 'zui-mobile';

import './index.less';

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
            dataSource,
            initLoaded: false,
            refreshing: false,
            isLoading: false,
            listData: [],
            pageIndex: 0,
            params: {},
            height: 0//document.documentElement.clientHeight || document.body.clientHeight
        };
    }

    componentWillMount() {
        this.setState({
            params: this.props.params
        });

        window.addEventListener('resize', this.settingHeight);
    }

    componentDidMount() {
        const { dataSource } = this.state;
        this.settingHeight();
        setTimeout(() => {
            this.setState({
                refreshing: true
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

    onRefresh = () => {
        const { dataSource } = this.state;
        this.setState(
            {
                refreshing: true,
                isLoading: true,
                pageIndex: 0
            },
            () => {
                this.getListData(data => {
                    const content = data.backData.content ? data.backData.content : [];
                    this.rData = this.genData(content);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.rData),
                        refreshing: false,
                        isLoading: false,
                        listData: content,
                        totalPages: data.backData.totalPages,
                        hasMore: this.state.pageIndex < data.backData.totalPages - 1
                    });
                });
            });
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
        axios.get(this.props.pageUrl, { params }).then(res => res.data).then(data => {

            if (typeof callback === 'function')
                callback(data);
        }
        );
    }

    render() {
        const { dataSource, initLoaded, refreshing, isLoading, listData } = this.state;
        const { className, row } = this.props;

        const empty = listData.length === 0;

        return (

            <ListView
                ref={el => this.lv = el}
                dataSource={dataSource}
                renderFooter={() => (<div style={{ padding: '20px 0', textAlign: 'center' }}>
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
                className={`zui-cardlist${className ? ' ' + className : ''}`}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                pageSize={4}
                // pullToRefresh={<PullToRefresh
                //     distanceToRefresh={30}
                //     refreshing={refreshing}
                //     onRefresh={this.onRefresh}
                //     indicator={{
                //         activate: <div className='loader'>
                //             <div className='loader-inner ball-beat'>
                //                 <div></div>
                //                 <div></div>
                //                 <div></div>
                //             </div>
                //         </div>,
                //         deactivate: <div className='loader'>
                //             <div className='loader-inner ball-beat'>
                //                 <div></div>
                //                 <div></div>
                //                 <div></div>
                //             </div>
                //         </div>,
                //         release: <div className='loader'>
                //             <div className='loader-inner ball-beat'>
                //                 <div></div>
                //                 <div></div>
                //                 <div></div>
                //             </div>
                //         </div>,
                //         finish: <span>刷新完成</span>
                //     }}
                // />}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={500}
            />
        );
    }
}

Index.defaultProps = {
    mode: 'block',
};

export default Index;
