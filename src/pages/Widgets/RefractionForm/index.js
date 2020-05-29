import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import * as Yup from 'yup'
import {
  TextField,
  NumberInput,
  GridContainer,
  GridItem,
  Button,
  FastField,
  Field,
  Checkbox,
  OutlinedTextField,
} from '@/components'

import Grid from './Grid'
import NearAddGrid from './NearAddGrid'

const styles = (theme) => ({})
const gridValidationSchema = Yup.object().shape({
  EyeRefractionTestTypeFK: Yup.number().min(0, 'This field is required'),
})

class RefractionForm extends PureComponent {
  onCommitChanges = (p) => {
    const { rows = [], deleted, form: { setFieldValue } } = p
    const { prefix } = this.props
    // let { formData } = this.state
    if (deleted) {
      const newrow =
        rows.reduce((result, r) => {
          if (!r.isDeleted) {
            return [
              ...result,
              { ...r },
            ]
          }
          return [
            ...result,
          ]
        }, []) || []
      setFieldValue(`${prefix}.Tests`, newrow)
      return newrow
    }
    if (rows) {
      const updatedRows = this.validateWithSchema(rows)
      setFieldValue(`${prefix}.Tests`, updatedRows)
      return updatedRows
    }
  }

  updateNearAddValue = (p) => {
    const { rows = [], form: { setFieldValue } } = p
    const { prefix } = this.props

    let nearAdd = rows ? rows[0] : undefined

    setFieldValue(`${prefix}.NearAdd`, nearAdd)
  }

  getRows = (args) => {
    const { form: { values } } = args
    let thisFormData = Object.byString(values, this.props.prefix)
    return thisFormData ? thisFormData.Tests || [] : []
  }

  getNearAddRows = (args) => {
    const { form: { values } } = args
    const { prefix } = this.props
    let formData = Object.byString(values, prefix)
    if (formData && formData.NearAdd) {
      return [
        { id: -99, ...formData.NearAdd },
      ]
    }
    return [
      {},
    ]
  }

  validateWithSchema = (datagrid = []) => {
    const endResult = datagrid.reduce((result, data) => {
      try {
        if (!data.isDeleted) {
          const {
            EyeRefractionTestTypeFK = undefined,
            SphereOD = undefined,
            CylinderOD = undefined,
            AxisOD = undefined,
            VaOD = undefined,
            SphereOS = undefined,
            CylinderOS = undefined,
            AxisOS = undefined,
            VaOS = undefined,
          } = data
          if (
            SphereOD ||
            CylinderOD ||
            AxisOD ||
            VaOD ||
            SphereOS ||
            CylinderOS ||
            AxisOS ||
            VaOS
          ) {
            if (!EyeRefractionTestTypeFK || EyeRefractionTestTypeFK <= 0) {
              data.EyeRefractionTestTypeFK = -99
              data.EyeRefractionTestType = ''
            }
          } else if (data.EyeRefractionTestTypeFK <= 0) {
            data.EyeRefractionTestTypeFK = 0
            data.EyeRefractionTestType = ''
          }
          gridValidationSchema.validateSync(data, {
            abortEarly: false,
          })
        }
        return [
          ...result,
          { ...data, _errors: [] },
        ]
      } catch (error) {
        return [
          ...result,
          { ...data, _errors: error.inner },
        ]
      }
    }, [])
    return endResult
  }

  handleEyeDominanceChange = (v, mutual, { form }) => {
    const { setFieldValue } = form
    if (v === true) {
      setFieldValue(mutual, false)
    }
  }

  render () {
    const { theme, prefix } = this.props
    // const isDisabledPrint = () => {
    //   const rows = this.getRows()
    //   return !rows || rows.filter((r) => r.IsSelected === true).length !== 1
    // }

    // console.log(values)
    // console.log('render ', Object.byString(values, prefix))

    const _prefix = `${prefix}.`
    return (
      <GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2} style={{ marginTop: '20px' }}>
            <TextField value='Tonometry' text />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <FastField
              name={`${_prefix}Tenometry.R`}
              render={(args) => (
                <NumberInput
                  {...args}
                  label='R'
                  format='0.0'
                  maxLength={10}
                  min={0}
                  suffix='mmHg'
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <FastField
              name={`${_prefix}Tenometry.L`}
              render={(args) => (
                <NumberInput
                  {...args}
                  label='L'
                  maxLength={10}
                  format='0.0'
                  min={0}
                  suffix='mmHg'
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Eye Dominance' text />
          </GridItem>
          <GridItem xs sm={2} md={1}>
            <FastField
              name={`${_prefix}EyeDominance.Left`}
              render={(args) => (
                <Checkbox
                  {...args}
                  label='Left'
                  onChange={(e) => {
                    this.handleEyeDominanceChange(
                      e.target.value,
                      `${_prefix}EyeDominance.Right`,
                      args,
                    )
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={2} md={1}>
            <FastField
              name={`${_prefix}EyeDominance.Right`}
              render={(args) => (
                <Checkbox
                  {...args}
                  label='Right'
                  onChange={(e) => {
                    this.handleEyeDominanceChange(
                      e.target.value,
                      `${_prefix}EyeDominance.Left`,
                      args,
                    )
                  }}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Van Herick' text />
          </GridItem>
          <GridItem xs sm={10} md={10}>
            <FastField
              name={`${_prefix}VanHerick`}
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Van Herick'
                    multiline
                    maxLength={2000}
                    rowsMax={5}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2} style={{ marginTop: '20px' }}>
            <TextField value='Pupil Size (scotopic)' text />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <FastField
              name={`${_prefix}PupilSize.R`}
              render={(args) => (
                <TextField {...args} label='R' maxLength={50} />
              )}
            />
          </GridItem>
          <GridItem xs sm={4} md={3}>
            <FastField
              name={`${_prefix}PupilSize.L`}
              render={(args) => (
                <TextField {...args} label='L' maxLength={50} />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs sm={2} md={2}>
            <TextField value='Remarks' text />
          </GridItem>
          <GridItem xs sm={10} md={10}>
            <FastField
              name={`${_prefix}Remarks`}
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Remarks'
                    multiline
                    maxLength={2000}
                    rowsMax={5}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          {/* <GridItem xs sm={4} md={4} style={{ alignSelf: 'flex-end' }}>
            <FastField
              render={(args) => {
                return (
                  <Button
                    color='primary'
                    icon={null}
                    style={{ margin: theme.spacing(1) }}
                    disabled={isDisabledPrint()}
                  >
                    Print Spectacle Prescription
                  </Button>
                )
              }}
            />
          </GridItem> */}
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <Field
              render={(args) => {
                return (
                  <Grid
                    {...this.props}
                    rows={this.getRows(args)}
                    schema={gridValidationSchema}
                    handleCommitChanges={(p) => {
                      this.onCommitChanges({ ...args, ...p })
                    }}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <Field
              render={(args) => {
                return (
                  <NearAddGrid
                    rows={this.getNearAddRows(args)}
                    setArrayValue={(p) => {
                      this.updateNearAddValue({ ...args, ...p })
                    }}
                    {...this.props}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer style={{ marginTop: theme.spacing(1) }}>
          <GridItem xs>
            <FastField
              name={`${_prefix}TestRemarks`}
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Remarks'
                    multiline
                    maxLength={2000}
                    rowsMax={5}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(RefractionForm)
