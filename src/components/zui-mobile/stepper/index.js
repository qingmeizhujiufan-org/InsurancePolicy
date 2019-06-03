/**
 * Created by zhongzhenga on 2019/3/13.
 */
import React from 'react';
import {Stepper} from 'antd-mobile';
import './index.less';

class Index extends React.Component {
    render() {
        const {
            ...restProps
        } = this.props;
        return (
            <Stepper
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {
    className: 'zui-stepper',
    showNumber: true,
};

export default Index;
