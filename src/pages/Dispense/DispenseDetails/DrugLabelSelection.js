import React from 'react'
// common components
import { GridContainer, GridItem } from '@/components'

import {
  DrugLabelSelectionColumns,
  DrugLabelSelectionColumnExtensions,
} from '../variables'
import TableData from './TableData'

class DrugLabelSelection extends React.PureComponent {
  render () {
    const {
      footer,
      handleSubmit,
      prescription, 
      handleDrugLabelSelected,
      handleDrugLabelNoChanged,
    } = this.props  
    const printLabelDisabled = !prescription.some((x) => x.selected === true)
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
