import React, { useState } from 'react'
import { FastField } from 'formik'
import { Divider } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
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
} from '@/components'

export default ({
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
  const { form } = arrayHelpers
  // if (codetable['codetable/ctsnomeddiagnosis'])
  //   console.log(
  //     codetable['codetable/ctsnomeddiagnosis'].filter(
  //       (o) => o.complication.length > 0,
  //     ),
  //   )
  return (
    <React.Fragment>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs={12}>
          <FastField
            name={`corDiagnosis[${index}].diagnosisFK`}
            render={(args) => {
              return (
                <CodeSelect
                  label='Diagnosis'
                  code='codetable/ctsnomeddiagnosis'
                  filter={{
                    props:
                      'id,displayvalue,code,complication,isChasAcuteClaimable,isChasChronicClaimable,isHazeClaimable',
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
                  onChange={(v, op) => {
                    const { setFieldValue } = form
                    console.log("test 1 ", v)
                    console.log("test 2 ", op)
                    if (op) {
                      setFieldValue(
                        `corDiagnosis[${index}]diagnosisDescription`,
                        op.displayvalue,
                      )

                      setFieldValue(
                        `corDiagnosis[${index}]diagnosisCode`,
                        op.code,
                      )

                      if (op.complication && op.complication.length) {
                        setFieldValue(
                          `corDiagnosis[${index}]complication`,
                          op.complication.map((o) => o.id),
                        )
                        // console.log(
                        //   op.complication.map((o) => ({
                        //     complicationFK: o,
                        //   })),
                        // )
                        setFieldValue(
                          `corDiagnosis[${index}]corComplication`,
                          op.complication.map((o) => ({
                            complicationFK: o.id,
                          })),
                        )
                      }
                    }
                  }}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <FastField
            name={`corDiagnosis[${index}].complication`}
            render={(args) => {
              const { form: fm, field: fd } = args
              // console.log(fd, fm)
              if (
                !fd.value &&
                fm.values.corDiagnosis &&
                fm.values.corDiagnosis[index] &&
                fm.values.corDiagnosis[index].corComplication
              ) {
                // console.log(
                //   fm.values,
                //   fm.values.corDiagnosis,
                //   fm.values.corDiagnosis[index],
                // )
                fd.value = fm.values.corDiagnosis[index].corComplication.map(
                  (o) => o.complicationFK,
                )
              }
              // console.log(fd.value)
              return (
                <CodeSelect
                  label='Complication'
                  mode='multiple'
                  code='ctComplication'
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
                <DatePicker label='Order Date' allowClear={false} {...args} />
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
            {diagnosises.length > 1 && (
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
            )}
          </Popover>
        </GridItem>
      </GridContainer>
      <Divider />
    </React.Fragment>
  )
}
