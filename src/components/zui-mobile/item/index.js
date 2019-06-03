/**
 * Created by zhongzhenga on 2018/12/14.
 */
import React, {Component} from 'react';
import {List} from 'antd-mobile';

const Item = List.Item;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {
            value,
            extra,
            ...restProps
        } = this.props;
        let _extra = extra || value;
        if (typeof _extra === 'object') {
            /* 判断当前传入的extra是否为react element */
            if (Symbol.for('react.element') !== _extra.$$typeof) {
                _extra = _extra.name;
            }
        }

        return (
            <Item
                extra={_extra}
                {...restProps}
            >
            </Item>
        )
    }
}

Index.defaultProps = {
    multipleLine: true,
    wrap: true
}
export default Index;
