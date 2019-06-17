import React from 'react';
import PropTypes from 'prop-types';
import { List, InputItem, Toast, Button, SearchBar, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { CardList } from 'Comps';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }


    onAdd = () => {
        const id = '1';
        this.context.router.push(`/custom/add/${id}`);
    }

    render() {
        const { } = this.state;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <List.item key={rowID} onClick={() => this.detail(obj.id)}></List.item>
            );
        };
        return (
            <DocumentTitle title='我的客户'>
                <Layout className="order">
                    <Layout.Content>
                        <SearchBar placeholder="请输入搜索关键字" maxLength={16} onSubmit={this.onSearch} />
                        <List>
                            <List.Item extra="extra content" arrow="horizontal" onClick={() => { }}>Title</List.Item>
                            <List.Item extra="extra content" arrow="horizontal" onClick={() => { }}>Title</List.Item>
                        </List>
                        {/* <CardList
                            pageUrl={'food/queryList'}
                            params={params}
                            row={row}
                            multi
                        /> */}
                        <WhiteSpace size="lg" />

                    </Layout.Content>
                    <Layout.Footer>
                        <WingBlank>
                            <WhiteSpace />
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
