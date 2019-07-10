import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Tooltip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Switch,
  EditableTableGrid2,
  notification,
} from '@/components'

const styles = (theme) => ({})

@withFormik({
  mapPropsToValues: ({ settingPublicHoliday }) =>
  settingPublicHoliday.entity || settingPublicHoliday.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    dates: Yup.array().of(Yup.date()).min(2).required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'settingPublicHoliday/upsert',
        payload: values,
      })
      .then((r) => {
        if (r && r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'PublicHolidayModal',
})
class Detail extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.props
    setFieldValue('items', rows)
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values } = props
    console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => <TextField label='Code' {...args} />}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='dates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='Effective End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
