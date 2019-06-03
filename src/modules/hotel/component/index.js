import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Toast, Flex} from 'antd-mobile';
import {SearchBar} from 'Comps/zui-mobile';
import '../index.less';
import restUrl from "RestUrl";
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import assign from 'lodash/assign';
import vipDiscount from 'Img/vip_discount.png';

import {List} from 'Comps';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            goodsList: [],
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            keyWords: ''
        }
    };

    componentDidMount() {
    }

    detail = (id) => {
        this.context.router.push(`/hotel/detail/${id}`);
    }

    search = value => {
        const params = this.state.params;
        this.setState({
            keyWords: value,
            params: {
                ...params,
                keyWords: value.trim()
            }
        });
    }

    render() {
        const {params, keyWords} = this.state;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;

            return (
                <div
                    key={rowID}
                    className='zui-list-table-cell'
                    onClick={() => this.detail(obj.id)}
                >
                    <div className='hotel-item'>
                        <div className='wrap-thumbnail'>
                            <img src={obj.File ? (restUrl.FILE_ASSET + obj.File.id + obj.File.fileType) : ''}/>
                            <div className='hotel-from'>{obj.hotelTypeText}</div>
                        </div>
                        <div className='hotel-item-content'>
                            <div className='hotel-item-content-title'>{obj.hotelName}</div>
                            <div className='hotel-item-content-body'>
                                <div className='level'>
                                    {
                                        [0, 1, 2, 3, 4].map((item, index) => {
                                            return (
                                                <span key={index}
                                                      className={`iconfont icon-xingzhuang1 star${index < obj.grade ? ' active' : ''}`}></span>
                                            )
                                        })
                                    }
                                    <span>推荐 <span className='num'>{obj.grade}</span>分</span>
                                </div>
                                <p className='address'>
                                    <span className='iconfont icon-xiangqingyemian-weizhi'></span> {obj.hotelAddress}
                                </p>
                            </div>
                            <div className='hotel-item-content-footer'>
                                <img className='vip-discount' src={vipDiscount}/>
                                <div className='sign-price'>￥ <span className='price'>{obj.initialCharge}</span>
                                    <span className='extra'> 起</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <DocumentTitle title='特色民宿'>
                <div className="hotel">
                    <div className="zui-content">
                        <SearchBar
                            placeholder="请输入要搜索的民宿"
                            onSubmit={this.search}
                        />
                        <List
                            pageUrl={'hotel/queryMobileList'}
                            params={params}
                            row={row}
                        />
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
