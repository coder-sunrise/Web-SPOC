import React, { useState } from 'react'
import { Field, FastField, withFormik } from 'formik'
import _ from 'lodash'
import { Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import * as Yup from 'yup'
import { Alert } from 'antd'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  RadioGroup,
} from '@/components'
import { ICD10DiagnosisSelect } from '@/components/_medisys'
import OrderText from './OrderText'
import { hasValue } from '../PatientHistory/config'

const ICD10DiagnosisItem = ({
  dispatch,
  theme,
  index,
  arrayHelpers,
  classes,
  consultation,
  favouriteDiagnosis,
  favouriteDiagnosisMessage,
  saveDiagnosisAsFavourite,
  uid,
  icD10DiagnosisCode,
  defaultLanguage,
  orders,
}) => {
  const [show, setShow] = useState(false)

  const [showPersistMsg, setShowPersistMsg] = useState(false)

  const [persistMsg, setPersitMsg] = useState('')

  const { form } = arrayHelpers

  const onDiagnosisChange = (v, op) => {
    const { values: vals, setValues } = form
    const { entity } = consultation
    if (op) {
      vals.corDiagnosis[index].icD10DiagnosisDescription = op.displayvalue
      vals.corDiagnosis[index].icD10DiagnosisCode = op.code
      vals.corDiagnosis[index].icD10JpnDiagnosisDescription = op.JpnDisplayValue
    } else {
      vals.corDiagnosis[index].iCD10DiagnosisCode = undefined
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
  const handelSaveDiagnosisAsFavourite = () => {
    saveDiagnosisAsFavourite(icD10DiagnosisCode, uid)
  }

  const diagnosisTypeOptions = [
    { label: ' Sickness ', value: 'Sickness' },
    { label: ' Injury ', value: 'Injury' },
  ]

  return (
    <Paper className={classes.diagnosisRow}>
      <GridContainer>
        <GridItem xs={5}>
          <Field
            name={`corDiagnosis[${index}].icD10DiagnosisFK`}
            render={args => (
              <ICD10DiagnosisSelect
                onChange={onDiagnosisChange}
                filterStyle={{
                  position: 'absolute',
                  bottom: -3,
                  right: -160,
                }}
                from='Consultaion'
                defaultLanguage={defaultLanguage}
                selectDiagnosisCode={icD10DiagnosisCode}
                favouriteDiagnosis={favouriteDiagnosis}
                handelSaveDiagnosisAsFavourite={handelSaveDiagnosisAsFavourite}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={5} style={{ right: 50, bottom: 100 }}>
          {favouriteDiagnosisMessage && (
            <Alert
              message={favouriteDiagnosisMessage}
              type='warning'
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                overflow: 'hidden',
                lineHeight: '25px',
                fontSize: '0.85rem',
              }}
            />
          )}
          {showPersistMsg && (
            <Alert
              message={persistMsg}
              type='warning'
              style={{
                position: 'relative',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                overflow: 'hidden',
                lineHeight: '20px',
                fontSize: '0.85rem',
              }}
            />
          )}
        </GridItem>
        <GridItem xs={1} style={{ position: 'relative', right: -50 }}>
          <Popover
            content={
              <div
                style={{
                  width:
                    form.values.corDiagnosis[index].isNew === true ||
                    !form.values.corDiagnosis[index].defaultIsPersist
                      ? '180px'
                      : '400px',
                }}
              >
                <p
                  style={{
                    color: 'orange',
                  }}
                >
                  {form.values.corDiagnosis[index].isNew === true ||
                  !form.values.corDiagnosis[index].defaultIsPersist
                    ? 'Remove diagnosis?'
                    : 'Remove persist diagnosis?'}
                </p>
                {!form.values.corDiagnosis[index].isNew &&
                  form.values.corDiagnosis[index].defaultIsPersist &&
                  form.values.corDiagnosis[index].isPersist && (
                    <div style={{ marginBottom: 20 }}>
                      Diagnosis will be removed from patient's medical problem.
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
                  }}
                >
                  {form.values.corDiagnosis[index].isNew === true ||
                  !form.values.corDiagnosis[index].defaultIsPersist
                    ? 'Confirm'
                    : 'Current Visit'}
                </Button>
                <Button
                  color='primary'
                  hidden={
                    form.values.corDiagnosis[index].isNew === true ||
                    !form.values.corDiagnosis[index].defaultIsPersist
                  }
                  onClick={() => {
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
        <GridItem xs={5}>
          <FastField
            name={`corDiagnosis[${index}].onsetDate`}
            render={args => {
              return <DatePicker label='Onset Date' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={1}>
          <div>
            <FastField
              name={`corDiagnosis[${index}].isPersist`}
              render={args => {
                return (
                  <Checkbox
                    inputLabel='Persist'
                    {...args}
                    onChange={({ target }) => {
                      if (target.value) {
                        setShowPersistMsg(true)
                        setPersitMsg(
                          'Diagnosis added to patient’s persistent diagnosis',
                        )
                        setTimeout(() => {
                          setShowPersistMsg(false)
                        }, 3000)
                      } else {
                        setPersitMsg(
                          'Diagnosis removed from patient’s persistent diagnosis',
                        )
                        setShowPersistMsg(true)
                        setTimeout(() => {
                          setShowPersistMsg(false)
                        }, 3000)
                      }
                    }}
                  />
                )
              }}
            />
          </div>
        </GridItem>
        <GridItem xs={5}>
          <Field
            name={`corDiagnosis[${index}].diagnosisType`}
            render={args => (
              <RadioGroup
                label='Type'
                options={diagnosisTypeOptions}
                onChange={({ target }) => {
                  form.setFieldValue(
                    `corDiagnosis[${index}].diagnosisType`,
                    target.value,
                  )
                }}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={5}>
          <FastField
            name={`corDiagnosis[${index}].firstVisitDate`}
            render={args => {
              return <DatePicker label='First Visit Date' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={1} />
        <GridItem xs={5}>
          <FastField
            name={`corDiagnosis[${index}].validityDays`}
            render={args => {
              return (
                <TextField
                  label='Validity (Days)'
                  onChange={({ target }) => {
                    form.setFieldValue(
                      `corDiagnosis[${index}].validityDays`,
                      target.value || null,
                    )
                  }}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem
          xs={12}
          container
          style={{ paddingRight: 40, position: 'relative' }}
        >
          <FastField
            name={`corDiagnosis[${index}].remarks`}
            render={args => {
              return (
                <TextField label='Remarks' multiline rowMax={6} {...args} />
              )
            }}
          />
          <div style={{ position: 'absolute', bottom: 2, right: 10 }}>
            <OrderText
              orders={orders}
              onSelectItem={selectItem => {
                const remarks = form.values.corDiagnosis[index].remarks
                if (hasValue(remarks) && remarks.trim().length !== '') {
                  form.setFieldValue(
                    `corDiagnosis[${index}].remarks`,
                    `${remarks} ${selectItem}`,
                  )
                } else {
                  form.setFieldValue(
                    `corDiagnosis[${index}].remarks`,
                    selectItem,
                  )
                }
              }}
            />
          </div>
        </GridItem>
      </GridContainer>
    </Paper>
  )
}

export default ICD10DiagnosisItem
