import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import {
  TextField,
  NumberInput,
  GridContainer,
  GridItem,
  Button,
  Checkbox,
  OutlinedTextField,
} from '@/components'
import Print from '@material-ui/icons/Print'
import { commonDataReaderTransform } from '@/utils/utils'

import Grid from './Grid'
import NearAddGrid from './NearAddGrid'

const styles = (theme) => ({})
const RefractionForm = ({ current, theme, visitDetails }) => {
  const { formData = {} } = current.corEyeRefractionForm
  const { visitDate, patientName, patientAccountNo } = visitDetails
  const [
    selectRows,
    setSelectRows,
  ] = useState([])
  const handlePrintPrescription = () => {
    const rows = formData.Tests || []
    const selectedRows = rows.filter((r) => selectRows.indexOf(r.id) >= 0)
    if (selectedRows.length !== 1) {
      return
    }
    let nearAdd = formData.NearAdd || {}
    let nearAddData = {}
    let haveNearAdd = false
    for (let k in nearAdd) {
      if (k.startsWith('NearAdd')) {
        nearAddData[k] = nearAdd[k]
        if (
          !haveNearAdd &&
          nearAdd[k] !== '' &&
          nearAdd[k] !== null &&
          nearAdd[k] !== undefined
        )
          haveNearAdd = true
      }
    }
    const reportParameters = {
      ...selectedRows[0],
      visitDate,
      patientName,
      patientAccountNo,
      remarks: formData.TestRemarks,
      haveNearAdd,
      ...nearAddData,
    }

    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: 61,
        reportParameters: {
          isSaved: false,
          reportContent: JSON.stringify(
            commonDataReaderTransform({
              RefractionTestDetails: [
                reportParameters,
              ],
            }),
          ),
        },
      },
    })
  }

  const isDisabledPrint = () => {
    const rows = formData.Tests

    return (
      !rows || rows.filter((r) => selectRows.indexOf(r.id) >= 0).length !== 1
    )
  }

  const selectedRow = (id) => {
    if (selectRows.indexOf(id) >= 0) {
      setSelectRows(selectRows.filter((o) => o !== id))
    } else {
      setSelectRows([
        ...selectRows,
        id,
      ])
    }
  }
  return (
    <div>
      <GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2} style={{ marginTop: '20px' }}>
            <TextField value='Tonometry' text />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <NumberInput
              label='R'
              format='0.0'
              disabled
              suffix='mmHg'
              value={formData.Tenometry ? formData.Tenometry.R : undefined}
            />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <NumberInput
              label='L'
              format='0.0'
              suffix='mmHg'
              value={formData.Tenometry ? formData.Tenometry.L : undefined}
              disabled
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Eye Dominance' text />
          </GridItem>
          <GridItem xs sm={2} md={1}>
            <Checkbox
              checked={
                formData.EyeDominance ? formData.EyeDominance.Left : false
              }
              label='Left'
              disabled
            />
          </GridItem>
          <GridItem xs sm={2} md={1}>
            <Checkbox
              checked={
                formData.EyeDominance ? formData.EyeDominance.Right : false
              }
              label='Right'
              disabled
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Van Herick' text />
          </GridItem>
          <GridItem xs sm={10} md={10}>
            <OutlinedTextField
              label='Van Herick'
              multiline
              maxLength={2000}
              rowsMax={5}
              rows={2}
              value={formData.VanHerick}
              disabled
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2} style={{ marginTop: '20px' }}>
            <TextField value='Pupil Size (scotopic)' text />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <TextField
              label='R'
              maxLength={50}
              disabled
              value={formData.PupilSize ? formData.PupilSize.R : ''}
            />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <TextField
              label='L'
              maxLength={50}
              disabled
              value={formData.PupilSize ? formData.PupilSize.L : ''}
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Remarks' text />
          </GridItem>
          <GridItem xs sm={10} md={10}>
            <OutlinedTextField
              label='Remarks'
              multiline
              maxLength={2000}
              rowsMax={5}
              rows={2}
              disabled
              value={formData.Remarks}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs sm={12} md={12} style={{ alignSelf: 'flex-end' }}>
            {formData.Tests &&
            formData.Tests.length > 0 && (
              <Button
                color='primary'
                icon={null}
                size='sm'
                style={{ margin: theme.spacing(1) }}
                disabled={isDisabledPrint()}
                onClick={() => {
                  handlePrintPrescription()
                }}
              >
                <Print /> Print Spectacle Prescription
              </Button>
            )}
          </GridItem>
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <Grid rows={formData.Tests || []} selectedRow={selectedRow} />
          </GridItem>
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <NearAddGrid rows={formData.NearAdd || {}} />
          </GridItem>
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <OutlinedTextField
              label='Remarks'
              multiline
              maxLength={2000}
              rowsMax={5}
              rows={2}
              value={formData.TestRemarks}
              disabled
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(RefractionForm)
