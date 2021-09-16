import React, { setState, createRef } from 'react'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { FormControlLabel, Tooltip, Popover } from '@material-ui/core'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'
import { control } from '@/components/Decorator'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  Button,
  CommonModal,
  TextField,
  withFormikExtend,
} from '@/components'
import { Form, Checkbox, Row, Col, Tabs, Collapse, Radio } from 'antd'
import ChecklistSubject from '@/pages/Setting/Checklist/Details/ChecklistSubject'
import _ from 'lodash'

@control()
class ChecklistModal extends React.Component {
  state = {
    openModal: false,
    currentTab: 0,
    checklistState: [],
  }

  onFieldsChange = values => {
    const { editorRef } = this.props
    const { editorState } = editorRef.props
    //send back to variable
    let output = ''
    if (
      values.length > 0 &&
      values[0].name.length > 0 &&
      typeof values[0].value === 'object'
    ) {
      const id = values[0].name[0]
      const subject = values[0].name[1]
      const observation = values[0].name[2]
      const natures = values[0].value.map(v => ' - ' + v)
      output = `${subject}\n${observation}\n${natures.join('\n')}`
    } else {
      const subject = values[0].name[1]
      const observation = values[0].name[2]
      output = `${subject}\n${observation}\n${values[0].value}`
    }
    console.log(output)
  }

  onCloseModal = () => this.props.onClose()

  onFinish = values => {
    this.updateEditor(values)
  }

  updateEditor = values => this.props.onConfirm(values)

  render() {
    const {
      selectedChecklist,
      editorRef,
      onConfirm,
      onClose,
      open,
    } = this.props
    // console.log('selectedChecklist', selectedChecklist)
    return (
      <CommonModal open={open} title='Checklist' onClose={this.onCloseModal}>
        <Form
          name='selectedChecklist'
          ref={this.formRef}
          // onFieldsChange={this.onFieldsChange}
          onFinish={this.onFinish}
        >
          <Tabs defaultActiveKey='100'>
            {_.orderBy(
              selectedChecklist.checklistSubject,
              ['sortOrder'],
              ['asc'],
            ).map((subject, index) => {
              let a = (index + 1) * 100
              return (
                <Tabs.TabPane tab={subject.displayValue} key={a}>
                  <Collapse
                    defaultActiveKey={[
                      ...Array(subject.checklistObservation.length).keys(),
                    ].map(ind => (ind + 1) * 10 + a)}
                  >
                    {subject.checklistObservation.map((observation, index) => {
                      const i = (index + 1) * 10 + a
                      const {
                        checklistNature,
                        displayValue,
                        isHasMultiNature,
                        isHasRemark,
                      } = observation
                      return (
                        <Collapse.Panel header={displayValue} key={i}>
                          <Form.Item
                            name={[subject.displayValue, displayValue]}
                          >
                            {isHasMultiNature ? (
                              <Checkbox.Group>
                                {checklistNature.map((nature, index) => {
                                  return (
                                    <Checkbox
                                      value={nature.displayValue}
                                      style={{ lineHeight: '32px' }}
                                    >
                                      {nature.displayValue}
                                    </Checkbox>
                                  )
                                })}
                              </Checkbox.Group>
                            ) : (
                              <Radio.Group>
                                {checklistNature.map((nature, index) => {
                                  return (
                                    <Radio
                                      value={nature.displayValue}
                                      style={{ lineHeight: '32px' }}
                                    >
                                      {nature.displayValue}
                                    </Radio>
                                  )
                                })}
                              </Radio.Group>
                            )}
                          </Form.Item>
                          <Form.Item
                            name={[
                              subject.displayValue,
                              'Remarks',
                              displayValue,
                            ]}
                          >
                            {isHasRemark && <TextField label='Remarks' />}
                          </Form.Item>
                        </Collapse.Panel>
                      )
                    })}
                  </Collapse>
                </Tabs.TabPane>
              )
            })}
          </Tabs>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Insert
            </Button>
          </Form.Item>
        </Form>
      </CommonModal>
    )
  }
}

export default withStyles(regularFormsStyle, { withTheme: true })(
  ChecklistModal,
)
