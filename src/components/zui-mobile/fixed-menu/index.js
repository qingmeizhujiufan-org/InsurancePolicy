/**
 * Created by zhongzhenga on 2018/11/26.
 */

'use strict';

import React from 'react';
import {Icon} from "antd-mobile";
import PropTypes from 'prop-types';

import './index.less';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    showSubMenu = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        let {position, size, radius, onClick, subMenu} = this.props;
        const {open} = this.state;
        let points = [], point_x, point_y;
        if (subMenu) {
            const len = subMenu.length;
            if (len === 1) {
                points = [{
                    x: Math.sqrt(2) * radius / 2,
                    y: Math.sqrt(2) * radius / 2
                }];
            } else if (len === 2) {
                points = [{
                    x: Math.sin(15 * 2 * Math.PI / 360) * radius,
                    y: Math.cos(15 * 2 * Math.PI / 360) * radius
                }, {
                    x: Math.cos(15 * 2 * Math.PI / 360) * radius,
                    y: Math.sin(15 * 2 * Math.PI / 360) * radius
                }];
            } else if (len === 3) {
                points = [{
                    x: 0,
                    y: radius
                }, {
                    x: Math.sqrt(radius * radius / 2),
                    y: Math.sqrt(radius * radius / 2)
                }, {
                    x: radius,
                    y: 0
                }];
            } else {
                throw new Error('YYFixedMenu当前最多支持 3 个子菜单');
            }
        }

        return (
            <div
                className='zui-fixedmenu'
                style={{
                    right: position === 'right' ? 25 : null,
                    left: position === 'left' ? 25 : null,
                    width: size,
                    height: size
                }}
            >
                <div className='zui-fixedmenu-wrap' onClick={subMenu ? this.showSubMenu : onClick}>
                    <Icon
                        type='plus'
                        className={`zui-fixedmenu-wrap-icon${open ? ' active' : ''}`}
                    />
                </div>
                <div className={`zui-fixedmenu-submenu${open ? ' active' : ''}`}>
                    <div className='submenu-wrap'>
                        {
                            subMenu && subMenu.map((item, index) => {
                                const _item_size = item.size || 40;
                                point_x = open ? (position === 'right' ? -points[index].x : points[index].x) : 0;
                                point_y = open ? -points[index].y : 0;

                                return (
                                    <div
                                        key={index}
                                        className={`submenu-wrap-item`}
                                        style={{
                                            left: (size - _item_size) / 2,
                                            top: (size - _item_size) / 2,
                                            width: _item_size,
                                            height: _item_size,
                                            backgroundColor: item.bgColor,
                                            transform: `translate3d(${point_x}px, ${point_y}px, 0)`
                                        }}
                                        onClick={item.event}
                                    >
                                        {item.icon}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Index.defaultProps = {
    /* 主菜单位置 */
    position: 'right',
    /* 主菜单大小 */
    size: 56,
    /* 弧度半径 */
    radius: 80,
}

Index.propTypes = {
    /* 主菜单点击事件 */
    onClick: PropTypes.func,
    /* 子菜单 */
    subMenu: PropTypes.arrayOf(PropTypes.object),
}

export default Index;

