import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, DatePicker } from 'antd'
import moment from 'moment'
import { DATE_FORMATE } from '../../static/constant'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

@connect(
  state => ({
    source: state.appItem.source
  }),
  null
)
class TabBarExtra extends React.Component {
  constructor() {
    super(...arguments)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(type, value) {
    const { form, filterData } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        filterData({
          ...values,
          [type]: value
        })
      }
    })
  }
  render() {
    const { form, source, isShowApp } = this.props
    const { getFieldDecorator } = form
    return (
      <Form layout='inline'>
        {isShowApp && (
          <FormItem>
            {getFieldDecorator('id', {
              initialValue: 'all'
            })(
              <Select
                placeholder='选择应用'
                style={{ minWidth: '120px' }}
                onChange={value => this.handleChange('id', value)}
              >
                <Option value={'all'}>全部应用</Option>
                {source.map((item, index) => (
                  <Option key={index} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        <FormItem>
          {getFieldDecorator('time', {
            initialValue: [
              moment().startOf('month'),
              moment().endOf('day')
            ]
          })(
            <RangePicker
              format={DATE_FORMATE}
              onChange={value => this.handleChange('time', value)}
            />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(TabBarExtra)
