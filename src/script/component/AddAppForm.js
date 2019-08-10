import React from 'react'
import { Form, Row, Col, Input, Radio, Select, InputNumber, Spin, Upload, Button, Tooltip, Icon } from 'antd'
import apps from '../api/apps'
import storage from '../utils/storage'

const { getAppCategory } = apps()
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
}

class AddAppForm extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      category: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault()
    const { form, onSubmit } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit({
          ...values,
          pics: values.pics.map(item => {
            // item.name
            if (!item.response) {
              return item.name
            }
            if (item.response && item.response.err_code === 200) {
              return item.response.data.split('/img/')[1]
            } else {
              console.log('error', item.response.err_msg)
            }
          })
        })
      } else {
        console.log('validateFields', err)
      }
    })
  }
  componentDidMount() {
    getAppCategory().then(({ data: category }) => {
      category && this.setState({ category })
    }).catch(error => console.log(error))
  }
  normFile(e) {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  render() {
    const { category } = this.state
    const { form, info, isModify, isUpdate } = this.props
    const { getFieldDecorator, getFieldValue } = form
    console.log('info', info)
    let btn = '发布'
    if (isModify) {
      btn = '修改'
    }
    if (isUpdate) {
      btn = '更新'
    }
    return (
      <Spin tip='Loading...' spinning={info === null}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={7} />
            <Col span={14}>
              <div className='app-item'>
                <img className='square' src={info && info.app_icon} width='90' />
                <div className='app-item-name-ios'>
                  <span>{info && info.app_name}</span>
                  <span className='gray'>版本：{info && info.version}</span>
                  <span className='gray'>大小：{info && info.size}</span>
                </div>
              </div>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label={'主页地址'}>
            {getFieldDecorator('url', {
              initialValue: info ? info.index_url : '',
              rules: [{
                required: true,
                message: '请正确输入主页地址'
              }, {
                pattern: /^[A-Za-z0-9]{2,10}$/,
                message: '主页地址只能由2-10位字母或数字组成'
              }],
              normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
            })(
              <Input
                addonAfter={process.env.url}
                placeholder='自定义主页地址'
                autoComplete={'off'}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(
            <React.Fragment>
              <span>消息推送</span>&nbsp;
              <Tooltip placement='bottom' title={'消息推送可提高用户活跃度及应用留存率，但会影响第三方(微信、QQ等)登录。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </React.Fragment>
          )}>
            {getFieldDecorator('notice_type', {
              initialValue: '1',
              rules: [{
                required: true,
                message: '请选择消息推送'
              }]
            })(
              <Radio.Group>
                <Radio value='1'>直接推送（可能会影响微信、QQ等第三方的登录）</Radio>
                <Radio value='2'>证书推送（请在推送时配置p12证书文件）</Radio>
              </Radio.Group>
            )}
            <span style={{ color: '#f72c2c' }}>请谨慎选择！</span>&nbsp;
            <Tooltip placement='bottom' title={'已上传的应用再修改消息提醒方式，可能会导致已安装用户无法正常使用。需要重新上传应用包，选择消息推送后让用户重新下载'}>
              <Icon type='question-circle' />
            </Tooltip>
          </FormItem>
          <FormItem {...formItemLayout} label={(
            <React.Fragment>
              <span>应用类别</span>&nbsp;
              <Tooltip placement='bottom' title={'您想要展示给用户的应用类别'}>
                <Icon type='question-circle' />
              </Tooltip>
            </React.Fragment>
          )}>
            {getFieldDecorator('category_id', {
              initialValue: info ? info.category_id : 0,
              rules: [{
                required: true,
                message: '请选择应用类别'
              }]
            })(
              <Select placeholder='选择类别'>
                {category.map((item, index) => (
                  <Option key={index} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(
            <React.Fragment>
              <span>评分数显示</span>&nbsp;
              <Tooltip placement='bottom' title={'您想要展示给用户的评分数量，没有具体评价内容且分数固定为4.9分，您只需填写一个看似真实的评价数展示给用户，表现您的应用已有如此多的下载量。'}>
                <Icon type='question-circle' />
              </Tooltip>
            </React.Fragment>
          )}>
            {getFieldDecorator('rate', {
              initialValue: info ? info.rate : 0,
              rules: [{
                required: true,
                message: '请填写分数'
              }]
            })(
              <InputNumber min={0} max={5} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(
            <React.Fragment>
              <span>应用介绍</span>&nbsp;
              <Tooltip placement='bottom' title={'您想要展示给用户对此应用的详细介绍'}>
                <Icon type='question-circle' />
              </Tooltip>
            </React.Fragment>
          )}>
            {getFieldDecorator('description', {
              initialValue: info ? info.description : '',
              rules: [{
                required: true,
                message: '请填写应用介绍'
              }]
            })(
              <TextArea rows={4} placeholder='应用详细介绍，500字以内' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'详情图'}>
            {getFieldDecorator('pics', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: info && info.pics ? info.pics.map(item => ({
                ...item,
                uid: item.id.toString()
              })) : []
              // initialValue: [{
              //   uid: '1',
              //   name: 't0120b2f23b554b8402.jpg',
              //   url: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg'
              // }]
            })(
              <Upload
                // multiple
                accept='image/*'
                listType='picture'
                action={`${process.env.api}/app/upload/pic`}
                headers={{ 'token': storage.getToken() }}
              >
                <Button
                  type='primary'
                  disabled={getFieldValue('pics').length >= 5}
                >上传</Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'下载单价'}>
            {getFieldDecorator('price', {
              initialValue: info ? info.price : 10
            })(
              <Input disabled />
            )}
          </FormItem>
          <Row>
            <Col span={7} />
            <Col span={14}>
              <Button type='primary' htmlType='submit'>
                {`${btn}应用`}
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(AddAppForm)
