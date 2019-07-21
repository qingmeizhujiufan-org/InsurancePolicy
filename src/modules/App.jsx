import React from 'react';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

//将状态写入属性
function mapStateToProps(state) {
    return {
        isShow: state.isShow
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShow: this.props.isShow || false
        };
    }

    render() {
        return (
            <DocumentTitle title='保联汇'>
                {this.props.children}
            </DocumentTitle>
        );
    }
}

module.exports = App;
