import React from 'react';
import PropTypes from 'prop-types';
import {Carousel, Flex, Toast, Calendar} from 'antd-mobile';
import moment from 'moment';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";
import {Layout, BaseInfo, DatePicker, List} from "Comps/zui-mobile";
import vipDiscount from 'Img/vip_discount.png';
import _assign from "lodash/assign";

const now = new Date();

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            topSliderList: [],
            currentIndex: 0,
            rooms: [],
            rangeDate: {
                beginDate: moment().format('YYYY-MM-DD'),
                endDate: moment().add(1, 'd').format('YYYY-MM-DD'),
                days: 1
            },
            show: false
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
        this.queryDetail();
        this.queryHotelRoom(this.props.params.id);
    }

    componentWillUnmount() {
        clearInterval(this.id);
    }


    onShowCalendar = () => {
        this.setState({show: true});
    }

    onCloseCalendar = () => {
        this.setState({show: false});
    }

    onConfirm = (startDateTime, endDateTime) => {
        console.log('startDateTime == ', startDateTime);
        console.log('endDateTime == ', endDateTime);
        const beginDate = new moment(startDateTime).format('YYYY-MM-DD');
        const endDate = new moment(endDateTime).format('YYYY-MM-DD');
        const days = new moment(endDateTime).diff(new moment(startDateTime).format('YYYY-MM-DD'), 'days');
        this.setState({
            show: false,
            rangeDate: {
                beginDate,
                endDate,
                days: days > 0 ? days : 1
            }
        }, () => {
            this.queryHotelRoom(this.props.params.id);
        });
    }

    queryDetail = () => {
        this.setState({loading: true});
        const param = {
            id: this.props.params.id
        }
        axios.get('hotel/queryDetail', {
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
                message.error('查询列表失败');
            }
            this.setState({loading: false});
        });
    }

    queryHotelRoom = id => {
        const rangeDate = this.state.rangeDate;
        const params = {
            hotelId: id,
            state: 2,
            pageSize: 999,
            beginDate: rangeDate.beginDate,
            endDate: rangeDate.endDate
        };
        axios.get('room/queryMobileList', {params}).then(res => res.data).then(data => {
            console.log('room data ==', data);
            if (data.backData) {
                const content = data.backData;
                content.map(item => {
                    if (item.File) {
                        item.thumbnail = restUrl.FILE_ASSET + `${item.File.id + item.File.fileType}`;
                    }
                })
                this.setState({rooms: content});
            } else {

            }
        });
    }

    // onBeginDateChange = value => {
    //   const {endDate} = this.state;
    //   if (new Date(endDate).getTime() < value.getTime()) {
    //     Toast.info('入住日期不能大于离店日期', 1);
    //     this.setState({
    //       beginDate: new moment(endDate).format('YYYY-MM-DD'),
    //       days: 1
    //     });
    //   } else {
    //     const days = new moment(endDate).diff(new moment(value).format('YYYY-MM-DD'), 'days');
    //     this.setState({
    //       beginDate: new moment(value).format('YYYY-MM-DD'),
    //       days: days > 0 ? days : 1
    //     });
    //   }
    // }
    //
    // onEndDateChange = value => {
    //   const {beginDate} = this.state;
    //   if (new Date(beginDate).getTime() > value.getTime()) {
    //     Toast.info('入住日期不能大于离店日期', 1);
    //     this.setState({endDate: new moment(beginDate).format('YYYY-MM-DD')});
    //   } else {
    //     const days = new moment(value).diff(beginDate, 'days');
    //     this.setState({
    //       endDate: new moment(value).format('YYYY-MM-DD'),
    //       days: days > 0 ? days : 1
    //     });
    //   }
    // }

    showRoomDetail = (id, status) => {
        const {beginDate, endDate, days} = this.state.rangeDate;
        this.context.router.push({
            pathname: '/hotel/room/' + id,
            state: {
                beginDate,
                endDate,
                days,
                status
            }
        });
    }

    render() {
        const {data, topSliderList, currentIndex, rangeDate, show, days, rooms} = this.state;

        return (
            <DocumentTitle title='特色民宿'>
                <Layout className="hotel-detail" withFooter>
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
                        <div className='hotel-base-info'>
                            <Flex justify='between'>
                                <div className='hotel-theme'>{data.hotelName}</div>
                                <div className='vip-discount'><img src={vipDiscount}/></div>
                            </Flex>
                            <Flex className='level'>
                                <div>
                                    {
                                        [0, 1, 2, 3, 4].map((item, index) => {
                                            return (
                                                <span key={index}
                                                      className={`iconfont icon-xingzhuang1 star${index < data.grade ? ' active' : ''}`}></span>
                                            )
                                        })
                                    }
                                    <span>推荐 <span className='num'>{data.grade}</span>分</span>
                                </div>
                            </Flex>
                            <Flex justify='between' align='center'>
                                <p className='address'>
                                    <span className='iconfont icon-xiangqingyemian-weizhi'></span> {data.hotelAddress}
                                </p>
                            </Flex>
                        </div>
                        <Flex justify='between' className='range-date' onClick={this.onShowCalendar}>
                            <div className='range-date-between'>
                                <Flex>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-rilikaishi'></span>
                                        <span>{rangeDate.beginDate}</span>
                                    </Flex>
                                    <div className='separate'>-</div>
                                    <Flex className='wrap-date'>
                                        <span className='iconfont icon-rili'></span>
                                        <span>{rangeDate.endDate}</span>
                                    </Flex>
                                </Flex>
                            </div>
                            <div className='range-date-days'>
                                <span style={{marginRight: '.1rem', fontSize: '.32rem'}}>{rangeDate.days}</span>天
                            </div>
                        </Flex>
                        {/*<List className='count-stay'>*/}
                        {/*<DatePicker*/}
                        {/*mode="date"*/}
                        {/*value={beginDate}*/}
                        {/*onChange={this.onBeginDateChange}*/}
                        {/*>*/}
                        {/*<List.Item arrow="horizontal">请选择入住日期</List.Item>*/}
                        {/*</DatePicker>*/}
                        {/*<DatePicker*/}
                        {/*mode="date"*/}
                        {/*value={endDate}*/}
                        {/*onChange={this.onEndDateChange}*/}
                        {/*>*/}
                        {/*<List.Item arrow="horizontal">请选择离店日期</List.Item>*/}
                        {/*</DatePicker>*/}
                        {/*<List.Item extra={`共 ${days} 天`} arrow="horizontal"*/}
                        {/*className='count-stay-days'>住店天数</List.Item>*/}
                        {/*</List>*/}
                        <div className='hotel-room-list'>
                            {
                                rooms.map((item, index) => {
                                    return (
                                        <div key={index} className='hotel-room-list-item'
                                             onClick={() => this.showRoomDetail(item.id, item.roomStatus)}>
                                            <div className='wrap-thumbnail'>
                                                <img src={item.thumbnail}/>
                                            </div>
                                            <div className='hotel-room-list-item-content'>
                                                <div className='room-title'>{item.roomName}</div>
                                                <p className='desc'>{item.roomSize}平米 {item.bedModel} {item.window}</p>
                                                <p className='rule'>{'不可取消'}</p>
                                                <div className='vip-discount'><img src={vipDiscount}/></div>
                                                {
                                                    item.roomStatus !== 1 ? (
                                                        <div className='sign-button'>预订</div>
                                                    ) : (
                                                        <div className='sign-button disable'>满房</div>
                                                    )
                                                }
                                                <div className='room-price'>¥ <span
                                                    className='price'>{item.roomPrice}</span><span
                                                    className='arrow'> ></span></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Calendar
                            visible={show}
                            onCancel={this.onCloseCalendar}
                            onConfirm={this.onConfirm}
                            defaultDate={now}
                            minDate={new Date(+now)}
                            maxDate={new Date(+now + 604800000)}
                        />
                    </Layout.Content>
                    <Layout.Footer>
                        <Flex className='footer-btn-group'>
                            <a className='call' href={`tel:${data.telephone}`}><i
                                className='iconfont icon-kefu'></i> 拨打咨询电话</a>
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
