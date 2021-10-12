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

  onCloseModal = () => this.props.onClose()

  onFinish = values => {
    console.log('onFinish',values)
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
    return (
      <CommonModal open={open} title='Checklist' onClose={this.onCloseModal}>
        <Form
          name='selectedChecklist'
          ref={this.formRef}
          onFinish={this.onFinish}
        >
          <Tabs defaultActiveKey='100'>
            {_.orderBy(
              selectedChecklist.checklistSubject,
              ['sortOrder'],
              ['asc'],
            ).map((subject, index) => {
              let a = (index + 1) * 100
              const orderedObservation = _.orderBy(subject.checklistObservation,['sortOrder'],['asc'])
              return (
                <Tabs.TabPane tab={subject.displayValue} key={a}>
                  <Collapse
                    defaultActiveKey={[
                      ...Array(orderedObservation.length).keys(),
                    ].map(ind => (ind + 1) * 10 + a)}
                  >
                    {orderedObservation.map((observation, index) => {
                      const i = (index + 1) * 10 + a
                      const {
                        checklistNature,
                        displayValue,
                        isHasMultiNature,
                        isHasRemark,
                      } = observation
                      const orderedNature = _.orderBy(checklistNature,['sortOrder'],['asc'])
                      return (
                        <Collapse.Panel header={displayValue} key={i}>
                          <Form.Item
                            name={[
                              subject.displayValue,
                              displayValue,
                              'Nature',
                            ]}
                          >
                            {isHasMultiNature ? (
                              <Checkbox.Group>
                                {orderedNature.map((nature, index) => {
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
                                {orderedNature.map((nature, index) => {
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
                              displayValue,
                              'Remarks',
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
