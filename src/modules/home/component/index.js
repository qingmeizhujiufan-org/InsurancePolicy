import React from 'react';
import PropTypes from 'prop-types';
import {Flex, Carousel} from 'antd-mobile';
import {Layout} from 'Comps/zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

import classify_1 from 'Img/classify_1.png';
import classify_2 from 'Img/classify_2.png';
import classify_3 from 'Img/classify_3.png';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topSliderList: [],
            foodData: [],
            hotelData: [],
            travelData: []
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
        this.queryTopSliderList();
        /* 获取推荐特色食品 */
        this.queryRecommendFood();
        /* 获取推荐特色民宿 */
        this.queryRecommendHotel();
        /* 获取推荐主题旅游 */
        this.queryRecommendTravel();
    }

    queryTopSliderList = () => {
        axios.get('app/queryTopSliderList').then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    backData.map(item => {
                        if (item.File) {
                            item.imgSrc = restUrl.FILE_ASSET + `${item.File.id + item.File.fileType}`;
                        }
                    });

                    this.setState({
                        topSliderList: backData
                    });
                } else {
                    this.setState({
                        topSliderList: []
                    });
                }
            } else {
            }
        });
    }

    queryRecommendFood = () => {
        axios.get('food/queryListTop3').then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData.content || [];
                    backData.map(item => {
                        if (item.File) {
                            item.imgSrc = restUrl.FILE_ASSET + item.File.id + item.File.fileType;
                        }
                    });

                    this.setState({
                        foodData: backData
                    });
                } else {
                    this.setState({
                        foodData: []
                    });
                }
            } else {
            }
        });
    }

    queryRecommendHotel = () => {
        axios.get('room/queryListTop3').then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData.content || [];
                    backData.map(item => {
                        if (item.File) {
                            item.imgSrc = restUrl.FILE_ASSET + item.File.id + item.File.fileType;
                        }
                    });

                    this.setState({
                        hotelData: backData
                    });
                } else {
                    this.setState({
                        hotelData: []
                    });
                }
            } else {
            }
        });
    }

    queryRecommendTravel = () => {
        axios.get('travel/queryListTop3').then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData.content || [];
                    backData.map(item => {
                        if (item.File) {
                            item.imgSrc = restUrl.FILE_ASSET + item.File.id + item.File.fileType;
                        }
                    });

                    this.setState({
                        travelData: backData
                    });
                } else {
                    this.setState({
                        travelData: []
                    });
                }
            } else {
            }
        });
    }

    showHotel = id => {
        this.context.router.push(`/hotel/detail/${id}`);
    }

    showTravel = id => {
        this.context.router.push(`/travel/detail/${id}`);
    }

    userCenter = () => {
        this.context.router.push(`/personal`);
    }

    render() {
        const {topSliderList, foodData, travelData, hotelData} = this.state;

        return (
            <DocumentTitle title='无介商城'>
                <Layout className="home">
                    <Layout.Content>
                        {topSliderList.length > 0 ? (
                            <Carousel
                                className='carousel-list'
                                autoplay
                                infinite
                            >
                                {topSliderList.map(item => (
                                    <a
                                        key={item.id}
                                        style={{display: 'inline-block', width: '100%', height: '2.42rem'}}
                                        onClick={() => this.context.router.push('food/detail/' + item.foodLink)}
                                    >
                                        <img src={item.imgSrc}/>
                                    </a>
                                ))}
                            </Carousel>
                        ) : (
                            <div style={{height: '2.42rem'}}></div>
                        )}
                        <Flex className='classify-list'>
                            <Flex.Item className='classify-list-item'
                                       onClick={() => this.context.router.push(`/food/index`)}>
                                <div><img src={classify_1}/></div>
                                <span>特色食品</span>
                            </Flex.Item>
                            <Flex.Item className='classify-list-item'
                                       onClick={() => this.context.router.push(`/hotel/index`)}>
                                <div><img src={classify_2}/></div>
                                <span>特色民宿</span>
                            </Flex.Item>
                            <Flex.Item className='classify-list-item'
                                       onClick={() => this.context.router.push(`/travel/index`)}>
                                <div><img src={classify_3}/></div>
                                <span>主题旅游</span>
                            </Flex.Item>
                        </Flex>
                        <div className='goods-category'>
                            <div className='goods-category-title'><i className='iconfont icon-teseshipin'></i></div>
                            <div className='goods-category-body food-content'>
                                {
                                    foodData[0] ? (
                                        <div className='left'
                                             onClick={() => this.context.router.push(`/food/detail/${foodData[0].id}`)}>
                                            <div className='food-name'>{foodData[0].foodName}</div>
                                            <div className='food-text'>{foodData[0].foodSummary}</div>
                                            <div className='food-img'>
                                                <img src={foodData[0].imgSrc} alt=""/>
                                            </div>
                                        </div>
                                    ) : <div className='left'></div>
                                }
                                <div className='right'>
                                    {
                                        foodData[1] ? (
                                            <Flex
                                                direction='column'
                                                justify='center'
                                                align='start'
                                                onClick={() => this.context.router.push(`/food/detail/${foodData[1].id}`)}
                                            >
                                                <div className='food-name'>{foodData[1].foodName}</div>
                                                <div className='food-text'>{foodData[1].foodSummary}</div>
                                                <div className='food-img'>
                                                    <img src={foodData[1].imgSrc} alt=""/>
                                                </div>
                                            </Flex>
                                        ) : <Flex
                                            direction='column'
                                            justify='center'
                                            align='start'
                                        ></Flex>
                                    }
                                    {
                                        foodData[2] ? (
                                            <Flex
                                                direction='column'
                                                justify='center'
                                                align='start'
                                                onClick={() => this.context.router.push(`/food/detail/${foodData[2].id}`)}
                                            >
                                                <div className='food-name'>{foodData[2].foodName}</div>
                                                <div className='food-text'>{foodData[2].foodSummary}</div>
                                                <div className='food-img'>
                                                    <img src={foodData[2].imgSrc} alt=""/>
                                                </div>
                                            </Flex>
                                        ) : <Flex
                                            direction='column'
                                            justify='center'
                                            align='start'
                                        ></Flex>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='goods-category'>
                            <div className='goods-category-title'><i className='iconfont icon-teseminsu'></i></div>
                            <div className='goods-category-body' style={{height: '3.05rem'}}>
                                <Carousel className="hotel"
                                          frameOverflow="visible"
                                          dots={false}
                                          cellSpacing={10}
                                          slideWidth={.6667}
                                          infinite
                                >
                                    {hotelData.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => this.showHotel(item.hotelId)}
                                        >
                                            <div className='hotel-img'>
                                                <img src={item.imgSrc} alt=""/>
                                            </div>
                                            <div className='hotel-name'>{item.roomName}</div>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                        <div className='goods-category'>
                            <div className='goods-category-title'><i className='iconfont icon-zhutilvyou'></i></div>
                            <div className='goods-category-body travel-content'>
                                {
                                    travelData.map((item, index) => {
                                        return (
                                            <div key={index} className='travel-item'
                                                 onClick={() => this.showTravel(item.id)}>
                                                <div className='travel-img'>
                                                    <img src={item.imgSrc} alt=""/>
                                                </div>
                                                <div className='travel-body'>
                                                    <div className='travel-name'>{item.travelTheme}</div>
                                                    <div className='travel-date iconfont icon-calendar'>
                                                        <span><i
                                                            className='iconfont icon-rilikaishi'></i> {item.travelBeginTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='user-center' onClick={this.userCenter}>
                            <span className='iconfont icon-wode'></span>
                            <p>我的</p>
                        </div>
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
