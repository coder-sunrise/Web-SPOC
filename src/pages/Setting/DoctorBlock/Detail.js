import React, { PureComponent } from 'react'
import DoctorBlock from '../../Reception/BigCalendar/components/form/DoctorBlock'
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
