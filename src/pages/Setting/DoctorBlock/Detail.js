import React, { PureComponent } from 'react'
import * as Yup from 'yup'
import DoctorBlock from '@/pages/Reception/Appointment/components/form/DoctorBlock'
// import Edit from '@material-ui/icons/Edit'
// import Delete from '@material-ui/icons/Delete'
// import {
//   GridContainer,
//   GridItem,
//   Button,
//   TextField,
//   Checkbox,
//   Select,
//   ProgressButton,
//   Switch,
//   EditableTableGrid,
//   notification,
// } from '@/components'

const styles = (theme) => ({})
const DoctorFormValidation = Yup.object().shape({
  doctorBlockUserFk: Yup.string().required(),
  durationHour: Yup.string().required(),
  durationMinute: Yup.string().required(),
  eventDate: Yup.string().required(),
  eventTime: Yup.string().required(),
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

    return (
      <React.Fragment>
        <DoctorBlock validationSchema={DoctorFormValidation} />
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
