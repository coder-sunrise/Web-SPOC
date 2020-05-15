import React from 'react'
import * as Yup from 'yup'
// dva
import { connect } from 'dva'
// formik
import { withFormik, FastField } from 'formik'
import { Paper, withStyles } from '@material-ui/core'
// common components
import { TextField, GridContainer, GridItem, notification } from '@/components'
// services
import { changeCurrentUserPassword, changeUserPassword } from '@/services/user'

import {
  DrugLabelSelectionColumns,
  DrugLabelSelectionColumnExtensions,
} from '../variables'
import TableData from './TableData'

class DrugLabelSelection extends React.PureComponent {
  render() {
    const {
      footer,
      handleSubmit,
      prescription,
      codetable,
      handleDrugLabelSelected,
      handleDrugLabelNoChanged,
    } = this.props
    const printLabelDisabled = prescription.find((x) => x.selected === true) === undefined 
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <TableData
              idPrefix='prescription'
              columns={DrugLabelSelectionColumns}
              colExtensions={DrugLabelSelectionColumnExtensions(handleDrugLabelSelected, handleDrugLabelNoChanged)}
              data={prescription}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            cancelProps: {
            },
            confirmProps: {
              disabled: printLabelDisabled,
            },
            onConfirm: handleSubmit,
            confirmBtnText: 'Print',
          })}
      </div>
    )
  }
}

export default DrugLabelSelection
