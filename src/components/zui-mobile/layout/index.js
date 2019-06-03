/**
 * Created by zhongzhenga on 2018/12/27.
 */
import React, {Component} from 'react';
import Content from './part/content';
import Footer from './part/footer';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            className,
            withFooter,
            children
        } = this.props;
        let _content, _footer;
        if (children instanceof Object) {
            _content = children;
        } else if (children instanceof Array) {
            _content = children[0];
            _footer = children[1];
        }

        return (
            <div className={`zui-layout${className ? (' ' + className) : ''}${withFooter ? ' with-footer' : ''}`}>
                {_content}
                {withFooter ? _footer : null}
            </div>
        )
    }
}

Index.Content = Content;
Index.Footer = Footer;

Index.defaultProps = {
    withFooter: false
};

module.exports = Index;
