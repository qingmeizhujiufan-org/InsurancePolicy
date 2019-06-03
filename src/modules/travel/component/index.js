import React from 'react';
import PropTypes from 'prop-types';
import {Flex, Calendar} from 'antd-mobile';
import '../index.less';
import restUrl from "RestUrl";
import DocumentTitle from "react-document-title";
import _assign from 'lodash/assign';
import moment from 'moment';

import {List} from 'Comps';

const now = new Date();

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            params: {
                pageNumber: 1,
                pageSize: 10,
                state: 2
            },
            goodsList: [],
            rangeDate: {
                beginDate: '开始日期',
                endDate: '结束日期',
                days: 0
            },
            show: false
        }
    };

    componentDidMount() {
    }

    detail = (id) => {
        this.context.router.push(`/travel/detail/${id}`);
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
            },
            params: _assign({}, this.state.params, {
                travelBeginTime: beginDate,
                travelEndTime: endDate
            })
        });
    }

    render() {
        const {params, rangeDate, show} = this.state;
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            let travelBeginTime = obj.travelBeginTime && new Date(obj.travelBeginTime.replace(/-/g, "/").substring(0, 10) + ' 00:00:00').getTime() || new Date().getTime();
            let restTime = travelBeginTime - new Date().getTime();
            let day = 0, hour = 0;
            if (restTime > 0) {
                day = Math.floor(restTime / (3600 * 1000 * 24));
                hour = Math.floor((restTime - (day * 3600 * 1000 * 24)) / (3600 * 1000));
            }

            return (
                <div
                    key={rowID}
                    className='zui-list-table-cell'
                    onClick={() => this.detail(obj.id)}
                >
                    <div className='travel-item'>
                        <div className='wrap-thumbnail'>
                            <img src={obj.File ? (restUrl.FILE_ASSET + obj.File.id + obj.File.fileType) : ''}/>
                            <div className='travel-from'>{obj.travelFrom}出发</div>
                        </div>
                        <div className='travel-item-content'>
                            <div className='travel-item-content-title'>{obj.travelTheme}</div>
                            <div className='travel-item-content-body'>
                                <Flex justify='between'>
                                    <div className='base-info'>{obj.travelLastTime + ' | 含' + obj.travelHas}</div>
                                    <div className='sign-info'>报名 <span
                                        className='num'>{obj.TravelSigns.length}</span> /{obj.travelLimiteNumber}人
                                    </div>
                                </Flex>
                            </div>
                            <div className='travel-item-content-footer'>
                                <Flex justify='between'>
                                    <div className='rest-sign-time'>
                                        {
                                            day === 0 && hour === 0 ? (
                                                <span className='end'>报名已截止</span>
                                            ) : (
                                                <span>
                                                    <span className='rest-time'>{day}天{hour}小时</span> 报名结束</span>
                                            )
                                        }
                                    </div>
                                    <div className='sign-price'>￥ <span className='price'>{obj.manPrice}</span></div>
                                </Flex>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <DocumentTitle title='主题旅游'>
                <div className="travel">
                    <div className="zui-content">
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
                        <List
                            pageUrl={'travel/queryList'}
                            params={params}
                            row={row}
                        />
                    </div>
                    <Calendar
                        visible={show}
                        onCancel={this.onCloseCalendar}
                        onConfirm={this.onConfirm}
                        defaultDate={now}
                        minDate={new Date(+now - 5184000000)}
                        maxDate={new Date(+now + 31536000000)}
                    />
                </div>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
