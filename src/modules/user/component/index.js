import React from 'react';
import PropTypes from 'prop-types';
import {List, NavBar, Icon} from 'antd-mobile';
import '../index.less';
import vipBadge from 'Img/VIP_badge.png';
import {Layout} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";

const Item = List.Item;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                isPayed: 1,
                isDoned: 2,
                toPayed: 1
            }
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    viewVIP = () => {
        this.context.router.push('vip');
    }

    render() {
        const {data} = this.state;

        return (
            <DocumentTitle title='个人中心'>
                <div id="goodsDetail">
                    <Layout>
                        <Layout.Content>
                            <div className="zui-content">
                                <div id="userCenter">
                                    <div className='img-area'></div>
                                    <div className='main-area'>
                                        <div className='user-area'>
                                            <div className='user-info'>
                                                <div className='user-img'>
                                                    <img src={sessionStorage.headimgurl} alt=""/>
                                                </div>
                                                <div className='user-detail'>
                                                    <div className='user-name'>{sessionStorage.nickname}</div>
                                                    <div className='is-vip'><img src={vipBadge}/> VIP</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='vip' onClick={this.viewVIP}>
                                        </div>
                                        <div className='info-area'>
                                            <List className='info-list'>
                                                <Item
                                                    thumb={<span className='iconfont icon-fangjianxinxi'></span>}
                                                    arrow="horizontal"
                                                    onClick={() => this.context.router.push('/hotelOrder')}
                                                >民宿订单</Item>
                                                <Item
                                                    thumb={<span className='iconfont icon-gerenzhongxin-lvyoudingdan'></span>}
                                                    onClick={() => {
                                                      this.context.router.push('/travelOrder')
                                                    }}
                                                    arrow="horizontal"
                                                >旅游订单</Item>
                                            </List>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Layout.Content>
                    </Layout>
                </div>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
