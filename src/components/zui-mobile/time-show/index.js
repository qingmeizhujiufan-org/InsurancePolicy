/**
 * Created by zhongzhenga on 2019/1/14.
 */
import React, { Component } from 'react';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cur: 0
        };
    }
    componentDidMount() {
        const begin = this.props.time;
        this.setState({
            cur: begin
        }, () => {
            this.timeDown();
        })
    }

    //组件卸载取消倒计时
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    timeDown = () => {
        this.timer = setInterval(() => {
            const { cur } = this.state;

            if (cur > 0) {
                this.setState({
                    cur: cur - 1
                })
            } else {
                clearInterval(this.timer)
            }
        }, 1000)

    }

    render() {
        const { cur } = this.state

        return (
            <span>{cur}S</span>
        )
    }
}

Index.defaultProps = {
    time: 60
};

export default Index;
