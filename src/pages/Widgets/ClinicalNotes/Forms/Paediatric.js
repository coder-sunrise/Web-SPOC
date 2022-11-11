import {
  GridContainer,
  GridItem,
  TextField,
  Button,
  FieldArray,
  Field,
  MultipleTextField,
} from '@/components'
import { FastField } from 'formik'
import { PureComponent, useState } from 'react'
import {  Add } from '@material-ui/icons'
import Edit from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import { getUniqueNumericId } from '@/utils/utils'
import CoverTest from './components/CoverTest'

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

const border = '1px solid rgb(217,217,217)'

class Paediatric extends PureComponent {
  addCoverTest() {
    let { prefixProp } = this.props
    let { values, setFieldValue } = this.arrayHelpers.form
    let oldCoverTestList = _.get(values, `${prefixProp}.coverTest`) || []

    let newCoverTest = {
      uid: getUniqueNumericId(),
      withRx: false,
      withoutRx: false,
      coverTestD: undefined,
      coverTestN: undefined,
    }

    setFieldValue(`${prefixProp}.coverTest`, [
      ...oldCoverTestList,
      newCoverTest,
    ])
  }
  render() {
    let {
      prefixProp,
      classes,
      theme: { spacing },
    } = this.props
    console.log(this.props)

    return (
      <GridContainer>
        <GridItem md={12}>
          <div>
            <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
              Paediatric
            </span>
          </div>
        </GridItem>
        <GridItem md={12}>
          <FieldArray
            name={`${prefixProp}.coverTest`}
            render={arrayHelpers => {
              this.arrayHelpers = arrayHelpers
              let { values } = this.arrayHelpers.form
              let coverTestList = _.get(values, `${prefixProp}.coverTest`) || []
              return (
                <div>
                  {coverTestList
                    .filter(item => item.isDeleted != true)
                    .map((val, i) => {
                      let index = coverTestList.findIndex(item =>
                        val.id ? item.id == val.id : val.uid === item.uid,
                      )
                      return (
                        <CoverTest
                          border={border}
                          targetVal={val}
                          index={index}
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
                borderRight: border,
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
                borderRight: border,
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
                  // window.g_app._store.dispatch({
                  //   type: 'scriblenotes/updateState',
                  //   payload: {
                  //     entity: '123',
                  //     showScribbleModal: true,
                  //     editEnable: false,
                  //   },
                  // })
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
                borderRight: border,
              }}
            >
              Stereopsis*
              <div>
                <FastField
                  name={`${prefixProp}.stereopsisTot`}
                  render={args => <TextField {...args} label='Type of test' />}
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
                borderRight: border,
              }}
            >
              Colour Vision*
              <div>
                <FastField
                  name={`${prefixProp}.colourVisionTot`}
                  render={args => <TextField {...args} label='Type of test' />}
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
                borderRight: border,
              }}
            >
              Axial Length*
              <div>
                <FastField
                  name={`${prefixProp}.axialLengthInstrument`}
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
                    {...args}
                  />
                )}
              />
            </Grid>
          </Grid>
        </GridItem>
      </GridContainer>
    )
  }
}
export default compose(_styles)(Paediatric)
