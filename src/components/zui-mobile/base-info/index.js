import React from 'react';
import './index.less';

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var _class = this.props.className || '';
        var _className = `zui-list-unstyled base-info ${_class}`;
        const {style, baseInfoList, onClick} = this.props;

        return (
            <ul
                style={style}
                className={_className}
                onClick={onClick}
            >
                {
                    baseInfoList && baseInfoList.map((item, index) => {
                        return <li key={index}>
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                        </li>
                    })
                }
            </ul>
        );
    }
}

export default Index;
