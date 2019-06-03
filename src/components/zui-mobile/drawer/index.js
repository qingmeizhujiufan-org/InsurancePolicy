/**
 * Created by zhongzhenga on 2018/12/28.
 */
import React, {Component} from 'react';
import {Drawer} from 'antd-mobile';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            ...restProps
        } = this.props;

        return (
            <Drawer
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {
    className: 'zui-drawer',
    position: 'right'
};

export default Index;
