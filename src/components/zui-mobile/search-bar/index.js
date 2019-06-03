/**
 * Created by zhongzhenga on 2019/03/31.
 */
import React, {Component} from 'react';
import {SearchBar} from 'antd-mobile';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {
            className,
            ...restProps
        } = this.props;

        return (
            <SearchBar
                className={`zui-search${className ? ' ' + className : ''}`}
                {...restProps}
            />
        )
    }
}

Index.defaultProps = {
}
export default Index;
