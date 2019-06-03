/**
 * Created by zhongzhenga on 2019/1/14.
 */
import React, {Component} from 'react';
import {Switch} from 'antd-mobile';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {
            value,
            checked,
            ...restProps
        } = this.props;
        let _checked = checked || value;

        return (
            <Switch
                checked={_checked}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {};

export default Index;
