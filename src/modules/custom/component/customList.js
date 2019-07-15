import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { SwipeAction, List, PullToRefresh, Toast, Modal, Icon, Button, SearchBar } from 'antd-mobile';
import { Layout, Empty } from 'zui-mobile';
import localStorage from 'Utils/localStorage'

import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            refreshing: false,
            hasMore: true,
            pageIndex: 1,
            pageSize: 10,
            height: document.documentElement.clientHeight,
            dataSource: [],
            pageNumber: 1,
            pageSize: 10,
            empty: false

        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.get('userId')
        }, () => {
            this.queryCustomList()
        });
    }

    componentDidMount() {
        const { height, empty } = this.state;
        if (empty) {
            return
        }
        const hei = height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => {
            this.setState({
                height: hei
            });
        }, 0);
    }

    queryCustomList = () => {
        const { userId, pageSize, pageNumber, pageIndex, keyWords } = this.state;
        const newSize = pageSize * pageIndex;
        const param = {
            userId,
            pageSize: newSize,
            pageNumber,
            keyWords
        }
        Toast.loading('', 0);

        axios.get('custom/queryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                const totalPages = Math.ceil(backData.totalElements / pageSize);
                this.setState({
                    dataSource: backData.content,
                    empty: backData.totalElements === 0,
                    hasMore: pageIndex < totalPages
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
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

    onRefresh = () => {
        const { hasMore, pageIndex } = this.state;
        let newPageIndex = pageIndex + 1;
        if (!hasMore) {
            return;
        }

        this.setState({
            refreshing: true,
            pageIndex: newPageIndex
        }, () => {
            this.queryCustomList();
        });
    }

    queryDetail = id => {
        this.context.router.push({
            pathname: '/custom/add',
            query: {
                custId: id
            }
        });
    }

    onSearch = keyWords => {
        this.setState({
            keyWords,
            pageIndex: 1
        }, () => {
            this.queryCustomList();
        });
    }

    onCancel = () => {
        this.setState({
            keyWords: '',
            pageIndex: 1
        }, () => {
            this.queryCustomList();
        });
    }

    onClear = () => {
        this.setState({
            keyWords: '',
            pageIndex: 1
        }, () => {
            this.queryCustomList();
        });
    }

    onAdd = () => {
        this.context.router.push({
            pathname: '/custom/add',
            query: {},
        });
    }

    onDeleteComfirm = id => {
        const confirm = Modal.alert('提示', '是否确定删除?', [
            {
                text: '取消',
                onPress: () => console.log('cancel'), style: 'default'
            },
            {
                text: '确定',
                onPress: () => this.onDelete(id)
            },
        ]);
    }

    onDelete = id => {
        Toast.loading('正在删除', 0);

        axios.post('custom/delete', { id }).then(res => res.data).then(data => {
            if (data.success) {
                Toast.success('提交成功', 1, () => {
                    this.onClear();
                });
                Toast.success('删除成功', 2);

            } else {
                Toast.fail('删除失败', 2);
            }
        }).catch(() => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const {
            dataSource,
            refreshing,
            height,
            hasMore,
            empty
        } = this.state;

        return (
            <DocumentTitle title='我的客户'>
                <Layout className="custom">
                    <Layout.Content>
                        <SearchBar
                            placeholder="请输入搜索关键字"
                            maxLength={16}
                            onSubmit={this.onSearch}
                            onClear={this.onClear}
                            onCancel={this.onCancel}
                        />
                        {
                            empty
                                ? <Empty />
                                :
                                <PullToRefresh
                                    className="custom-list"
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
                                        <SwipeAction
                                            key={index}
                                            style={{ backgroundColor: 'gray' }}
                                            autoClose
                                            right={[
                                                {
                                                    text: '删除',
                                                    onPress: () => this.onDeleteComfirm(item.id),
                                                    style: { backgroundColor: '#F4333C', color: 'white', width: '1.2rem' },
                                                }
                                            ]}
                                        >
                                            <div
                                                className="list-item"
                                                key={index}
                                                onClick={() => this.queryDetail(item.id)}>
                                                <div className="list-item-left">{item.customName}</div>
                                                <div className="list-item-right">{item.customTel}</div>
                                            </div>

                                        </SwipeAction>
                                    ))}

                                </PullToRefresh>
                        }

                    </Layout.Content>
                    <Layout.Footer>
                        <Button type="primary" onClick={this.onAdd}>新增客户</Button>
                    </Layout.Footer>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
