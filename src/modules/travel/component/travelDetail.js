import React from 'react';
import PropTypes from 'prop-types';
import {Carousel, Flex, Tabs, Toast} from 'antd-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";
import {Layout, BaseInfo} from "Comps/zui-mobile";
import draftToHtml from 'draftjs-to-html';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            topSliderList: [],
            currentIndex: 0,
            restTimer: '---'
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
        this.queryDetail();
    }

    componentWillUnmount() {
        // clearInterval(this.id);
    }

    queryDetail = () => {
        this.setState({loading: true});
        const param = {
            id: this.props.params.id
        }
        axios.get('travel/queryDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const headerPic = backData.headerPic || [];
                    const detailPic = backData.detailPic || [];

                    headerPic.map(item => {
                        item.imgSrc = restUrl.FILE_ASSET + `${item.id + item.fileType}`;
                    });

                    detailPic.map(item => {
                        item.imgSrc = restUrl.FILE_ASSET + `${item.id + item.fileType}`;
                    });
                    this.setTimer(backData.travelBeginTime);
                    if (backData.expenseDesc && backData.expenseDesc !== '') {
                        backData.expenseDescHtml = draftToHtml(JSON.parse(backData.expenseDesc));
                    }

                    if (backData.lineInfo && backData.lineInfo !== '') {
                        backData.lineInfoHtml = draftToHtml(JSON.parse(backData.lineInfo));
                    }

                    this.setState({
                        topSliderList: headerPic,
                        currentIndex: 1,
                        detailPicList: detailPic,
                        data: backData
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
        }).finally(() => {
            Toast.hide();
        });
    }

    setTimer = time => {
        const that = this;
        const travelBeginTime = time && new Date(time.replace(/-/g, "/").substring(0, 10) + ' 00:00:00').getTime() || new Date().getTime();
        let restTime = travelBeginTime - new Date().getTime();
        timeTicker();

        // this.id = setInterval(timeTicker, 1000);

        function timeTicker() {
            if (restTime > 0) {
                let day = 0,
                    hour = 0,
                    min = '00',
                    s = '00';
                const _s = 1000,
                    _min = 60 * _s,
                    _h = 60 * _min,
                    _d = 24 * _h;
                if (restTime > 0) {
                    day = Math.floor(restTime / _d);
                    hour = Math.floor((restTime - day * _d) / _h);
                    min = Math.floor((restTime - day * _d - hour * _h) / _min);
                    s = Math.floor((restTime - day * _d - hour * _h - min * _min) / _s);

                    const format_time = `${day}天${hour}时${min}分`;
                    that.setState({restTimer: format_time});

                    restTime -= 1000;
                }
            } else {
                // clearInterval(this.id);
                that.setState({restTimer: '已结束'});
            }
        }
    }

    signUp = () => {
        const data = this.state.data;
        this.context.router.push({
            pathname: '/travel/signinfo',
            state: {
                travelId: data.id,
                travelkeeperId: data.travelkeeperId,
                manPrice: data.manPrice,
                childPrice: data.childPrice
            }
        });
    }

    render() {
        const {data, topSliderList, currentIndex, restTimer} = this.state;

        return (
            <DocumentTitle title='主题旅游'>
                <Layout className="travel-detail" withFooter>
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
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            <div className='dot'>{currentIndex} / {topSliderList.length}</div>
                        </div>
                        <div className='sign-up'>
                            <Flex justify='between'>
                                <div
                                    className='sign-info'>报名<span>{data.TravelSigns ? data.TravelSigns.length : '--'}</span>/ {data.travelLimiteNumber || 0}人
                                </div>
                                <div className='rest-time-ticker'>距结束：{restTimer}</div>
                            </Flex>
                        </div>
                        <div className='travel-base-info'>
                            <div className='travel-theme'>{data.travelTheme}</div>
                            <Flex justify='between'>
                                <div className='travel-price'>¥ <span className='price'>{data.manPrice}</span></div>
                                <div className='extra-info'>{data.travelLastTime + ' | 含' + data.travelHas}</div>
                            </Flex>
                        </div>
                        <div className='travel-tabs'>
                            <Tabs
                                tabs={[{title: '行程介绍'}, {title: '行程详情'}, {title: '旅游须知'}]}
                                swipeable={false}
                                onChange={this.tabChange}
                            >
                                <div style={{marginTop: 10}}>
                                    <div className='sub-title'>行程概况</div>
                                    <BaseInfo
                                        baseInfoList={[
                                            {
                                                label: '出发地',
                                                value: data.travelFrom
                                            },
                                            {
                                                label: '目的地',
                                                value: data.travelTo
                                            },
                                            {
                                                label: '旅游用车',
                                                value: data.travelUsecar
                                            },
                                            {
                                                label: '线路玩法',
                                                value: data.linePlay
                                            },
                                            {
                                                label: '游玩时间',
                                                value: data.travelLastTime
                                            },
                                            {
                                                label: '包含元素',
                                                value: data.travelHas
                                            },
                                        ]}
                                    />
                                    <div className='sub-title'>图文介绍</div>
                                    <div className='detail-img-list'>
                                        {
                                            data.detailPic && data.detailPic.map((item, index) => {
                                                return (
                                                    <div key={index} className='detail-img-list-item'><img
                                                        src={restUrl.FILE_ASSET + `${item.id + item.fileType}`}/></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div>
                                    {
                                        (data.TravelDays || []).map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='sub-title'>{item.dayTime}</div>
                                                    <BaseInfo
                                                        baseInfoList={[
                                                            {
                                                                label: '起点',
                                                                value: item.dayFrom
                                                            },
                                                            {
                                                                label: '目的地',
                                                                value: item.dayTo
                                                            },
                                                            {
                                                                label: '当日车程',
                                                                value: item.dayDrive
                                                            },
                                                            {
                                                                label: '住宿',
                                                                value: item.dayStay
                                                            },
                                                            {
                                                                label: '包含用餐',
                                                                value: item.dayDinner
                                                            },
                                                            {
                                                                label: '游玩内容',
                                                                value: item.dayPlay
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className='article'>
                                    <div className='sub-title'>费用说明：</div>
                                    <div className="wrap-html"
                                         dangerouslySetInnerHTML={{__html: data.expenseDescHtml}}></div>
                                    <div className='sub-title'>路线须知：</div>
                                    <div className="wrap-html"
                                         dangerouslySetInnerHTML={{__html: data.lineInfoHtml}}></div>
                                </div>
                            </Tabs>
                        </div>
                    </Layout.Content>
                    <Layout.Footer>
                        <Flex className='footer-btn-group'>
                            <div className='call'><a href={`tel: ${data.telephone}`}><i
                                className='iconfont icon-kefu'></i> 拨打咨询电话</a></div>
                            <div className={`sign${restTimer === '已结束' ? ' disabled' : ''}`}
                                 onClick={restTimer !== '已结束' ? this.signUp : null}>{restTimer !== '已结束' ? '我要报名' : '已结束'}</div>
                        </Flex>
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
