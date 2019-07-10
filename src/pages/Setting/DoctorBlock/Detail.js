import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import classnames from 'classnames'
import DoctorBlock from '../../Reception/BigCalendar/components/form/DoctorBlock'

import { formatMessage, FormattedMessage } from 'umi/locale'
import { Divider, Paper, withStyles, Tooltip } from '@material-ui/core'
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
  DatePicker,
  TimePicker,
  Switch,
  EditableTableGrid2,
  notification,
} from '@/components'

const styles = (theme) => ({})


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
        <DoctorBlock />
      </React.Fragment>
    )
  }
}

export default Detail
