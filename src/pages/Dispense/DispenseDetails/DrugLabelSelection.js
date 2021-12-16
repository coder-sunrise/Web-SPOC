import React, { Fragment } from 'react'
// common components
import { GridContainer, GridItem, CheckboxGroup } from '@/components'
import { connect } from 'dva'

import {
  DrugLabelSelectionColumns,
  DrugLabelSelectionColumnExtensions,
} from '../variables'
import TableData from './TableData'

@connect(({ clinicSettings, dispense }) => ({
  clinicSettings,
  dispense,
}))
class DrugLabelSelection extends React.PureComponent {
  state = {
    printlanguage: [],
    selectedRows: [],
    confirmEnabled: false,
    languageSelected: false,
  }
  componentDidMount = () => {
    // this.props
    //   .dispatch({
    //     type: 'dispense/queryDrugLabelList',
    //     payload: {
    //       id: pharmacyDetails.entity?.visitFK,
    //     },
    //   })
    //   .then(data => {
    //     if (data) {
    //       setDrugLeafletData(data)
    //       setShowLeafletSelectionPopup(true)
    //     }
    //   })
  }
  render() {
    const {
      footer,
      handleSubmit,
      prescription,
      clinicSettings,
      selectedLanguage,
      handleDrugLabelSelected,
      handleDrugLabelNoChanged,
      handlePrintOutLanguageChanged,
    } = this.props
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings
    const showDrugWarning = !prescription.some(x => x.selected === true)
    const showLanguageWarning = selectedLanguage.length == 0
    const printLabelDisabled =
      !prescription.some(x => x.selected === true) || showLanguageWarning
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
            {true && (
              <Fragment>
                <span>Print In: </span>
                <div style={{ width: 150, display: 'inline-block' }}>
                  <CheckboxGroup
                    displayInlineBlock={true}
                    value={selectedLanguage}
                    options={[
                      { value: 'EN', label: 'EN' },
                      { value: 'JP', label: 'JP' },
                    ]}
                    onChange={v => {
                      handlePrintOutLanguageChanged(v.target.value)
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
