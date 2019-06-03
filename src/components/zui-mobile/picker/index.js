/**
 * Created by zhongzhenga on 2018/12/11.
 */
import React, {Component} from 'react';
import {Picker} from 'antd-mobile';
import _isFunction from 'lodash/isFunction';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps = nextProps => {
        if ('data' in nextProps) {
            if (nextProps['data'].length !== this.props['data'].length) {
                if (nextProps['data'][0].selectObj) {
                    // this.setState({selectData: nextProps['data'][0].selectObj});
                }
            } else {

            }
        }
    }

    onChange = value => {
        let {data} = this.props;
        let selectData;
        data.map(item => {
            if (item.value === value[0]) {
                selectData = item.selectObj || item.value;
            }
        });

        if (_isFunction(this.props.onChange)) this.props.onChange(selectData);
    }

    render() {
        let {
            data,
            value,
            onChange,
            ...restProps
        } = this.props;
        let _value = value;
        if (typeof value === 'string') _value = [value];
        if (typeof value === 'object') _value = value && value.code && [value.code];

        return (
            <Picker
                data={data}
                value={_value}
                onChange={this.onChange}
                {...restProps}
            >
                {this.props.children}
            </Picker>
        )
    }
}

Index.defaultProps = {
    data: [],
    value: [],
    cols: 1
}
export default Index;
