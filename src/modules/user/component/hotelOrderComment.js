import React from 'react';
import PropTypes from 'prop-types';
import {Card, Button, Toast, List, WingBlank, Flex, TextareaItem, ImagePicker} from 'antd-mobile';
import '../index.less';
import {Layout} from "Comps/zui-mobile";
import DocumentTitle from "react-document-title";
import axios from "Utils/axios";
import restUrl from "RestUrl";

const uploadUrl = restUrl.FILE_UPLOAD_HOST + 'attachment/upload';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      room: {},
      text: '',
      files: [],
      initLoading: false
    }
  }

  componentWillMount() {
    this.queryOrderDetail();
  }

  queryOrderDetail = id => {
    Toast.loading('Loading...');
    const param = {
      id: this.props.params.id,
      userId: sessionStorage.userId
    }
    axios.get('hotel/queryOrderDetail', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        if (data.backData) {
          const backData = data.backData;
          this.setState({
            data: backData,
            room: backData.Room,
            hotel: backData.Hotel,
          });
        }
      } else {
        Toast.fail('查询详情失败');
      }
    }).finally(() => {
      Toast.hide()
    });
  }

  onChange = (files, type, index) => {
    console.log(files, type, index);
    if (type === 'add') {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      const data = new FormData();
      data.append('file', files[0].file);
      xhr.send(data);

      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          files[files.length - 1].response = response;
          this.setState({files});
        } else {
          Toast.error(response.backMsg);
        }
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        console.error(error);
      });
    } else {
      this.setState({files});
    }
  }

  onSubmit = () => {
    const {data, text, files} = this.state;
    console.log('data == ', data);
    if (text.trim() === '') {
      Toast.info('评价内容不能为空', 1000);
      return;
    }
    if (text.length < 10) {
      Toast.info('评价内容不能少于10个字', 1);
      return;
    }
    const params = {};
    params.orderId = data.id;
    params.roomId = data.roomId;
    params.userId = sessionStorage.userId;
    params.commentContent = text;
    params.detailPic = files.map(item => item.response.id).join(',');
    console.log('params == ', params);
    Toast.loading('正在提交...');
    axios.post('hotel/comment', params).then(res => res.data).then(data => {
      if (data.success) {
        Toast.success('评价成功', 2, () => {
          this.context.router.replace({
            pathname: '/hotelOrder',
            state: {
              page: 2
            }
          });
        })
      }
    }).catch((err) => {
      Toast.fail('评价失败', 2)
    })
  }

  render() {
    const {data, room, text, files} = this.state;
    return (
      <DocumentTitle title='民宿评价'>
        <Layout className='hotel-comment-order' withFooter>
          <Layout.Content>
            <Card className='detail-card am-card-full'>
              <Card.Header
                title={
                  <Flex className='card-head-title'>
                    <span className='iconfont icon-fangjianxinxi'></span>
                    <div>{room.roomName}</div>
                  </Flex>}
              />
              <Card.Body>
                <TextareaItem
                  value={text}
                  rows={5}
                  placeholder='请对民宿服务进行评价吧'
                  onChange={val => this.setState({text: val})}
                />
                <ImagePicker
                  files={files}
                  onChange={this.onChange}
                  onImageClick={(index, fs) => console.log(index, fs)}
                  selectable={files.length < 7}
                  multiple={false}
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                />
              </Card.Body>
            </Card>
          </Layout.Content>
          <Layout.Footer>
            <WingBlank>
              <Button type="primary" onClick={this.onSubmit}>发 表</Button>
            </WingBlank>
          </Layout.Footer>
        </Layout>
      </DocumentTitle>
    );
  }
}

Index.contextTypes = {
  router: PropTypes.object
}

export default Index;
