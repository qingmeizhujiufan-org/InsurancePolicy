import React from 'react';
import {TabBar} from 'antd-mobile';


/* 商城首页 */
import Home from '../../home/component/';

/* 商品分类 */
import Category from '../../food/component/';

/* 购物车 */
import GoodsCar from '../../goodsCar/component/';

/* 我的 */
import User from '../../User/component/';


export default class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: '1'
        };
    }

    componentWillMount() {
        if (sessionStorage.getItem('selectedTab')) {
            this.setState({
                selectedTab: sessionStorage.getItem('selectedTab')
            });
        } else {
            sessionStorage.setItem('selectedTab', '1');
        }
    }

    render() {
        return (
            <div>
                <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, height: '100%'}}>
                    <TabBar
                        unselectedTintColor="#AAAFB9"
                        tintColor="#3D3D3D"
                        barTintColor="white"
                    >
                        <TabBar.Item
                            title="首页"
                            key="home"
                            icon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selectedIcon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={''}
                            />
                            }
                            selected={this.state.selectedTab === '1'}
                            className='active'
                            onPress={() => {
                                this.setState({
                                    selectedTab: '1',
                                });
                                sessionStorage.setItem('selectedTab', '1');
                            }}
                        >
                            <Home/>
                        </TabBar.Item>
                        <TabBar.Item
                            title="分类"
                            key="category"
                            icon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selectedIcon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selected={this.state.selectedTab === '2'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '2',
                                });
                                sessionStorage.setItem('selectedTab', '2');
                            }}
                        >
                            <Category/>
                        </TabBar.Item>
                        <TabBar.Item
                            title="购物车"
                            key="goodsCar"
                            icon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selectedIcon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selected={this.state.selectedTab === '3'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '3',
                                });
                                sessionStorage.setItem('selectedTab', '3');
                            }}
                        >
                            <GoodsCar/>
                        </TabBar.Item>
                        <TabBar.Item
                            title="我的"
                            key="user"
                            icon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selectedIcon={<img style={{
                                width: '22px',
                                height: '22px',
                            }} src={img}
                            />
                            }
                            selected={this.state.selectedTab === '4'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '4',
                                });
                                sessionStorage.setItem('selectedTab', '4');
                            }}
                        >
                            <User/>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        );
    }
}
