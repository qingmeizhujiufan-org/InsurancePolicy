import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'antd-mobile';
import {Layout,GoodsCard} from 'Comps/zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;

class OrderAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foodId: [],
      total: 0,
      loading: false,
      address: null,
      params: {}
    }
  };

  componentWillMount() {
    this.queryDefaultAddress();
  }

  componentDidMount() {}

  queryDefaultAddress = () => {
    const param = {
      isDefault: 1
    };
    axios.get('address/queryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          let backData = data.backData;
          this.setState({
            address: backData.length ? backData[0] : null
          });
        }
      }
    })
  }

  showAddressList = () => {
    const id = 1;
    this.context.router.push(`/address/list/${id}`);
  }

  render() {
    const {address, total} = this.state;
    return (
      <DocumentTitle title='确认订单'>
        <div id="orderAdd">
          <Layout withFooter>
            <Layout.Content>
              <List>
                {
                  address ?
                    (
                      <Item
                        arrow="horizontal"
                        align="top"
                        extra={address.phone}
                        thumb={<Icon type="check"/>}
                        multipleLine
                        onClick={this.showAddressList}
                        style={{minHeight: '100px'}}
                      >
                        收件人：{address.receiver}
                        <Brief>收货地址：{address.region + address.subArea}</Brief>
                      </Item>
                    ) : (
                      <Item
                        arrow="horizontal"
                        thumb={<Icon type="check"/>}
                        multipleLine
                        onClick={this.showAddressList}
                      >
                        请输入收货地址
                      </Item>
                    )
                }
              </List>
              <GoodsCard />
            </Layout.Content>
            <Layout.Footer className='footer'>
              <div className='total'>总计：<span>￥{total}</span></div>
              <div className='submit'>提交订单</div>
            </Layout.Footer>
          </Layout>
        </div>
      </DocumentTitle>
    );
  }
}

OrderAdd.contextTypes = {
  router: PropTypes.object
}

export default OrderAdd;
