/**
 * Created by zhongzhenga on 2018/12/20.
 */
import React, {Component} from 'react';
import {DatePicker} from 'antd-mobile';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            value,
            ...restProps
        } = this.props;
        let _value = value;
        if (typeof _value === 'string') {
            _value = new Date(value);
        }

        return (
            <DatePicker
                value={_value}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {
    mode: 'date'
}

export default Index;
