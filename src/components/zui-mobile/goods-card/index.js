/**
 * Created by wangwei on 2019/3/11.
 */
import React, {Component} from 'react';
import {Card, List, TextareaItem, Stepper} from 'antd-mobile';
import {shiftThousands} from 'Utils/util';
import {createForm} from 'rc-form';
import './index.less';

const Item = List.Item;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shopDetail: {}
        };
    }

    componentWillMount() {
    }

    onChange = (val) => {
    }


    render() {
        const {shopDetail} = this.state;
        const {getFieldProps, getFieldError} = this.props.form;

        return (
            <Card className='goods-card'>
                <Card.Header
                    title='安徽商铺'
                    thumb={
                        <div className='goods-store-logo'>
                            {
                                shopDetail.shopPic && shopDetail.shopPic.imgSrc ?
                                    (
                                        <img
                                            src={shopDetail.shopPic && shopDetail.shopPic.imgSrc}
                                            alt=""/>
                                    ) : (
                                        shopDetail.shopName && shopDetail.shopName.slice(0, 2)
                                    )
                            }
                        </div>
                    }
                    // extra={<span>this is extra</span>}
                />
                <Card.Body>
                    <div className='goods-body'>
                        <img src={''} alt=""/>
                        <div>
                            <div>1111</div>
                            <div>【现货】&nbsp;<span>库存1件</span></div>
                            <div>¥35.00</div>
                        </div>
                    </div>
                    <form>
                        <List>
                            <Item
                                extra={
                                    <Stepper
                                        {...getFieldProps('number', {
                                                rules: [
                                                    {required: true, message: '请选择购物数量'}
                                                ],
                                                initialValue: 1
                                            },
                                        )}
                                        error={!!getFieldError('number')}
                                        style={{width: '100%', minWidth: '100px'}}
                                        min={1}
                                        showNumber
                                        size="small"
                                        onChange={this.onChange}
                                    />}
                            >购买数量</Item>
                            <TextareaItem
                                rows={3}
                                clear
                                placeholder="选填，请给卖家留言"
                            />
                        </List>
                    </form>
                </Card.Body>
                <Card.Footer
                    extra=
                        {
                            <div className='foot-right'>
                                <div className='foot-right-one'>共1件商品</div>
                                <div className='foot-right-two'>小计：<span>￥ 35:00</span></div>
                            </div>
                        }/>
            </Card>
        )
    }
}

const GoodsCard = createForm()(Index);

export default GoodsCard;
