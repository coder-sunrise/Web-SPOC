import React, { useState, useEffect } from 'react'
import { Field, FastField } from 'formik'
import { Divider } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
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
} from '@/components'

const DiagnosisItem = ({
  theme,
  index,
  arrayHelpers,
  codetable,
  diagnosises,
  classes,
  ...props
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const [
    ctComplication,
    setCtComplication,
  ] = useState([])

  const { form } = arrayHelpers

  useEffect(
    () => {
      if (form.values.corDiagnosis[index]) {
        const { _complication = [] } = form.values.corDiagnosis[index]
        setCtComplication(_complication)
      }
    },
    [
      form.values.corDiagnosis[index],
    ],
  )

  const onDiagnosisChange = async (v, op) => {
    const { setFieldValue } = form
    if (op) {
      await setFieldValue(
        `corDiagnosis[${index}]_complication`,
        op.complication,
      )

      setFieldValue(
        `corDiagnosis[${index}]diagnosisDescription`,
        op.displayvalue,
      )

      setFieldValue(`corDiagnosis[${index}]diagnosisCode`, op.code)

      // if (op.complication && op.complication.length) {
      //   setFieldValue(
      //     `corDiagnosis[${index}]complication`,
      //     op.complication.map((o) => o.id),
      //   )
      //   setFieldValue(
      //     `corDiagnosis[${index}]corComplication`,
      //     op.complication.map((o) => ({
      //       complicationFK: o.id,
      //     })),
      //   )
      // }
    }
  }
  const { values } = form
  return (
    <React.Fragment>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs={12}>
          <FastField
            name={`corDiagnosis[${index}].diagnosisFK`}
            render={(args) => (
              <CodeSelect
                label='Diagnosis'
                code='codetable/ctsnomeddiagnosis'
                filter={{
                  props:
                    'id,displayvalue,code,complication,isChasAcuteClaimable,isChasChronicClaimable,isHazeClaimable',
                  sorting: [
                    { columnName: 'displayvalue', direction: 'asc' },
                  ],
                }}
                labelField='displayvalue'
                autoComplete
                renderDropdown={(option) => {
                  const {
                    isChasAcuteClaimable,
                    isChasChronicClaimable,
                    isHazeClaimable,
                  } = option
                  return (
                    <span>
                      {(isChasAcuteClaimable ||
                        isChasChronicClaimable ||
                        isHazeClaimable) && (
                        <AttachMoney className={classes.money} />
                      )}

                      {option.displayvalue}
                    </span>
                  )
                }}
                onChange={onDiagnosisChange}
                {...args}
              />
            )}
          />
        </GridItem>
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
                <CodeSelect
                  label='Complication'
                  mode='multiple'
                  // code='ctComplication'
                  options={ctComplication}
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
                  label='Order Date'
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
          <FastField
            name={`corDiagnosis[${index}].isPersist`}
            render={(args) => {
              return <Checkbox inputLabel='Persist' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={11}>
          <FastField
            name={`corDiagnosis[${index}].remarks`}
            render={(args) => {
              return (
                <TextField label='Remarks' multiline rowsMax={6} {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={1} style={{ position: 'relative' }}>
          <Popover
            content={
              <div>
                <p style={{ paddingLeft: 20, paddingBottom: theme.spacing(2) }}>
                  Confirm to remove a persist diagnosis?
                </p>
                <Button onClick={() => {}} variant='outlined'>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    form.setFieldValue(`corDiagnosis[${index}].isDeleted`, true)
                    // arrayHelpers.remove(index)
                  }}
                >
                  Remove Current Visit
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    console.log(index)
                    // arrayHelpers.remove(index)
                    form.setFieldValue(`corDiagnosis[${index}].isDeleted`, true)
                    form.setFieldValue(
                      `corDiagnosis[${index}].isPermanentDelete`,
                      true,
                    )
                  }}
                >
                  Remove Permanently
                </Button>
              </div>
            }
            title='Delete Diagnosis'
            trigger='click'
            visible={show}
            onVisibleChange={() => {
              setShow(!show)
            }}
          >
            <Tooltip title='Delete'>
              <Button
                style={{ position: 'absolute', bottom: theme.spacing(1) }}
                justIcon
                color='danger'
                size='sm'
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Popover>
        </GridItem>
      </GridContainer>
      <Divider />
    </React.Fragment>
  )
}

export default DiagnosisItem
