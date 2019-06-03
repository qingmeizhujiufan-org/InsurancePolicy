import React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Card, Button, Flex} from 'antd-mobile';
import '../index.less';
import {Layout} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";
import {List} from 'Comps';
import {Toast} from "antd-mobile/lib/index";
import axios from "Utils/axios";

const stateList = [{
  title: '待出行',
  status: 0
}, {
  title: '已结束',
  status: 3
}, {
  title: '已评价',
  status: 3,
  commentStatus: 1
}];

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        pageNumber: 1,
        pageSize: 10,
        userId: sessionStorage.userId,
        status: 0
      },
      page: 0
    }
  }

  componentWillMount() {
    const {state} = this.props.location;
    if (state && state.page) {
      this.setState({
        page: state.page
      }, () => {
        this.tabChange(stateList[state.page], state.page);
      });
    }
  }

  componentDidMount() {
  }

  tabChange = (tab, index) => {
    const temp =  {
      pageNumber: 1,
      pageSize: 10,
      userId: sessionStorage.userId,
      status: tab.status
    };
    if (tab.commentStatus) {
      this.setState({
        params: {
          ...temp,
          commentStatus: tab.commentStatus
        },
        page: index
      });
    } else {
      this.setState({
        params: {
          ...temp
        },
        page: index
      });
    }
  }

  onDetail = id => {
    this.context.router.push(`/hotelOrder/detail/${id}`);
  }

  onComment = id => {
    this.context.router.push(`/hotelOrder/comment/${id}`);
  }

  onDelete = (e, id) => {
    e.stopPropagation();
    let param = {};
    param.id = id;
    param.state = 1;
    axios.post('hotelKeeper/orderCheck', param).then(res => res.data).then(data => {
      if (data.success) {
        Toast.success('订单取消成功!', 1);
        this.setState({
          params: {
            pageNumber: 1,
            pageSize: 10
          }
        })
      } else {
        Toast.fail('订单取消失败!', 1);
      }
    })
  }

  handleClick = (id, flag) => {
    console.log(id, flag);
    if (flag === 0) {
      this.onDelete(id);
    } else {
      this.onDetail(id)
    }
  }

  render() {
    const {params, page} = this.state;
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      const hotel = obj.Hotel;
      const room = obj.Room;
      return (
        <Card
          key={rowID}
          className='am-card-full order-card'
        >
          <Card.Header
            title={
              <Flex className='card-head-title'>
                <span className='iconfont icon-fangjianxinxi'></span>
                <div>{hotel.hotelName}</div>
              </Flex>}
            extra={<span>{obj.status === 0 ? '等待入住' : '交易已关闭'}</span>}
          />
          <Card.Body>
            <div className='card-body-title'>{room.roomName + "-" + room.breakfast}</div>
            <div className='card-body-middle'>
              <div>入<span className='highlight'>{obj.beginDate}</span></div>
              <div>离<span className='highlight'>{obj.endDate}</span></div>
              <div className='highlight'>{obj.days}晚</div>
            </div>
            <div className='card-body-footer'>￥<span className='money'>{obj.totalMoney}</span></div>
          </Card.Body>
          <Card.Footer
            extra={
              <div>
                <Button
                  size='small'
                  className='footer-btn'
                  onClick={() => this.onDetail(obj.id)}
                >查看订单</Button>
                {
                  obj.commentStatus !== 1 && obj.status === 3 ? (<Button
                    size='small'
                    className='footer-btn comment'
                    onClick={() => this.onComment(obj.id)}
                  >评价</Button>) : null
                }
              </div>
            }/>
        </Card>
      );
    }

    return (
      <DocumentTitle title='民宿订单'>
        <Layout className='hotel-order'>
          <Layout.Content>
            <Tabs
              tabs={stateList}
              page={page}
              swipeable={false}
              animated={false}
              onChange={this.tabChange}
              renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6}/>}
            >
              <List
                pageUrl={'/hotel/queryOrderList'}
                params={params}
                row={row}
              />
            </Tabs>
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
