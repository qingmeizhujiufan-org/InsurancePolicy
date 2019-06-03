import React from 'react';
import PropTypes from 'prop-types';
import {Carousel, Flex, Toast} from 'antd-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";
import {Layout, BaseInfo, DatePicker, List} from "Comps/zui-mobile";
import vipDiscount from 'Img/vip_discount.png';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      roomStatus: 0,
      detailPicList: [],
      currentIndex: 0
    }
  };

  componentWillMount() {
    const {state} = this.props.location;
    this.setState({
      roomStatus: state.status
    });
  }

  componentDidMount() {
    this.queryDetail();
  }

  queryDetail = () => {
    this.setState({loading: true});
    const param = {
      id: this.props.params.id
    }
    axios.get('room/queryDetail', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          const backData = data.backData;
          const detailPic = backData.detailPic || [];

          detailPic.map(item => {
            item.imgSrc = restUrl.FILE_ASSET + `${item.id + item.fileType}`;
          });

          this.setState({
            detailPicList: detailPic,
            currentIndex: 1,
            data: backData
          });
        } else {
          this.setState({
            detailPicList: []
          });
        }
      } else {
        Toast.fail('查询列表失败', 1);
      }
      this.setState({loading: false});
    });
  }

  viewComment = () => {
    const data = this.state.data;
    this.context.router.push('/hotel/comment/' + data.id);
  }

  signUp = () => {
    const data = this.state.data;
    const {state} = this.props.location;
    this.context.router.push({
      pathname: '/hotel/reserve/' + data.id,
      state: {
        ...state,
        roomInfo: data
      }
    });
  }

  render() {
    const {data, detailPicList, currentIndex, roomStatus} = this.state;

    return (
      <DocumentTitle title='特色民宿'>
        <Layout className="hotel-room" withFooter>
          <Layout.Content>
            <div className='wrap-carousel'>
              <Carousel
                dots={false}
                beforeChange={(from, to) => this.setState({currentIndex: to + 1})}
              >
                {detailPicList.map((item, index) => (
                  <div key={index} className='carousel-item'>
                    <img
                      src={item.imgSrc}
                      alt=""
                      style={{width: '100%', height: '100%', verticalAlign: 'top'}}
                    />
                  </div>
                ))}
              </Carousel>
              <div className='dot'>{currentIndex} / {detailPicList.length}</div>
            </div>
            <div className='box'>
              <Flex justify='between'>
                <div className='box-title room-name'>{data.roomName}</div>
                <div className='view-comment' onClick={this.viewComment}>查看评价 ></div>
              </Flex>
              {/*<div className='detail-pic-list'>*/}
              {/*{*/}
              {/*detailPicList.map((item, index) => {*/}
              {/*return (*/}
              {/*<div key={index} className='wrap-img'><img src={item.imgSrc}/></div>*/}
              {/*)*/}
              {/*})*/}
              {/*}*/}
              {/*</div>*/}
              <Flex>
                <div className='left-block'>
                  <div className='item'>
                    <span className='label'>床型</span>
                    <span className='text'>{data.bedModel}</span>
                  </div>
                  <div className='item'>
                    <span className='label'>可住</span>
                    <span
                      className='text'>{data.stayPersonNum ? data.stayPersonNum + '人' : null}</span>
                  </div>
                  <div className='item'>
                    <span className='label'>窗景</span>
                    <span className='text'>{data.windowScenery}</span>
                  </div>
                </div>
                <div className='right-block'>
                  <div className='item'>
                    <span className='label'>面积</span>
                    <span className='text'>{data.roomSize ? data.roomSize + '平米' : null}</span>
                  </div>
                  <div className='item'>
                    <span className='label'>网络</span>
                    <span className='text'>{data.internet}</span>
                  </div>
                  <div className='item'>
                    <span className='label'>窗户</span>
                    <span className='text'>{data.window}</span>
                  </div>
                </div>
              </Flex>
              <div className='item'>
                <span className='label'>卫浴</span>
                <span className='text'>{data.bathroom}</span>
              </div>
              <div className='item'>
                <span className='label'>早餐</span>
                <span className='text'>{data.breakfast}</span>
              </div>
              <div className='item'>
                <span className='label'>饮品</span>
                <span className='text'>{data.drink}</span>
              </div>
              <div className='item'>
                <span className='label'>设施</span>
                <span className='text'>{data.facilities}</span>
              </div>
            </div>
            <div className='box'>
              <div className='box-title'>预订须知</div>
              <div className='item'>
                <span className='label'>支付方式</span>
                <span className='text'>{data.payType}</span>
              </div>
              <div className='item'>
                <span className='label strong'>不可取消</span>
                <span className='text'>{data.canCancel}</span>
              </div>
              <div className='item'>
                <span className='label'>加床</span>
                <span className='text'>{data.canAddbed}</span>
              </div>
              <div className='item'>
                <span className='label'>内宾</span>
                <span className='text'>{data.innerNeed}</span>
              </div>
            </div>
            <div className='box'>
              <div className='box-title'>优惠政策</div>
              <div className='item'>
                <span className='label vip'><img src={vipDiscount}/></span>
                <span className='text'>{data.sale}</span>
              </div>
            </div>
          </Layout.Content>
          <Layout.Footer>
            <Flex className='footer-btn-group'>
              <div className='total-money'>¥ <span className='price'>{data.roomPrice}</span></div>
              {
                roomStatus === 0 ? (
                  <div className='sign' onClick={this.signUp}>预 订</div>
                ) : (
                  <div className='sign disable'>订 满</div>
                )
              }
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
