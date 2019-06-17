import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Picker, List, Button, InputItem, TextareaItem, Toast, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

import classify_1 from 'Img/classify_1.png';

const Item = List.Item;
const Brief = Item.Brief;
const sexs = [{
  label: '男',
  value: 1,
},
{
  label: '女',
  value: 0,
}];

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  validateDatePicker = (rule, date, callback) => {
    if (date && date.getMinutes() !== 15) {
      callback();
    } else {
      callback(new Error('15 is invalid'));
    }
  }


  onSubmit = () => {
    this.context.router.push(`/personal`);
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { } = this.state;

    return (
      <DocumentTitle title='新增订单'>
        <Layout className="order">
          <Layout.Content>
            <form>
              <List renderHeader={() => '保单信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >保单号</InputItem>
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >产品信息</InputItem>
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >保险公司</InputItem>
                <DatePicker
                  {...getFieldProps('birth', {
                    // initialValue: this.state.dpValue,
                    rules: [
                      { required: true, message: '请选择客户生日' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                >
                  <Item arrow="horizontal">投保时间</Item>
                </DatePicker>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('year', {
                    initialValue: [1],
                  })}
                >
                  <Item arrow="horizontal">缴费年限</Item>
                </Picker>
                <WhiteSpace size="lg" style={{ backgroundColor: '#f5f5f9' }} />
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  type="money"
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >保额</InputItem>
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  type="money"
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >保费</InputItem>
                <TextareaItem
                  {...getFieldProps('count', {
                    initialValue: '',
                  })}
                  placeholder="其他备注消息"
                  rows={5}
                  count={100}
                />
              </List>

              <List renderHeader={() => '订单渠道'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
              </List>

              <List renderHeader={() => '关联客户'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入客户姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
              </List>
              <List renderHeader={() => '被保人信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入被保人姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
                <DatePicker
                  {...getFieldProps('birth', {
                    // initialValue: this.state.dpValue,
                    rules: [
                      { required: true, message: '请选择' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                >
                  <Item arrow="horizontal">生日</Item>
                </DatePicker>
                <InputItem
                  {...getFieldProps('telphone', {
                    rules: [
                      { required: true, message: '请输入' },
                      { validator: this.validatePhone },
                    ],
                  })}
                  clear
                  error={!!getFieldError('telphone')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('telphone').join('、'));
                  }}
                  placeholder="请输入"
                >电话后四位</InputItem>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('sex', {
                    initialValue: [1],
                  })}
                >
                  <Item arrow="horizontal">性别</Item>
                </Picker>
              </List>

              <List renderHeader={() => '投保人信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入被保人姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
                <DatePicker
                  {...getFieldProps('birth', {
                    // initialValue: this.state.dpValue,
                    rules: [
                      { required: true, message: '请选择' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                >
                  <Item arrow="horizontal">生日</Item>
                </DatePicker>
                <InputItem
                  {...getFieldProps('telphone', {
                    rules: [
                      { required: true, message: '请输入' },
                      { validator: this.validatePhone },
                    ],
                  })}
                  clear
                  error={!!getFieldError('telphone')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('telphone').join('、'));
                  }}
                  placeholder="请输入"
                >电话后四位</InputItem>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('sex', {
                    initialValue: [1],
                  })}
                >
                  <Item arrow="horizontal">性别</Item>
                </Picker>
              </List>

              <List renderHeader={() => '被保人信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入被保人姓名' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
                <DatePicker
                  {...getFieldProps('birth', {
                    // initialValue: this.state.dpValue,
                    rules: [
                      { required: true, message: '请选择' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                >
                  <Item arrow="horizontal">生日</Item>
                </DatePicker>
                <InputItem
                  {...getFieldProps('telphone', {
                    rules: [
                      { required: true, message: '请输入' },
                      { validator: this.validatePhone },
                    ],
                  })}
                  clear
                  error={!!getFieldError('telphone')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('telphone').join('、'));
                  }}
                  placeholder="请输入"
                >电话后四位</InputItem>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('sex', {
                    initialValue: [1],
                  })}
                >
                  <Item arrow="horizontal">性别</Item>
                </Picker>
              </List>
              <List
                className="order-add-list"
                renderHeader={() => '受益人信息'}
                renderFooter={
                  () =>
                    getFieldError('name')
                    && getFieldError('birth') && getFieldError('telphone') && getFieldError('sex')

                }
              >
                <InputItem
                  {...getFieldProps('name', {
                    rules: [
                      { required: true, message: '请输入' }
                    ]
                  })}
                  clear
                  error={!!getFieldError('name')}
                  onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                  }}
                  placeholder="请输入"
                >姓名</InputItem>
              </List>
              <WhiteSpace size="lg" />
              <WingBlank>
                <WhiteSpace size="sm" />
                <Button type="primary" onClick={this.onSubmit}>提交</Button>
                <WhiteSpace size="sm" />
              </WingBlank>
            </form>
          </Layout.Content>
        </Layout>
      </DocumentTitle >
    );
  }
}

Index.contextTypes = {
  router: PropTypes.object
}
const OrderAdd = createForm()(Index);

export default OrderAdd;
