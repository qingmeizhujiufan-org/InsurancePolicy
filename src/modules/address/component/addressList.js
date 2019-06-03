import React from 'react';
import PropTypes from 'prop-types';
import { List, Checkbox } from 'antd-mobile';
import {Layout} from 'Comps/zui-mobile/index';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;

class OrderAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      foodId: [],
      loading: false,
      addressList: [],
      params: {}
    }
  };

  componentWillMount() {
    this.state.id = this.props.params.id;
    this.queryDefaultAddress();
  }

  componentDidMount() {}

  queryDefaultAddress = () => {
    axios.get('address/queryList').then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          let backData = data.backData;
          this.setState({
            addressList: backData
          });
        }
      }
    })
  }

  selectAddress = () => {}

  toEditAddress = (id) => {
    this.context.router.push(`/address/update/${id}`);
  }

  toAddAddress = () => {
    const id = this.state.id;
    this.context.router.push(`/address/add/${id}`);
  }

  onChange = (val) => {
    console.log(val);
  }

  render() {
    const {addressList} = this.state;
    return (
      <DocumentTitle title='收件地址列表'>
        <div className="address">
          <Layout withFooter>
            <Layout.Content>
              <List>
                {
                  addressList.map(item =>
                    (
                      <div className="address-item" key={item.id}>
                        <Item
                          align="top"
                          extra={item.phone}
                          multipleLine
                          onClick={this.selectAddress}
                          style={{minHeight: '100px', marginRight: '50px'}}
                        >
                          收件人：{item.receiver}
                          <Brief>收货地址：{item.region + item.subArea}</Brief>
                        </Item>
                        <div className="address-btn" onClick={() => this.toEditAddress(item.id)}>编辑</div>
                      </div>

                    )
                  )
                }
              </List>
            </Layout.Content>
            <Layout.Footer className='footer'>
              <div className='submit' onClick={this.toAddAddress} >新增地址</div>
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
