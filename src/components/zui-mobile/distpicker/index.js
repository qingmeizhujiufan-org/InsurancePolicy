/**
 * Created by zhongzhenga on 2019/3/9.
 */
import React, {Component} from 'react';
import {Picker} from 'antd-mobile';
import _isFunction from 'lodash/isFunction';
import district from './district';
import jsonData from './list.json';

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
        let selectData = [];
        value.map(item => {
            for (let key in jsonData) {
                if (key.toString() === item) {
                    selectData.push({
                        value: item,
                        label: jsonData[key]
                    });
                }
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
        let _value = value || [];
        _value = _value.map(item => item.value);

        return (
            <Picker
                data={district}
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
    value: [],
}
export default Index;
