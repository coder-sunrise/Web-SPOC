import React, { useState, useEffect } from 'react'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import { Paper, Divider } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import FilterList from '@material-ui/icons/FilterList'
import moment from 'moment'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  Select,
  ButtonSelect,
} from '@/components'
import { queryList } from '@/services/common'
import { DiagnosisSelect } from '@/components/_medisys'

const filterOptions = [
  {
    value: 'isChasAcuteClaimable',
    name: 'CHAS Chronic',
  },
  {
    value: 'isChasChronicClaimable',
    name: 'CHAS Acute',
  },
  {
    value: 'isHazeClaimable',
    name: 'Haze',
  },
]

const DiagnosisItem = ({
  codetable,
  dispatch,
  theme,
  index,
  arrayHelpers,
  diagnosises,
  classes,
  values,
  consultation,
  ...props
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const [
    ctComplicationPairedWithDiag,
    setCtComplicationPairedWithDiag,
  ] = useState([])

  const [
    showPersistMsg,
    setShowPersistMsg,
  ] = useState(false)

  const { form } = arrayHelpers

  const onDiagnosisChange = (v, op) => {
    const { setFieldValue, values: vals, setValues } = form
    const { entity } = consultation
    if (op) {
      vals.corDiagnosis[index].diagnosisDescription = op.displayvalue
      vals.corDiagnosis[index].diagnosisCode = op.code
      vals.corDiagnosis[index].diagnosisICD10AMFK = op.iCD10AMFK
      vals.corDiagnosis[index].diagnosisICD10AMCode = op.iCD10AMDiagnosisCode
      vals.corDiagnosis[index].diagnosisICD10AMName = op.iCD10AMDiagnosisName
      if (op.complication && op.complication.length) {
        setCtComplicationPairedWithDiag(op.complication)
      } else {
        vals.corDiagnosis[index].complication = []
        vals.corDiagnosis[index].corComplication = []

        setCtComplicationPairedWithDiag([])
      }
      setValues(vals)
      entity.corDiagnosis = vals.corDiagnosis
      dispatch({
        type: 'consultation/updateState',
        payload: {
          entity,
        },
      })
    }
  }
  const onDataSouceChange = (data) => {
    if (
      form.values.corDiagnosis[index] &&
      form.values.corDiagnosis[index].diagnosisFK
    ) {
      const { diagnosisFK } = form.values.corDiagnosis[index]
      const ctsnomeddiagnosis = data || []
      // const { ctcomplication } = codetable
      const diagnosis = ctsnomeddiagnosis.find(
        (item) => parseInt(item.id, 10) === parseInt(diagnosisFK, 10),
      )
      if (diagnosis) {
        setCtComplicationPairedWithDiag(diagnosis.complication || [])
      }
    }
  }
  return (
    <Paper className={classes.diagnosisRow}>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs={6} style={{ paddingRight: 35 }}>
          <Field
            name={`corDiagnosis[${index}].diagnosisFK`}
            render={(args) => (
              <DiagnosisSelect
                onChange={onDiagnosisChange}
                onDataSouceChange={onDataSouceChange}
                filterStyle={{ position: 'absolute', bottom: 2, right: -35 }}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={6} style={{ position: 'relative' }}>
          <Popover
            content={
              <div
                style={{
                  width:
                    form.values.corDiagnosis[index].isNew === true ||
                    !form.values.corDiagnosis[index].defaultIsPersist
                      ? '180px'
                      : '340px',
                }}
              >
                <p
                  style={{
                    paddingLeft: 20,
                    paddingBottom: theme.spacing(2),
                    fontSize: '0.8em',
                  }}
                >
                  {form.values.corDiagnosis[index].isNew === true ||
                  !form.values.corDiagnosis[index].defaultIsPersist ? (
                    'Remove diagnosis?'
                  ) : (
                    'Remove persist diagnosis?'
                  )}
                </p>
                {!form.values.corDiagnosis[index].isNew &&
                form.values.corDiagnosis[index].defaultIsPersist &&
                form.values.corDiagnosis[index].isPersist && (
                  <div
                    style={{
                      fontSize: '0.8em',
                      paddingBottom: theme.spacing(2),
                    }}
                  >
                    Diagnosis will be removed from patient's medical problem
                  </div>
                )}
                <Button
                  onClick={() => {
                    setShow(false)
                  }}
                  variant='outlined'
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  onClick={async () => {
                    const { values: vals } = form
                    const { entity } = consultation
                    vals.corDiagnosis[index].isDeleted = true
                    entity.corDiagnosis = vals.corDiagnosis
                    dispatch({
                      type: 'consultation/updateState',
                      payload: {
                        entity,
                      },
                    })
                    // arrayHelpers.remove(index)
                  }}
                >
                  {form.values.corDiagnosis[index].isNew === true ||
                  !form.values.corDiagnosis[index].defaultIsPersist ? (
                    'Confirm'
                  ) : (
                    'Current Visit'
                  )}
                </Button>
                <Button
                  color='primary'
                  hidden={
                    form.values.corDiagnosis[index].isNew === true ||
                    !form.values.corDiagnosis[index].defaultIsPersist
                  }
                  onClick={() => {
                    // arrayHelpers.remove(index)
                    form.setFieldValue(`corDiagnosis[${index}].isDeleted`, true)
                    form.setFieldValue(
                      `corDiagnosis[${index}].isPermanentDelete`,
                      true,
                    )
                  }}
                >
                  Permanently
                </Button>
              </div>
            }
            trigger='click'
            visible={show}
            onVisibleChange={() => {
              setShow(!show)
            }}
          >
            <Tooltip title='Delete'>
              <Button
                style={{ position: 'absolute', bottom: 0, right: 0 }}
                justIcon
                color='danger'
                size='sm'
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Popover>
        </GridItem>
        {/* <GridItem xs={6}>
          {form.values && (
            <DiagnosisSelect
              mode='multiple'
              value={[
                form.values.corDiagnosis[index].diagnosisFK,
              ]}
              onChange={onDiagnosisChange}
              onDataSouceChange={onDataSouceChange}
            />
          )}
        </GridItem> */}
        <GridItem xs={12}>
          <Field
            name={`corDiagnosis[${index}].complication`}
            render={(args) => {
              const { form: fm, field: fd } = args

              if (
                !fd.value &&
                fm.values.corDiagnosis &&
                fm.values.corDiagnosis[index] &&
                fm.values.corDiagnosis[index].corComplication
              ) {
                fd.value = fm.values.corDiagnosis[index].corComplication.map(
                  (o) => o.complicationFK,
                )
              }
              return (
                <Select
                  label='Complication'
                  mode='multiple'
                  options={ctComplicationPairedWithDiag}
                  labelField='displayValue'
                  valueField='id'
                  maxTagCount={2}
                  disableAll
                  onChange={(v, opts) => {
                    const { setFieldValue } = form
                    setFieldValue(`corDiagnosis[${index}]corComplication`, [])
                    opts.forEach((o, i) => {
                      setFieldValue(
                        `corDiagnosis[${index}]corComplication[${i}]complicationFK`,
                        o.id,
                      )
                    })
                  }}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6}>
          <FastField
            name={`corDiagnosis[${index}].onsetDate`}
            render={(args) => {
              return (
                <DatePicker
                  label='Onset Date'
                  allowClear={false}
                  {...args}
                  onChange={(value) => {
                    const { setFieldValue } = form
                    if (value === '') {
                      setFieldValue(
                        `corDiagnosis[${index}].onsetDate`,
                        moment(),
                      )
                    }
                  }}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6}>
          <div style={{ position: 'relative' }}>
            <FastField
              name={`corDiagnosis[${index}].isPersist`}
              render={(args) => {
                return (
                  <Checkbox
                    inputLabel='Persist'
                    {...args}
                    onChange={({ target }) => {
                      if (
                        target.value === false &&
                        !form.values.corDiagnosis[index].isNew
                      ) {
                        setShowPersistMsg(true)
                      } else {
                        setShowPersistMsg(false)
                      }
                    }}
                  />
                )
              }}
            />
            {showPersistMsg === true ? (
              <div
                style={{
                  fontSize: '0.9em',
                  position: 'absolute',
                  bottom: 2,
                  left: 50,
                }}
              >
                Diagnosis will be removed from patient's medical problem
              </div>
            ) : (
              ''
            )}
          </div>
        </GridItem>
        <GridItem xs={12}>
          <FastField
            name={`corDiagnosis[${index}].remarks`}
            render={(args) => {
              return (
                <TextField label='Remarks' multiline rowsMax={6} {...args} />
              )
            }}
          />
        </GridItem>
      </GridContainer>
    </Paper>
  )
}

export default DiagnosisItem
