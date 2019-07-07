import React from 'react';
import PropTypes from 'prop-types';
import {List, Tabs, Toast, Flex, WingBlank, WhiteSpace, Icon, ImagePicker} from 'antd-mobile';
import {Layout} from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

const Item = List.Item;
const Brief = Item.Brief;
const data = [];

const tabs = [
    {title: '阅读排行', sub: '1'},
    {title: '季度排行', sub: '2'},
    {title: '年度排行', sub: '3'},
];


class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            files: data,
            user: {},
            month: {},
            quarter: {},
            year: {}
        }
    };

    componentWillMount() {
        this.setState({
            userId: sessionStorage.getItem('userId')
        });
        setTimeout(() => {
            this.queryUserDetail()
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
            console.log('response == ', response);
            this.setState({
                user: {
                    ...this.state.user,
                    bgId: response.id
                }
            });
        });
        xhr.addEventListener('error', () => {
            const error = JSON.parse(xhr.responseText);
        });
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

    render() {
        const {files, user, month, quarter, year} = this.state;

        const UserSumItem = ({className = '', data, ...restProps}) => (
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
                                user.bgId ? (
                                    <img className='user-bg' src={restUrl.FILE_ASSET + user.bgId + '.jpg'}/>
                                ) : <span className='tip'>轻触替换背景</span>
                            }
                            <input
                                type='file'
                                accept='image/jpeg'
                                className='upload-user-bg'
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="user-info-container">
                            <WhiteSpace size="lg"/>
                            <div className="user-name">
                                {user.realname}
                                <i
                                    className="iconfont iconbianji"
                                    style={{verticalAlign: 'middle', marginLeft: '10px', fontSize: '14px'}}
                                    onClick={() => {
                                        this.toEdit()
                                    }}/>
                            </div>
                            <WhiteSpace size="sm"/>
                            <div
                                className="user-company">{user.InsuranceCompany && user.InsuranceCompany.companyName}</div>
                            <WhiteSpace size="lg"/>
                            <div className="user-logo">
                                <img src="https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg" alt=""/>
                            </div>
                        </div>
                        <WhiteSpace size="lg"/>
                        <Tabs
                            className="user-tab"
                            tabs={tabs}
                            initialPage={0}
                            renderTab={tab => <span>{tab.title}</span>}
                        >
                            <div className="user-tab-item">
                                <UserSumItem data={month}/>
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem data={quarter}/>
                            </div>
                            <div className="user-tab-item">
                                <UserSumItem data={year}/>
                            </div>
                        </Tabs>
                        <WhiteSpace size="lg"/>

                        <List className="my-list">
                            <Item
                                thumb={
                                    <i className="iconfont iconwodekehu blue"/>
                                }
                                arrow="horizontal" onClick={() => {
                                this.toCustomList()
                            }}>
                                我的客户
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconwodedingdan blue"/>
                                }
                                arrow="horizontal" onClick={() => {
                                this.toOrderList()
                            }}>我的订单
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconjifenshangcheng blue"/>
                                }
                                arrow="horizontal" onClick={() => {
                                this.toMall()
                            }}>积分商城
                            </Item>
                        </List>

                        <WhiteSpace size="lg"/>

                        <List className="my-list">
                            <Item
                                thumb={
                                    <i className="iconfont iconkefuzixun orange"/>
                                }
                                arrow="horizontal" onClick={() => {
                            }}>客户咨询
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconyijianfankui orange"/>
                                }
                                arrow="horizontal" onClick={() => {
                            }}>意见反馈
                            </Item>
                            <Item
                                thumb={
                                    <i className="iconfont iconguanyu orange"/>
                                }
                                arrow="horizontal" onClick={() => {
                            }}>关于保联汇
                            </Item>
                        </List>
                        <WhiteSpace size="lg"/>

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
