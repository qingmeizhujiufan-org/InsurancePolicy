import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Tabs, Toast, Flex} from 'antd-mobile';
import {SearchBar} from 'Comps/zui-mobile';
import '../index.less';
import restUrl from "RestUrl";
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import _assign from 'lodash/assign';

import {CardList} from 'Comps';

const GoodsCart = ({className = '', data, ...restProps}) => (
    <div className={`${className} goodsCart`} {...restProps}>
        <div className='goodsImg'>
            <img src={data.File ? (restUrl.FILE_ASSET + data.File.id + data.File.fileType) : ''} alt=""/>
        </div>
        <div className='goodsBody'>
            <div className='goodsHeader'>
                {data.isTop ? <div className='isTop'>精品</div> : null}
                {data.foodName}
            </div>
            <Flex justify='between' className='goodsContent'>
                <div className='goodsLabel'>【{data.keeperName}】</div>
                <div className='goodsAddress'>{data.foodOrigin}</div>
            </Flex>
            <div className='goodsFooter'>
                <div><span>￥</span><span style={{fontSize: '.3rem'}}>{data.foodSellingprice}</span></div>
            </div>
        </div>
    </div>
);

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            params: {
                pageNumber: 1,
                pageSize: 10,
                state: 2,
                foodCategoryId: null
            },
            keyWords: '',
            categoryList: [{
                foodCategoryId: null,
                title: '全部'
            }],
            goodsList: []
        }
    };

    componentDidMount() {
        this.queryFoodsCategory();
    }

    queryFoodsCategory = () => {
        const {categoryList} = this.state;
        axios.get('food/queryAllCategoryList')
            .then(res => res.data).then(data => {
            if (data.success) {
                let list = data.backData.map(item => {
                    return {
                        foodCategoryId: item.id,
                        title: item.foodCategoryName
                    }
                })
                this.setState({
                    categoryList: categoryList.concat(list)
                })
            } else {
                Toast.fail(data.backMsg);
            }
        });
    }

    onSearch = keyWords => {
        this.setState({params: _assign({}, this.state.params, {keyWords})});
    }

    tabChange = (tab, index) => {
        this.setState({params: _assign({}, this.state.params, {foodCategoryId: tab.foodCategoryId})});
    }

    detail = (id) => {
        this.context.router.push(`/food/detail/${id}`);
    }

    render() {
        const {categoryList, params} = this.state;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;

            return (
                <div key={rowID} style={{float: 'left', width: '50%'}}>
                    <GoodsCart key={obj.id} data={obj} onClick={() => this.detail(obj.id)}/>
                </div>
            );
        }

        return (
            <DocumentTitle title='特色食品'>
                <div className="food">
                    <div className="zui-content">
                        <SearchBar placeholder="请输入要搜索的商品" maxLength={16} onSubmit={this.onSearch}/>
                        <Tabs
                            tabs={categoryList}
                            swipeable={false}
                            animated={false}
                            onChange={this.tabChange}
                            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6}/>}
                        >
                            <CardList
                                pageUrl={'food/queryList'}
                                params={params}
                                row={row}
                                multi
                            />
                        </Tabs>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
