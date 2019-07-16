import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Picker, List, Button, InputItem, TextareaItem, Modal, Toast, WingBlank, WhiteSpace } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import { createForm } from 'rc-form';
import localStorage from 'Utils/localStorage'
import { assign } from 'lodash';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';

const Item = List.Item;
const now = new Date();
const sexs = [{
  label: '男',
  value: 1,
},
{
  label: '女',
  value: 0,
}];

function getDuration(max = 30) {
  const duration = [];
  for (let i = 1; i <= max; i++) {
    let item = {
      label: i + '年',
      value: i
    }
    duration.push(item)
  }

  return duration
}

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: localStorage.get('userId'),
      orderId: null,
      order: {},
      type: 'add',
      Channel: [],
      Client: [],
      companyList: [],
      canAdd: true,
      errMsg: ''
    }
  };

  componentWillMount() {
    this.queryCompanyList();
    // this.queryClientList();
    this.queryChannelList();
  }

  componentDidMount() {
    let query = this.props.location.query;
    if (query.orderId) {
      this.setState({
        orderId: query.orderId,
        type: 'update'
      });
      setTimeout(() => {
        this.queryOrderDetail()
      }, 0);
    }
  }

  queryChannelList = () => {
    const param = {
      pageSize: 1000,
      pageNumber: 1,
      userId: this.state.userId
    };
    axios.get('channel/queryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        let backData = data.backData.content || [];
        let list = backData.map(item => {
          return {
            value: item.id,
            label: item.channelName
          }
        })
        this.setState({
          Channel: list,
        });
      }
    }).catch(err => {
      Toast.fail('服务异常', 2);
    })
  }

  showAlert = ({ info, url }) => {
    Modal.alert('警告', `${info}`, [
      {
        text: '取消', onPress: () => {
          this.setState({
            canAdd: false,
            errMsg: info
          })
        }, style: 'default'
      },
      {
        text: '确认', onPress: () => {
          this.context.router.push({
            pathname: url
          })
        }
      },
    ]);
  }

  // queryClientList = () => {
  //   const param = {
  //     pageSize: 1000,
  //     pageNumber: 1,
  //     userId: this.state.userId
  //   };
  //   axios.get('custom/queryList', {
  //     params: param
  //   }).then(res => res.data).then(data => {
  //     if (data.success) {
  //       let backData = data.backData.content || [];
  //       if (backData.length === 0) {
  //         this.showAlert({
  //           info: '暂无客户信息，是否添加相关客户？',
  //           url: '/custom/add'
  //         })
  //         return;
  //       }
  //       let list = backData.map(item => {
  //         return {
  //           value: item.id,
  //           label: item.customName
  //         }
  //       })
  //       this.setState({
  //         Client: list,
  //       });
  //     }
  //   }).catch(err => {
  //     Toast.fail('服务异常', 2);
  //   })
  // }

  queryCompanyList = () => {
    const param = {
      pageSize: 1000,
      pageNumber: 1
    };
    axios.get('insuranceCompany/queryList', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        let backData = data.backData.content || [];
        if (backData.length === 0) {
          this.setState({
            canAdd: false,
            errMsg: '缺少保险公司信息，无法创建订单'
          });
        }
        let companyList = backData.map(item => {
          return {
            value: item.id,
            label: item.companyName
          }
        })

        this.setState({
          companyList: companyList,
        });
      }
    }).catch(err => {
      Toast.fail('服务异常', 2);
    })
  }

  queryOrderDetail = id => {
    Toast.loading('正在加载', 0);
    const { userId, orderId } = this.state;
    const param = {
      id: orderId,
      userId
    }
    axios.get('order/queryOne', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.backData) {
        const backData = data.backData;
        this.setState({
          order: backData
        });
        Toast.hide()
      } else {
        Toast.fail('查询失败', 2);
      }
    }).catch(err => {
      Toast.fail('服务异常', 2);
    })
  }

  validateDatePicker = (rule, date, callback) => {
    if (date) {
      callback();
    } else {
      callback(new Error('请选择日期'));
    }
  }


  onSubmit = () => {
    const { canAdd, errMsg } = this.state;
    if (!canAdd) {
      Toast.fail(errMsg, 2);
      return;
    }
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        const { orderId, userId, type } = this.state;
        Toast.loading('正在提交', 0);
        const values = this.props.form.getFieldsValue();
        const param = assign({}, { userId }, values);
        param.insuranceCompany = param.insuranceCompany[0];
        param.policyholderSex = param.policyholderSex[0];
        param.insuredSex = param.insuredSex[0];
        param.paymentDuration = param.paymentDuration[0];
        param.orderChannel = param.orderChannel[0];
        // param.clientId = param.clientId[0];

        if (orderId) {
          param.id = orderId;
        }

        axios.post(`order/${type}`, param).then(res => res.data).then(data => {
          if (data.success) {
            Toast.success('提交成功', 1, () => {
              this.context.router.push(`/order/list`);
            });
          } else {
            Toast.fail('提交失败', 2);
          }
        }).catch(() => {
          Toast.fail('服务异常', 2);
        })
      } else {
        let errors = [];
        for (let key in error) {
          errors.push(error[key].errors[0].message)
        }
        Toast.fail(errors[0], 1);
      }
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { order, Channel, companyList, type } = this.state;

    return (
      <DocumentTitle title={type === 'add' ? '添加订单' : '修改订单'}>
        <Layout className="order">
          <Layout.Content>
            <form>
              <List renderHeader={() => '保单信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('insurancePolicyNo', {
                    initialValue: order.insurancePolicyNo,

                    rules: [
                      { required: true, message: '请输入保单号' }
                    ]
                  })}
                  clear

                  placeholder="请输入"
                >保单号</InputItem>
                <InputItem
                  {...getFieldProps('insuranceName', {
                    initialValue: order.insuranceName,
                    rules: [
                      { required: true, message: '请输入产品名称' }
                    ]
                  })}
                  clear
                  placeholder="请输入"
                >产品名称</InputItem>
                <Picker
                  data={companyList}
                  cols={1}
                  {...getFieldProps('insuranceCompany', {
                    initialValue: order.insuranceCompany ? [order.insuranceCompany] : '',
                    rules: [
                      { required: true, message: '请输入保险公司' }
                    ],
                  })}
                >
                  <Item arrow="horizontal">保险公司</Item>
                </Picker>
                <DatePicker
                  {...getFieldProps('insuredTime', {
                    initialValue: order.insuredTime ? new Date(order.insuredTime) : '',
                    rules: [
                      { required: true, message: '请选择生效时间' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                  minDate={new Date(1950, 1, 1, 0, 0, 0)}
                >
                  <Item arrow="horizontal">生效时间</Item>
                </DatePicker>
                <Picker
                  data={getDuration(30)}
                  cols={1}
                  {...getFieldProps('paymentDuration', {
                    initialValue: order.paymentDuration ? [order.paymentDuration] : '',
                    rules: [
                      { required: true, message: '请选择缴费年限' }
                    ],
                  })}
                >
                  <Item arrow="horizontal">缴费年限</Item>
                </Picker>
                <WhiteSpace size="lg" style={{ backgroundColor: '#f5f5f9' }} />
                <InputItem
                  {...getFieldProps('insuredSum', {
                    initialValue: order.insuredSum,
                    rules: [
                      { required: true, message: '请输入保额' }
                    ]
                  })}
                  type="money"
                  moneyKeyboardAlign="left"
                  clear
                  placeholder="请输入"
                >保额</InputItem>
                <InputItem
                  {...getFieldProps('insurance', {
                    initialValue: order.insurance,
                    rules: [
                      { required: true, message: '请输入保费' }
                    ]
                  })}
                  type="money"
                  moneyKeyboardAlign="left"
                  clear
                  placeholder="请输入"
                >保费</InputItem>
                <TextareaItem
                  {...getFieldProps('mark', {
                    initialValue: order.mark,
                  })}
                  placeholder="其他备注消息"
                  rows={5}
                  count={100}
                />
              </List>

              <List renderHeader={() => '订单渠道'} className="order-add-list">
                <Picker
                  data={Channel}
                  cols={1}
                  {...getFieldProps('orderChannel', {
                    initialValue: order.orderChannel ? [order.orderChannel] : '',
                    rules: [
                      { required: true, message: '请选择订单渠道' }
                    ]
                  })}
                  error={!!getFieldError('orderChannel')}
                >
                  <Item arrow="horizontal">渠道</Item>
                </Picker>
              </List>

              {/* <List renderHeader={() => '关联客户'} className="order-add-list">
                <Picker
                  data={Client}
                  cols={1}
                  {...getFieldProps('clientId', {
                    initialValue: order.clientId ? [order.clientId] : '',
                    rules: [
                      { required: true, message: '请选择关联客户' }
                    ]
                  })}
                  error={!!getFieldError('clientId')}
                >
                  <Item arrow="horizontal">客户</Item>
                </Picker>

              </List> */}

              <List renderHeader={() => '投保人信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('policyholderName', {
                    initialValue: order.policyholderName,
                    rules: [
                      { required: true, message: '请输入投保人姓名' }
                    ]
                  })}
                  clear
                  placeholder="请输入"
                >姓名</InputItem>
                <DatePicker
                  {...getFieldProps('policyholderBirthday', {
                    initialValue: order.policyholderBirthday ? new Date(order.policyholderBirthday) : '',
                    rules: [
                      { required: true, message: '请选择' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                  minDate={new Date(1950, 1, 1, 0, 0, 0)}
                  maxDate={new Date()}
                >
                  <Item arrow="horizontal">生日</Item>
                </DatePicker>
                <InputItem
                  {...getFieldProps('policyholderTelephone', {
                    initialValue: order.policyholderTelephone,
                    rules: [
                      { required: true, message: '请输入投保人电话' },
                      { validator: this.validatePhone },
                    ],
                  })}
                  clear
                  placeholder="请输入"
                >电话后四位</InputItem>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('policyholderSex', {
                    initialValue: order.policyholderSex ? [order.policyholderSex] : '',
                  })}
                >
                  <Item arrow="horizontal">性别</Item>
                </Picker>
              </List>

              <List renderHeader={() => '被保人信息'} className="order-add-list">
                <InputItem
                  {...getFieldProps('insuredName', {
                    initialValue: order.insuredName,
                    rules: [
                      { required: true, message: '请输入被保人姓名' }
                    ]
                  })}
                  clear
                  placeholder="请输入"
                >姓名</InputItem>
                <DatePicker
                  {...getFieldProps('insuredBirthday', {
                    initialValue: order.insuredBirthday ? new Date(order.insuredBirthday) : '',

                    rules: [
                      { required: true, message: '请选择被保人生日' },
                      { validator: this.validateDatePicker },
                    ],
                  })}
                  mode="date"
                  minDate={new Date(1950, 1, 1, 0, 0, 0)}
                  maxDate={new Date()}
                >
                  <Item arrow="horizontal">生日</Item>
                </DatePicker>
                <InputItem
                  {...getFieldProps('insuredTelephone', {
                    initialValue: order.insuredTelephone,
                    rules: [
                      { required: true, message: '请输入' },
                      { validator: this.validatePhone },
                    ],
                  })}
                  clear
                  placeholder="请输入"
                >电话后四位</InputItem>
                <Picker
                  data={sexs}
                  cols={1}
                  {...getFieldProps('insuredSex', {
                    initialValue: order.insuredSex ? [order.insuredSex] : '',
                  })}
                  error={!!getFieldError('insuredSex')}
                >
                  <Item arrow="horizontal">性别</Item>
                </Picker>
              </List>

              <List
                className="order-add-list"
                renderHeader={() => '受益人信息'}
              >
                <InputItem
                  {...getFieldProps('beneficiaryName', {
                    initialValue: order.beneficiaryName,
                    rules: [
                      { required: true, message: '请输入受益人姓名' }
                    ]
                  })}
                  clear
                  placeholder="请输入"
                >姓名</InputItem>
              </List>
              <WingBlank>
                <Button type="primary" onClick={this.onSubmit} style={{ margin: '1rem 0 .4rem' }}>提交</Button>
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
