import React from 'react';
import PropTypes from 'prop-types';
import {Flex, Carousel} from 'antd-mobile';
import {Layout} from 'zui-mobile';
import '../index.less';
import DocumentTitle from "react-document-title";
import axios from 'Utils/axios';
import restUrl from "RestUrl";

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    };

    componentWillMount() {
    }

    componentDidMount() {
    }

    showHotel = id => {
        this.context.router.push(`/hotel/detail/${id}`);
    }

    showTravel = id => {
        this.context.router.push(`/travel/detail/${id}`);
    }

    userCenter = () => {
        this.context.router.push(`/personal`);
    }

    render() {
        const {} = this.state;

        return (
            <DocumentTitle title='保险微信平台'>
                <Layout className="home">
                    <Layout.Content>
                    </Layout.Content>
                </Layout>
            </DocumentTitle>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;
