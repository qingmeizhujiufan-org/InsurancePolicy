/**
 * Created by zhongzhenga on 2018/8/14.
 */
import React, {Component} from 'react';
import {InputItem} from 'antd-mobile';
import {shiftThousands} from 'Utils/util';
import _isFunction from 'lodash/isFunction';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: undefined,
            inputEdit: false
        };
    }

    onChange = value => {
        let {inputValue} = this.state;
        const {thousandsNumber} = this.props;

        if (thousandsNumber) {
            /* 正则匹配浮点数 */
            const reg = new RegExp("^(-?\\d+)(\\.\\d+)?$");
            if (value !== '' && value.indexOf('.') === value.length - 1) {
                inputValue = value;
            } else if (reg.exec(value)) {
                inputValue = value;
            } else {
                if (value === '') inputValue = undefined;
            }
        } else {
            inputValue = value;
        }

        this.setState({inputValue});

        if (_isFunction(this.props.onChange)) this.props.onChange(thousandsNumber ? (!isNaN(inputValue) ? parseFloat(inputValue) : undefined) : inputValue);
    }

    onFocus = value => {
        let {inputValue} = this.state;
        const {editable} = this.props;
        if (editable === false) return;
        this.setState({inputEdit: true});
        if (_isFunction(this.props.onFocus)) this.props.onFocus(inputValue);
    }

    onBlur = value => {
        const {thousandsNumber, maxNumber} = this.props;
        let inputValue = parseFloat(value) <= maxNumber ? parseFloat(value) : maxNumber;
        if (thousandsNumber && value !== '') {
            this.setState({
                inputValue,
                inputEdit: false
            });
        }
        if (_isFunction(this.props.onBlur)) this.props.onBlur(inputValue);
    }

    render() {
        let {
            value,
            thousandsNumber,
            precision,
            onChange,
            onFocus,
            onBlur,
            ...restProps
        } = this.props;
        const {inputValue, inputEdit} = this.state;

        value = inputValue || value;
        if (!isNaN(parseFloat(value)) && thousandsNumber && !inputEdit) {
            value = shiftThousands(parseFloat(value), precision);
        }

        return (
            <InputItem
                value={value}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                {...restProps}
            >
            </InputItem>
        )
    }
}

Index.defaultProps = {
    className: 'zui-input-item',
    clear: true,
    placeholder: "请输入",
    thousandsNumber: false,
}
export default Index;
