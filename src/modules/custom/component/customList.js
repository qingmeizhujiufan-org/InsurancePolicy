import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Icon, Button, SearchBar, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { CardList } from 'Comps';
import { assign } from 'lodash';

import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 1,
            params: {
                pageNumber: 1,
                pageSize: 10,
            }
        }
    };

    componentWillMount() {

        this.setState({
            id: 1
        });
    }

    componentDidMount() {
    }

    // queryCustomList = () => {
    //     const { id, params } = this.state;
    //     const param = {
    //         userId: id,
    //         ...params
    //     }
    //     Toast.loading('', 1);

    //     axios.get('custom/queryList', {
    //         params: param
    //     }).then(res => res.data).then(data => {
    //         if (data.backData) {
    //             const backData = data.backData;
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
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onCancel = (keyWords) => {
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onClear = (keyWords) => {
        this.setState({ params: assign({}, this.state.params, { keyWords }) });
    }

    onAdd = () => {
        this.context.router.push({
            pathname: '/custom/add',
            query: {},
        });
    }

    render() {
        const { id, params } = this.state;
        params.userId = id;

        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div
                    className="list-item"
                    key={rowID}
                    onClick={() => this.queryDetail(obj.id)}>
                    <div className="list-item-left">{obj.customName}</div>
                    <div className="list-item-right">
                        <span> {obj.customTel}</span><Icon type="right" />
                    </div>
                </div>
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
                            onCancel={this.onCancel} />
                        <CardList
                            pageUrl={'custom/queryList'}
                            params={params}
                            row={row}
                            multi
                        />
                        <WhiteSpace size="lg" />
                    </Layout.Content>
                    <Layout.Footer>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <Button type="primary" onClick={this.onAdd}>新增客户</Button>
                            <WhiteSpace />
                        </WingBlank>
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
