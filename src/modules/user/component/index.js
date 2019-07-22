import React from 'react';
import PropTypes from 'prop-types';
import { List, Tabs, Toast, Button, Flex, WingBlank, WhiteSpace, Icon, ImagePicker } from 'antd-mobile';
import { Layout } from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import localStorage from 'Utils/localStorage'
import restUrl from "RestUrl";
import avator from 'Img/hand-loging.png';
import bgIMG from 'Img/bg.png';

const Item = List.Item;

const tabs = [
    { title: '月度排行', sub: '1' },
    { title: '季度排行', sub: '2' },
    { title: '年度排行', sub: '3' },
];


class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            user: {},
            month: {},
            quarter: {},
            year: {},
            bgId: '',
            Links: {}
        }
    };

    componentWillMount() {
        this.setState({
            userId: localStorage.get('userId')
        });
        setTimeout(() => {
            this.queryUserDetail();
            this.queryLinkDetail();

        }, 0);
    }

    componentDidMount() {
    }

    queryUserDetail = () => {
        Toast.loading('正在加载', 0);

        const param = {
            id: this.state.userId
        };

        axios.get('user/queryUserSum', {
            params: param
        }).then(res => res.data).then(data => {
            if (data.backData) {
                const backData = data.backData;
                this.setState({
                    user: backData.user || {},
                    month: backData.month || {},
                    quarter: backData.quarter || {},
                    year: backData.year || {}
                });
                Toast.hide()
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    queryLinkDetail = () => {
        axios.get('link/queryDetail').then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                this.setState({
                    Links: backData
                });
            } else {
                Toast.fail('查询失败', 2);
            }
        }).catch(err => {
            Toast.fail('服务异常', 2);
        })
    }

    onChange = e => {
        const files = e.target.files;
        console.log('onChange === ', files);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', restUrl.FILE_UPLOAD_HOST + 'file/upload');
        const data = new FormData();
        data.append('file', files[0]);
        xhr.send(data);

        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            // console.log('response == ', response);
            this.updateBgImg(response.id);
        });
        xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
        });
    }

    updateBgImg = (bgId) => {
        const { userId } = this.state;
        const param = {
            id: userId,
            bgId: bgId
        };
        axios.post(`user/update`, param).then(res => res.data).then(data => {
            if (data.success) {
                Toast.success('更新成功', 2, () => {
                    this.queryUserDetail();
                });
            } else {
                Toast.fail('更新失败', 2);
            }
        }).catch(() => {
            Toast.fail('服务异常', 2);
        })
    }

    toEdit = () => {
        this.context.router.push(`/user/edit`);
    }

    toOrderList = () => {
        this.context.router.push(`/order/list`);

    }

    toCustomList = () => {
        this.context.router.push(`/custom/list`);
    }

    logout = () => {
        localStorage.remove('userId');
        this.context.router.push(`/public/login`);
    }

    render() {
        const { user, month, quarter, year, Links } = this.state;
        const bgImg = user.bgId;

        const UserSumItem = ({ className = '', data, ...restProps }) => (
            <div className={`${className} user-sum-item`} {...restProps}>
                <div className="sum-item">
                    <div><span className="sum-info">{data.orderSum || 0}</span>元</div>
                    <div className="sum-title">累计保费</div>
                </div>
                <div className="sum-item">
                    <div><span className="sum-info">{data.orderNum || 0}</span>件</div>
                    <div className="sum-title">保单数量</div>
                </div>
            </div>
        );

        return (
            <DocumentTitle title='个人中心'>
                <Layout className="personal">
                    <Layout.Content>
                        <div className="user-img-container">
                            {
                                bgImg && bgImg.id
                                    ? <img className='user-bg' src={restUrl.FILE_ASSET + bgImg.id + bgImg.fileType} />
                                    : <img className='user-bg' src={bgIMG} />
                            }
                            <input
                                type='file'
                                accept='image/*'
                                className='upload-user-bg'
                                onChange={this.onChange}
                            />
                            <i className='iconfont iconpaizhao tip'>&nbsp;轻触替换背景</i>
                        </div>
                        <div className="user-info-container">

                            <div
                                className="user-name"
                                onClick={() => {
                                    this.toEdit()
                                }}
                            ><span>{user.realname}</span></div>
                            <WhiteSpace size="md" />
                            <div
                                className="user-company">{user.companyName}</div>
                            <WhiteSpace size="lg" />
                            <div className="user-logo">
                                {
                                    user.headimgurl
                                        ? <img src={restUrl.FILE_ASSET + user.headimgurl + user.fileType} alt="" />
                                        : <img src={avator} alt="" />
                                }

                            </div>
                        </div>
                        <WhiteSpace size="lg" />
                        <Tabs
                            className="user-tab"
                            tabs={tabs}
                            initialPage={0}
                            renderTab={tab => <span>{tab.title}</span>}
                        >
                            <div className="user-tab-item">
                                <UserSumItem data={month} />
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem data={quarter} />
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem data={year} />
                            </div>
                        </Tabs>
                        <WhiteSpace size="lg" />

                        <List className="my-list">
                            <Item
                                thumb={
                                    <i className="iconfont iconwodekehu blue" />
                                }
                                arrow="horizontal" onClick={() => {
                                    this.toCustomList()
                                }}>
                                我的客户
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconwodedingdan blue" />
                                }
                                arrow="horizontal" onClick={() => {
                                    this.toOrderList()
                                }}>我的订单
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconjifenshangcheng blue" />
                                }
                                arrow="horizontal" onClick={() => {
                                    window.location.href = `${Links.pointMallUrl}`
                                }}>积分商城
                            </Item>
                        </List>

                        <WhiteSpace size="lg" />

                        <List className="my-list">
                            <Item
                                thumb={
                                    <i className="iconfont iconkefuzixun orange" />
                                }
                                arrow="horizontal" onClick={() => {
                                    window.location.href = `${Links.customerConsultUrl}`

                                }}>客服咨询
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconyijianfankui orange" />
                                }
                                arrow="horizontal" onClick={() => {
                                    window.location.href = `${Links.feedbackUrl}`

                                }}>意见反馈
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconguanyu orange" />
                                }
                                arrow="horizontal" onClick={() => {
                                    window.location.href = `${Links.aboutUrl}`
                                }}>关于保联汇
                            </Item>

                        </List>

                        <Button type="warning" style={{ marginTop: '1rem', marginBottom: '.2rem' }} onClick={this.logout}>退出登录</Button>

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
