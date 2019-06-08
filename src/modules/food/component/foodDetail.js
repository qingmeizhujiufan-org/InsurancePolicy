import React from 'react';
import PropTypes from 'prop-types';
import {Carousel, List, Flex, Toast, Modal} from 'antd-mobile';
import {Layout, BaseInfo} from 'Comps/zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";

const Item = List.Item;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.params.id,
            loading: false,
            currentIndex: 0,
            detailData: {},
            topSliderList: [],
            detailPicList: [],
            goodsDetail: {},
            shopDetail: {},
            recommandList: [],
            travelData: []
        }
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.queryDetail();
    }

    queryDetail = () => {
        this.setState({loading: true});
        const param = {
            id: this.props.params.id
        }
        axios.get('food/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const headerPic = backData.headerPic;
                    const detailPic = backData.detailPic;

                    this.queryShopDetail(backData.foodkeeperId);
                    this.queryListByShopId(backData.foodkeeperId);
                    headerPic.map(item => {
                        item.imgSrc = restUrl.FILE_ASSET + `${item.id + item.fileType}`;
                    });

                    detailPic.map(item => {
                        item.imgSrc = restUrl.FILE_ASSET + `${item.id + item.fileType}`;
                    });

                    this.setState({
                        topSliderList: headerPic,
                        currentIndex: 1,
                        detailPicList: detailPic,
                        goodsDetail: backData
                    });
                } else {
                    this.setState({
                        topSliderList: [],
                        detailPicList: []
                    });
                }
            } else {
                Toast.error('查询列表失败');
            }
            this.setState({loading: false});
        });
    }

    queryShopDetail = id => {
        const param = {
            id
        };
        axios.get('foodKeeper/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    let backData = data.backData;
                    if (backData.headerPic && backData.headerPic[0]) {
                        backData.logo = restUrl.FILE_ASSET + `${backData.headerPic[0].id + backData.headerPic[0].fileType}`;
                    }
                    this.setState({
                        shopDetail: backData
                    });
                }
            }
        });
    }

    queryListByShopId = id => {
        const param = {
            foodkeeperId: id,
            state: 2,
            pageSize: 3,
            pageNumber: 1
        };
        axios.get('food/queryList', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    let content = data.backData.content;
                    content.map(item => {
                        item.avatar = restUrl.FILE_ASSET + `${item.File.id + item.File.fileType}`;
                    });
                    this.setState({
                        recommandList: content
                    });
                }
            }
        });
    }

    detail = (id) => {
        this.context.router.push(`/food/detail/${id}`);
    }

    render() {
        const {topSliderList, detailPicList, goodsDetail, shopDetail, recommandList, currentIndex} = this.state;
        return (
            <DocumentTitle title='食品介绍'>
                <div id="goodsDetail">
                    <Layout withFooter>
                        <Layout.Content>
                            <div className='wrap-carousel'>
                                <Carousel
                                    dots={false}
                                    beforeChange={(from, to) => this.setState({currentIndex: to + 1})}
                                >
                                    {topSliderList.map((item, index) => (
                                        <div key={index} className='carousel-item'>
                                            <img
                                                src={item.imgSrc}
                                                alt=""
                                                style={{width: '100%', height: '100%', verticalAlign: 'top'}}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                                <div className='dot'>{currentIndex} / {topSliderList.length}</div>
                            </div>
                            <div className="goods-detail">
                                <div className='goods-header'>
                                    {goodsDetail.isTop ? <div className='is-top'>精品</div> : null}
                                    {goodsDetail.foodName}
                                </div>
                                <Flex justify='between' className='goods-subscribe'>
                                    <div className='goods-price'>
                                        <span>￥ </span><span>{goodsDetail.foodSellingprice}</span></div>
                                </Flex>
                                <div className='goods-vip'>
                                </div>
                            </div>
                            <div className="goods-comments">
                                <List className="my-list">
                                    <Item arrow="horizontal" multipleLine onClick={() => Modal.alert('无介评语', goodsDetail.mark)}
                                    >无介评语</Item>
                                </List>
                            </div>
                            <div className="goods-store">
                                <div className='goods-store-header'>
                                    <div className='goods-store-logo'>
                                        {
                                            shopDetail.logo ?
                                                (
                                                    <img
                                                        src={shopDetail.logo}
                                                        alt=""/>
                                                ) : (
                                                    shopDetail.foodKeeperName && shopDetail.foodKeeperName.slice(0, 2)
                                                )
                                        }
                                    </div>
                                    <div className='goods-store-info'>
                                        <div>{shopDetail.foodKeeperName}</div>
                                        <div className='mark'>{shopDetail.mark}</div>
                                    </div>
                                    <div className='goods-store-into'
                                         onClick={() => this.context.router.push(`/shop/detail/${goodsDetail.foodkeeperId}`)}>
                                        进入店铺
                                    </div>
                                </div>
                                <div className='goods-store-body'>
                                    {
                                        recommandList.map((item, index) => {
                                            return (
                                                <div key={index} className='food-item'
                                                     onClick={() => this.showFood(item.id)}>
                                                    <div className='food-img'>
                                                        <img
                                                            src={item.avatar}
                                                            alt=""/>
                                                    </div>
                                                    <div className='food-body'>
                                                        <div className='food-name'>{item.foodName}</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='sub-title'>食品基本信息</div>
                            <BaseInfo
                                baseInfoList={[
                                    {
                                        label: '生产许可证编号',
                                        value: goodsDetail.foodCode
                                    }, {
                                        label: '厂名',
                                        value: goodsDetail.foodUnit
                                    }, {
                                        label: '产地省份',
                                        value: goodsDetail.foodOrigin
                                    }, {
                                        label: '保质期',
                                        value: goodsDetail.foodDate
                                    }, {
                                        label: '净含量',
                                        value: goodsDetail.foodNetWeight
                                    }, {
                                        label: '成分及配料',
                                        value: goodsDetail.foodBatching
                                    }
                                ]}
                            />
                            <div className="goods-info">
                                <div className='goods-info-pic'>
                                    {detailPicList.map(val => (
                                        <div key={val.id} style={{width: '100%', padding: '10px 15px'}}
                                        >
                                            <img
                                                src={val.imgSrc}
                                                alt=""
                                                style={{width: '100%', height: '100%'}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Layout.Content>
                        <Layout.Footer className='footer'>
                            <a href={goodsDetail.taobaoUrl}>查看购买</a>
                        </Layout.Footer>
                    </Layout>
                </div>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
