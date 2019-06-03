import React from 'react';
import './index.less';

import empty from 'Img/empty.png';

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {image, description} = this.props;

        return (
            <div className='zui-empty'>
                <img className='image' src={image} alt=''/>
                <p className='desc'>{description}</p>
            </div>
        );
    }
}

Index.defaultProps = {
    image: empty,
    description: '暂无数据'
};

export default Index;
