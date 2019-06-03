/**
 * Created by zhongzhenga on 2018/12/27.
 */
import React, {Component} from 'react';

export default class Index extends Component {
    render() {
        const {
            className,
            ...restProps
        } = this.props;

        return (
            <div
                className={`zui-layout-content${className ? (' ' + className) : ''}`}
                {...restProps}
            />
        )
    }
}
