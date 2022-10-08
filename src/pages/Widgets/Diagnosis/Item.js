import React, { useState } from 'react'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import { Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  CodeSelect,
  CheckboxGroup,
} from '@/components'
import { DiagnosisSelect } from '@/components/_medisys'

const filterOptions = [
  {
    value: 'all',
    name: 'All',
  },
]

const DiagnosisItem = ({
  dispatch,
  theme,
  index,
  arrayHelpers,
  classes,
  consultation,
  saveDiagnosisAsFavourite,
  saveCategoryAsFavourite,
  uid,
  favouriteDiagnosisMessage,
  favouriteDiagnosisCategoryMessage,
  favouriteDiagnosis,
  favouriteDiagnosisCategory,
  diagnosisCode,
  currentSelectCategory,
}) => {
  const [show, setShow] = useState(false)

  const [
    ctComplicationPairedWithDiag,
    setCtComplicationPairedWithDiag,
  ] = useState([])

  const [showPersistMsg, setShowPersistMsg] = useState(false)

  const { form } = arrayHelpers

  const onDiagnosisChange = (v, op) => {
    const { values: vals, setValues } = form
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
    } else {
      vals.corDiagnosis[index].diagnosisCode = undefined
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
  const onDataSouceChange = data => {
    if (
      form.values.corDiagnosis[index] &&
      form.values.corDiagnosis[index].diagnosisFK
    ) {
      const { diagnosisFK } = form.values.corDiagnosis[index]
      const ctsnomeddiagnosis = data || []
      const diagnosis = ctsnomeddiagnosis.find(
        item => parseInt(item.id, 10) === parseInt(diagnosisFK, 10),
      )
      if (diagnosis) {
        setCtComplicationPairedWithDiag(diagnosis.complication || [])
      }
    }
  }

  const handelSaveDiagnosisAsFavourite = () => {
    saveDiagnosisAsFavourite(diagnosisCode, uid)
  }

  const updateSelectCategory = category => {
    const { values: vals, setValues } = form
    vals.corDiagnosis[index].currentSelectCategory = category
    setValues(vals)
  }
  return (
    <Paper className={classes.diagnosisRow}>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs={12}>
          <div style={{ display: 'flex', height: 24 }}>
            <div>
              <CheckboxGroup
                label='Selected Widgets'
                simple
                valueField='value'
                textField='name'
                value={currentSelectCategory}
                options={filterOptions}
                onChange={(v, newVal) => {
                  if (newVal.all === true) {
                    updateSelectCategory(filterOptions.map(o => o.value))
                  } else if (newVal.all === false) {
                    updateSelectCategory([])
                  } else {
                    updateSelectCategory(
                      (v.target.value || []).filter(c => c !== 'all'),
                    )
                  }
                }}
              />
            </div>
            {favouriteDiagnosisCategoryMessage && (
              <div
                style={{
                  color: 'green',
                  marginLeft: 'auto',
                }}
              >
                {favouriteDiagnosisCategoryMessage}
              </div>
            )}
            {!_.isEqual(
              favouriteDiagnosisCategory.sort(),
              currentSelectCategory.filter(c => c !== 'all').sort(),
            ) && (
              <a
                style={{
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  marginLeft: 'auto',
                }}
                onClick={() => {
                  saveCategoryAsFavourite(
                    currentSelectCategory.filter(c => c !== 'all'),
                    uid,
                  )
                }}
              >
                Save categories as favourite
              </a>
            )}
          </div>
        </GridItem>
        <GridItem xs={6} style={{ paddingRight: 35 }}>
          <Field
            name={`corDiagnosis[${index}].diagnosisFK`}
            render={args => (
              <DiagnosisSelect
                onChange={onDiagnosisChange}
                onDataSouceChange={onDataSouceChange}
                filterStyle={{
                  position: 'absolute',
                  bottom: -5,
                  right: -30,
                }}
                from='Consultaion'
                selectDiagnosisCode={diagnosisCode}
                favouriteDiagnosis={favouriteDiagnosis}
                handelSaveDiagnosisAsFavourite={handelSaveDiagnosisAsFavourite}
                currentSelectCategory={currentSelectCategory.filter(
                  o => o !== 'all',
                )}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={5} style={{ position: 'relative' }}>
          <span style={{ color: 'green', position: 'absolute', bottom: 0 }}>
            {favouriteDiagnosisMessage}
          </span>
        </GridItem>
        <GridItem xs={1} style={{ position: 'relative' }}>
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
                <p style={{ color: 'orange' }}>
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
        <GridItem xs={12}>
          <CodeSelect
            label='Complication'
            mode='multiple'
            options={ctComplicationPairedWithDiag}
            labelField='displayValue'
            valueField='id'
            maxTagCount={2}
            value={_.uniqBy(
              (form.values.corDiagnosis[index].corComplication || [])
                .filter(c => !c.isDeleted)
                .map(o => o.complicationFK),
            )}
            disableAll
            onChange={(v, opts) => {
              const { setFieldValue, values } = form

              let newcorComplication = (
                values.corDiagnosis[index].corComplication || []
              ).map(c => {
                if (
                  !c.isDeleted &&
                  !opts.find(o => o.id === c.complicationFK)
                ) {
                  c.isDeleted = true
                } else if (
                  c.isDeleted &&
                  opts.find(o => o.id === c.complicationFK)
                ) {
                  c.isDeleted = false
                }
                return c
              })

              newcorComplication = [
                ...newcorComplication,
                ...opts
                  .filter(
                    o =>
                      !newcorComplication.find(c => c.complicationFK === o.id),
                  )
                  .map(o => {
                    return { complicationFK: o.id }
                  }),
              ]

              // remove new delete data
              newcorComplication = newcorComplication.filter(
                c => !(!c.id && c.isDeleted),
              )
              setFieldValue(
                `corDiagnosis[${index}]corComplication`,
                newcorComplication,
              )
            }}
          />
        </GridItem>
        <GridItem xs={6}>
          <FastField
            name={`corDiagnosis[${index}].onsetDate`}
            render={args => {
              return (
                <DatePicker
                  label='Onset Date'
                  allowClear={false}
                  {...args}
                  onChange={value => {
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
              render={args => {
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
            render={args => {
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
