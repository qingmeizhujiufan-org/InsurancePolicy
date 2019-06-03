import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd-mobile';
import '../index.less';
import vipBadge from 'Img/VIP_badge.png';
import {Layout} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";

const alert = Modal.alert;

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

    becomeVip = () => {
        alert('积分开通VIP', '您将用3000积分兑换开通VIP会员', [
            {text: '取消', onPress: () => console.log('cancel')},
            {text: '确定', onPress: () => console.log('ok')},
        ])
    }

    render() {
        const {data} = this.state;

        return (
            <DocumentTitle title='VIP权益'>
                <div id="goodsDetail">
                    <Layout>
                        <Layout.Content>
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
                                    <div className='info-area'>
                                        <div className='vip-rule'>
                                            <div className='vip-rule-title'>VIP原则：</div>
                                            <div className='vip-rule-desc'>凡是关注“湖北民俗文化推广平台”公众号的用户，一旦关注本公众号即成为“湖北民俗文化推广平台”的会员
                                            </div>
                                            <br/>
                                            <div className='vip-rule-title'>VIP所享福利：</div>
                                            <div className='vip-rule-desc'>VIP用户预定特色民宿可以享9折优惠</div>
                                            <br/>
                                            <div className='vip-rule-title'>VIP会员服务协议：</div>
                                            <div className='vip-rule-desc'>会员服务的最终解释权归</div>
                                            <div className='vip-rule-desc'>湖北省新华资产管理有限公司所有</div>
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
