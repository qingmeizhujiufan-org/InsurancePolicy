import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button, Icon, Toast, List, WingBlank} from 'antd-mobile';
import '../index.less';
import {Layout, BaseInfo} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            room: {},
            hotel: {},
            initLoading: false
        }
    }

    componentWillMount() {
        this.queryOrderDetail();
    }

    queryOrderDetail = id => {
        Toast.loading('Loading...');
        const param = {
            id: this.props.params.id,
            userId: sessionStorage.userId
        }
        axios.get('hotel/queryOrderDetail', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    this.setState({
                        data: backData,
                        room: backData.Room,
                        hotel: backData.Hotel,
                    });
                }
            } else {
                Toast.fail('查询详情失败');
            }
        }).finally(() => {
            Toast.hide()
        });
    }

    onRoomDetail = () => {
        const id = this.state.data.hotelId;
        this.context.router.push(`/hotel/detail/${id}`);
    }

    render() {
        const {data, room, hotel} = this.state;
        return (
            <DocumentTitle title='订单详情'>
                <Layout className='hotel-detail-order'>
                    <Layout.Content>
                        <List>
                            <Item>
                                <span style={{fontSize: '16px', color: '#000', paddingRight: '10px'}}>订单总额</span>
                                <span style={{fontSize: '16px', color: '#FF0036'}}>{`￥${data.totalMoney}`}</span>
                            </Item>
                            <Item wrap>付款规则：到店支付</Item>
                        </List>
                        <Card className='detail-card am-card-full'>
                            <Card.Header
                                title='入住信息'
                                extra={
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end'
                                    }}
                                         onClick={this.onRoomDetail}>
                                        查看房间详情<Icon type="right" size='md'/>
                                    </div>
                                }
                            />
                            <Card.Body>
                                <div className='hotel-info'>
                                    <div><span className='iconfont icon-fangjianxinxi'></span> {hotel.hotelName}</div>
                                    <div><span className='iconfont icon-xiangqingyemian-weizhi'></span> {hotel.hotelAddress}</div>
                                </div>
                                <div className='room-info'>{room.roomName} <span style={{color: '#999', fontSize: '.24rem'}}>1间</span></div>
                                <div className='order-info'>
                                    {data.beginDate + '至' + data.endDate}
                                    <span style={{marginLeft: '10px'}}>共{data.days}晚</span>
                                </div>
                                <p>最晚到店{data.endDate} 18:00前</p>
                                <p style={{marginTop: '20px'}}>
                                    <a
                                       href={`tel:${hotel.hotelPhone}`}
                                       style={{
                                           display: 'block',
                                           height: '.64rem',
                                           lineHeight: '.64rem',
                                           margin: '10px 15%',
                                           textAlign: 'center',
                                           backgroundColor: '#FFF7EC',
                                           color: '#FF8600',
                                           borderRadius: '.06rem'
                                       }}>联系酒店</a>
                                </p>
                            </Card.Body>
                        </Card>
                        <Card className='detail-card am-card-full reservations-info'>
                            <Card.Header title='预订人员信息'/>
                            <Card.Body>
                                <BaseInfo baseInfoList={[
                                    {
                                        label: '入住人',
                                        value: data.person
                                    },{
                                        label: '联系方式',
                                        value: data.telephone
                                    },{
                                        label: '预订时间',
                                        value: data.created_at
                                    },{
                                        label: '订单编号',
                                        value: data.orderId
                                    }
                                ]}/>
                            </Card.Body>
                        </Card>
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
