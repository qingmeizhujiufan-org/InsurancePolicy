import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { List, SwipeAction, Toast, Modal, Icon, Button, SearchBar } from 'antd-mobile';
import { Layout, Empty } from 'zui-mobile';
import { CardList } from 'Comps';
import { assign } from 'lodash'
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
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            empty: false

        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.get('userId')
        });
    }

    componentDidMount() { }

    // queryCustomList = () => {
    //     const { userId, params, keyWords } = this.state;
    //     const param = {
    //         userId,
    //         keyWords,
    //         ...params
    //     }
    //     Toast.loading('', 0);

    //     axios.get('custom/queryList', {
    //         params: param
    //     }).then(res => res.data).then(data => {
    //         if (data.success) {
    //             const backData = data.backData;
    //             this.setState({
    //                 empty: backData.totalElements === 0,
    //             });
    //             Toast.hide()
    //         } else {
    //             Toast.fail('查询失败', 2);
    //         }
    //     }).catch(err => {
    //         Toast.fail('服务异常', 2);
    //     })
    // }

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
            params: assign({}, this.state.params, { keyWords })
        });
    }

    onCancel = () => {
        this.setState({
            params: assign({}, this.state.params, { keyWords: '' })
        });
    }

    onClear = () => {
        this.setState({
            params: assign({}, this.state.params, { keyWords: '' })
        });
    }

    onAdd = () => {
        this.context.router.push({
            pathname: '/custom/add',
            query: {},
        });
    }

    onDeleteComfirm = id => {
        Modal.alert('提示', '是否确定删除?', [
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
                Toast.success('删除成功', 2, () => {
                    this.setState({
                        params: assign({}, this.state.params, { flag: new Date().getTime() })
                    })
                });

            } else {
                Toast.fail('删除失败', 2);
            }
        }).catch(() => {
            Toast.fail('服务异常', 2);
        })
    }

    render() {
        const {
            params,
            userId
        } = this.state;

        params.userId = userId;

        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                        {
                            text: '删除',
                            onPress: () => this.onDeleteComfirm(obj.id),
                            style: { backgroundColor: '#F4333C', color: 'white', width: '1.2rem' },
                        }
                    ]}
                >
                    <div
                        className="list-item"
                        key={rowID}
                        onClick={() => this.queryDetail(obj.id)}>
                        <div className="list-item-left">{obj.customName}</div>
                        <div className="list-item-right">{obj.customTel}</div>
                    </div>
                </SwipeAction>
            );
        };


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

                        <CardList
                            pageUrl={'custom/queryList'}
                            params={params}
                            row={row}
                            multi
                            onCancel={this.onCancel}
                        />
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
