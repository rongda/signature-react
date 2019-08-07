import React from 'react'
import { Form, Row, Col, Input, Radio, Select, InputNumber, Upload, Button } from 'antd'
import apps from '../api/apps'

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
        onSubmit(values)
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
    const { getFieldDecorator } = form
    console.log('info', info)
    let btn = '发布'
    if (isModify) {
      btn = '修改'
    }
    if (isUpdate) {
      btn = '更新'
    }
    return (
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
            }],
            normalize: value => value ? value.replace(/(^\s*)|(\s*$)/g, '') : value // 禁止输入空格
          })(
            <Input
              addonAfter={'.roda.wang'}
              placeholder='自定义主页地址'
              autoComplete={'off'}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'消息推送'}>
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
        </FormItem>
        <FormItem {...formItemLayout} label={'应用类别'}>
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
        <FormItem {...formItemLayout} label={'评分数显示'}>
          {getFieldDecorator('rate', {
            initialValue: info ? info.rate : 0,
            rules: [{
              required: true,
              message: '请填写分数'
            }]
          })(
            <InputNumber min={0} max={10} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'应用介绍'}>
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
            getValueFromEvent: this.normFile
          })(
            <Upload action='/upload.do' listType='picture'>
              <Button type='primary'>上传</Button>
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
    )
  }
}

export default Form.create()(AddAppForm)
