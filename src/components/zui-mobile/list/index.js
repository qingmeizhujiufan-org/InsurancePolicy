/**
 * Created by zhongzhenga on 2019/3/13.
 */
import React from 'react';
import {List} from 'antd-mobile';
import './index.less';

class Index extends React.Component {
    render() {
        const {
            children,
            ...restProps
        } = this.props;
        return (
            <List
                {...restProps}
            >{children}</List>
        )
    }
}

Index.defaultProps = {
    className: 'zui-list',
};

Index.Item = List.Item;
Index.Item.Brief = List.Item.Brief;
Index.Item.defaultProps.className = 'zui-list-item';

export default Index;
