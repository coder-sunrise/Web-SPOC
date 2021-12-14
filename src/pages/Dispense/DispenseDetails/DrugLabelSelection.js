import React from 'react'
// common components
import { GridContainer, GridItem } from '@/components'
import { connect } from 'dva'

import {
  DrugLabelSelectionColumns,
  DrugLabelSelectionColumnExtensions,
} from '../variables'
import TableData from './TableData'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
class DrugLabelSelection extends React.PureComponent {
  state = {
    printlanguage: [],
    selectedRows: [],
    confirmEnabled: false,
    languageSelected: false,
  }
  render() {
    const {
      footer,
      handleSubmit,
      prescription,
      clinicSettings,
      handleDrugLabelSelected,
      handleDrugLabelNoChanged,
    } = this.props

    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings
    const showDrugWarning =
      this.props.prescription.filter(item =>
        this.state.selectedRows.includes(item.id),
      ).length == 0
    const showLanguageWarning = this.state.printlanguage.length == 0
    const printLabelDisabled = !prescription.some(x => x.selected === true)
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <TableData
              forceRender
              idPrefix='prescription'
              columns={DrugLabelSelectionColumns}
              colExtensions={DrugLabelSelectionColumnExtensions(
                handleDrugLabelSelected,
                handleDrugLabelNoChanged,
              )}
              data={prescription}
            />
          </GridItem>
          <GridItem>
            {secondaryPrintoutLanguage !== '' && (
              <Fragment>
                <span>Print In: </span>
                <div style={{ width: 150, display: 'inline-block' }}>
                  <CheckboxGroup
                    displayInlineBlock={true}
                    value={this.state.printlanguage}
                    options={[
                      { value: 'EN', label: 'EN' },
                      { value: 'JP', label: 'JP' },
                    ]}
                    onChange={v => {
                      this.setState({
                        printlanguage: v.target.value,
                      })
                    }}
                  />
                </div>
                {showDrugWarning && (
                  <div style={{ color: 'red' }}>
                    * Please select at least one drug to print.
                  </div>
                )}
                {showLanguageWarning && (
                  <div style={{ color: 'red' }}>
                    * Please select at least one language to print.
                  </div>
                )}
              </Fragment>
            )}
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            cancelProps: {},
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
