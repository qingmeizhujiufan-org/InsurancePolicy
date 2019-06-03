/**
 * Created by zhongzhenga on 2018/12/26.
 */
import React, {Component} from 'react';
import {NavBar, Icon} from 'antd-mobile';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const {
            className,
            ...restProps
        } = this.props;

        return (
            <NavBar
                className={`zui-navbar${className ? (' ' + className) : ''}`}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {
    icon: <Icon type="left"/>,
    leftContent: "",
    mode: "light"
}
export default Index;
