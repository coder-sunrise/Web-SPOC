import {
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
  RadioGroup,
  Button,
  FieldArray,
  Field,
  withFormikExtend,
  MultipleTextField,
  Checkbox,
} from '@/components'
import { FastField } from 'formik'
import { PureComponent, useState } from 'react'
import { Delete, Add } from '@material-ui/icons'
import Edit from '@material-ui/icons/Edit'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { useTheme } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import { getIn, setIn } from 'formik'
import { render } from 'react-dom'
import { getUniqueNumericId } from '@/utils/utils'
import CoverTest from './components/CoverTest'

// const { spacing } = useTheme()

const _styles = withStyles(
  theme => ({
    gridItem: {
      margin: theme.spacing(1),
      border: '1px solid rgb(217,217,217)',
      height: theme.spacing(10),
    },
    btnContainer: {
      display: 'flex',
      '& button': {
        marginRight: '0px',
      },
    },
  }),
  { withTheme: true },
)

class Paediatric extends PureComponent {
  addCoverTest() {
    this.arrayHelpers.push({
      id: getUniqueNumericId(),
      coverTestD: '',
    })
  }
  render() {
    const {
      prefixProp,
      classes,
      values,
      theme: { spacing },
    } = this.props
    console.log(prefixProp)

    return (
      <>
        <GridContainer>
          <GridItem md={12}>
            <div>
              <span
                style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}
              >
                Paediatric
              </span>
            </div>
          </GridItem>
          <GridItem md={12}>
            <FieldArray
              name={`${prefixProp}.coverTest`}
              render={arrayHelpers => {
                this.arrayHelpers = arrayHelpers
                return (
                  <div>
                    {arrayHelpers.form.values.corDoctorNote.corPaediatricEntity.coverTest
                      ?.filter(item => item.isDeleted !== true)
                      .map((val, i) => {
                        console.log(val)
                        return (
                          <CoverTest
                            key={val.id}
                            targetVal={val}
                            index={i}
                            arrayHelpers={arrayHelpers}
                            propName={`${prefixProp}.coverTest`}
                            {...this.props}
                          />
                        )
                      })}
                  </div>
                )
              }}
            />
          </GridItem>
          {/* Add New */}
          <GridItem
            md={12}
            style={{
              height: spacing(5),
              margin: spacing(1),
            }}
          >
            <Button
              color='primary'
              size='sm'
              onClick={() => {
                this.addCoverTest()
              }}
            >
              <Add />
              Add New
            </Button>
          </GridItem>

          {/* NPC */}
          <GridItem md={12} className={classes.gridItem}>
            <Grid container style={{ height: '100%' }}>
              <Grid
                md={4}
                style={{
                  padding: spacing(1),
                  borderRight: '1px solid rgb(217,217,217) ',
                  height: '100%',
                }}
              >
                NPC*
              </Grid>
              <Grid md={8}>
                <Field
                  name={`${prefixProp}.npc`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder=''
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </GridItem>
          {/* Ocular Motility */}
          <GridItem
            md={12}
            className={classes.gridItem}
            style={{ height: spacing(20) }}
          >
            <Grid container style={{ height: '100%' }}>
              <Grid
                md={4}
                style={{
                  padding: spacing(1),
                  borderRight: '1px solid rgb(217,217,217) ',
                }}
              >
                Ocular Motility*
              </Grid>
              <Grid md={8}>
                <Button
                  justIcon
                  color='primary'
                  style={{ marginTop: spacing(1), marginLeft: spacing(1) }}
                  onClick={() => {
                    window.g_app._store.dispatch({
                      type: 'scriblenotes/updateState',
                      payload: {
                        entity: '',
                        showScribbleModal: true,
                        editEnable: false,
                      },
                    })
                  }}
                >
                  <Edit />
                </Button>
              </Grid>
            </Grid>
          </GridItem>
          {/* Stereopsis */}
          <GridItem md={12} className={classes.gridItem}>
            <Grid container style={{ height: '100%' }}>
              <Grid
                md={4}
                style={{
                  padding: spacing(1),
                  borderRight: '1px solid rgb(217,217,217) ',
                }}
              >
                Stereopsis*
                <div>
                  <FastField
                    name={`${prefixProp}.stereopsisTOT`}
                    render={args => (
                      <TextField {...args} label='Type of test' />
                    )}
                  />
                </div>
              </Grid>
              <Grid md={8}>
                <Field
                  name={`${prefixProp}.stereopsis`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder=''
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </GridItem>
          {/* Colour Vision */}
          <GridItem md={12} className={classes.gridItem}>
            <Grid container style={{ height: '100%' }}>
              <Grid
                md={4}
                style={{
                  padding: spacing(1),
                  borderRight: '1px solid rgb(217,217,217) ',
                }}
              >
                Colour Vision*
                <div>
                  <FastField
                    name={`${prefixProp}.colourVisionTOT`}
                    render={args => (
                      <TextField {...args} label='Type of test' />
                    )}
                  />
                </div>
              </Grid>
              <Grid md={8}>
                <Field
                  name={`${prefixProp}.colourVision`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder=''
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </GridItem>
          {/* Axial Length */}
          <GridItem md={12} className={classes.gridItem}>
            <Grid container style={{ height: '100%' }}>
              <Grid
                md={4}
                style={{
                  padding: spacing(1),
                  borderRight: '1px solid rgb(217,217,217) ',
                }}
              >
                Axial Length*
                <div>
                  <FastField
                    name={`${prefixProp}.axialLengthInstru`}
                    render={args => <TextField {...args} label='Instrument' />}
                  />
                </div>
              </Grid>
              <Grid md={8}>
                <Field
                  name={`${prefixProp}.axialLength`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder=''
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </GridItem>
        </GridContainer>
      </>
    )
  }
}
export default compose(_styles)(Paediatric)
