import React from 'react';
import PropTypes from 'prop-types';
import {NavBar, Icon, List, SwipeAction, Checkbox, Button} from 'antd-mobile';
import '../index.less';
import img1 from 'Img/1.jpg'

const CheckboxItem = Checkbox.CheckboxItem;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      goodsList: [
        {
          id: 1,
          name: '太平鸟',
          title: '太平鸟那幢冬季短款黑色羽绒服',
          price: 200,
          sale: '每400减50',
          param: '黑色/L'
        },
        {
          id: 2,
          name: '太平鸟',
          title: '太平鸟那幢冬季短款黑色羽绒服',
          price: 300,
          sale: '每400减50',
          param: '黑色/L'
        },
        {
          id: 3,
          name: '太平鸟',
          title: '太平鸟那幢冬季短款黑色羽绒服',
          price: 400,
          sale: '每400减50',
          param: '黑色/L'
        },
        {
          id: 4,
          name: '太平鸟',
          title: '太平鸟那幢冬季短款黑色羽绒服',
          price: 500,
          sale: '每400减50',
          param: '黑色/L'
        },
        {
          id: 5,
          name: '太平鸟',
          title: '太平鸟那幢冬季短款黑色羽绒服',
          price: 500,
          sale: '每400减50',
          param: '黑色/L'
        }]
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onChange = () => {

  }

  render() {
    const {goodsList} = this.state;
    const GoodsItem = ({className = '', data, ...restProps}) => (
      <SwipeAction
        className={`${className} goods-swipe`} {...restProps}
        autoClose
        right={[
          {
            text: '加入收藏',
            onPress: () => console.log('cancel'),
            style: {backgroundColor: '#fe821e', color: 'white'},
          },
          {
            text: '删除',
            onPress: () => console.log('delete'),
            style: {backgroundColor: '#F4333C', color: 'white'},
          },
        ]}
        onOpen={() => console.log('global open')}
        onClose={() => console.log('global close')}
      >
        <div className='goods-item' onClick={e => console.log(e)}>
          <div className='goods-check'>
            <CheckboxItem onChange={this.onChange}></CheckboxItem>
          </div>
          <div className='goods-item-img'>
            <img src={img1} alt=""/>
          </div>
          <div className='goods-item-body'>
            <div className='goods-item-label'>{data.title}</div>
            <div className='goods-item-param'>
              <span>{data.param} <Icon type='down' size='xxs'></Icon></span></div>
            <div className='goods-item-sale'>
              <span className='saleLabel'>{data.sale}</span>
            </div>
            <div className='goods-item-footer'>
              <div><span>￥</span><span>{data.price}</span></div>
              <div>找相似</div>
            </div>
          </div>
        </div>
      </SwipeAction>
    );
    return (
      <div className="home">
        <NavBar
          mode="light"
          rightContent={[
            <Icon key="1" type="ellipsis"/>,
          ]}
        >购物车</NavBar>
        <div className="zui-content">
          <List id="goodsCar" className='goods-list'>
            {
              goodsList.map(item => {
                return (
                  <GoodsItem key={item.id} data={item} onClick={() => this.detail(item.id)}/>
                )
              })
            }
          </List>
        </div>
        <div className='goods-total-wrap'>
          <div className='goods-all'>
            <CheckboxItem onChange={this.selectAll}>全选</CheckboxItem>
          </div>
          <div className='goods-total'>
            <div className='total-price'><span>￥</span>111</div>
            <Button type="warning" inline size="small">结算</Button>
          </div>
        </div>
      </div>
    );
  }
}

Index.contextTypes = {
  router: PropTypes.object
}

export default Index;
