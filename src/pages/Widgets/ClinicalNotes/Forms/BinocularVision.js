import {
  GridContainer,
  GridItem,
  TextField,
  Button,
  FieldArray,
  Field,
  MultipleTextField,
  Checkbox,
} from '@/components'
import { FastField } from 'formik'
import { PureComponent, useState } from 'react'
import { Add } from '@material-ui/icons'
import Edit from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import { getUniqueNumericId } from '@/utils/utils'
import CoverTest from './components/CoverTest'
import classnames from 'classnames'
import _ from 'lodash'

const _styles = withStyles(
  theme => ({
    itemTable: {
      width: '100%',
      '& > tr > td': {
        border: '1px solid #ccc',
        height: theme.spacing(10),
      },
      '& > tr > td > div': {
        height: '100%',
        position: 'relative',
        // border: '1px solid red',
      },
      '& td[width="5%"]': {
        fontSize: '0.8rem',
        textAlign: 'center',
      },
      '& textarea': {
        height: '100%',
      },
    },
    itemTableSPT: {
      '& > tr > td': {
        height: theme.spacing(6),
      },
    },
    itemTitle: {
      position: 'absolute',
      top: '5px',
      left: '5px',
    },
    itemTitleField: {
      position: 'absolute',
      bottom: '10px',
      left: '5px',
    },
    gridItem: {
      marginBottom: theme.spacing(1),
    },
    extraDom: {
      '&::after': {
        content: "' + '",
        position: 'relative',
        top: '-10px',
      },
    },
  }),
  { withTheme: true },
)

const base64Prefix = 'data:image/jpeg;base64,'

class BinocularVision extends PureComponent {
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
      editScribbleNote,
      defaultImage,
      cavanSize,
      imageSize,
      thumbnailSize,
      position,
      thumbnailDisplaySize,
    } = this.props

    return (
      <GridContainer>
        {/* Title */}
        <GridItem md={12} className={classes.gridItem}>
          <div>
            <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
              Binocular Vision
            </span>
          </div>
        </GridItem>

        {/* CoverTest */}
        <GridItem md={12} className={classes.gridItem}>
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
        <GridItem md={12} className={classes.gridItem}>
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
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    NPC
                  </span>
                </div>
              </td>
              <td width='70%'>
                <div>
                  <FastField
                    name={`${prefixProp}.npc`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={{ minRows: 3 }}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Ocular Motility */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    Ocular Motility
                  </span>
                </div>
              </td>
              <td width='70%'>
                <div>
                  <Button
                    justIcon
                    color='primary'
                    style={{
                      position: 'absolute',
                      top: spacing(1),
                      left: spacing(1),
                    }}
                    onClick={() => {
                      editScribbleNote(
                        prefixProp,
                        'ocularMotilityScribbleNote',
                        'ocularMotilityScribbleNoteFK',
                        defaultImage,
                        cavanSize,
                        imageSize,
                        thumbnailSize,
                        position,
                      )
                    }}
                  >
                    <Edit />
                  </Button>
                  <div
                    style={{
                      width: thumbnailDisplaySize.width + 6,
                      marginTop: 6,
                      position: 'relative',
                      left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                      height: '120px',
                      overflow: 'hidden',
                    }}
                  >
                    <FastField
                      name={`${prefixProp}.ocularMotilityScribbleNote`}
                      render={args => {
                        if (
                          !args.field.value?.thumbnail ||
                          args.field.value?.thumbnail === ''
                        ) {
                          return ''
                        }
                        let src = `${base64Prefix}${args.field.value.thumbnail}`
                        return (
                          <div style={{}}>
                            <img
                              src={src}
                              alt={args.field.value.subject}
                              style={{
                                maxHeight: thumbnailDisplaySize.height,
                                maxWidth: thumbnailDisplaySize.width,
                              }}
                            />
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Stereopsis */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    Stereopsis
                  </span>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.stereopsisTot`}
                      render={args => (
                        <TextField {...args} label='Type of test' />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>
                  <FastField
                    name={`${prefixProp}.stereopsis`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={{ minRows: 3 }}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Subjective Phoria Test  */}
        <GridItem md={12} className={classes.gridItem}>
          <table
            className={classnames({
              [classes.itemTable]: true,
              [classes.itemTableSPT]: true,
            })}
          >
            <tr>
              <td rowSpan='2' width='30%'>
                <div>
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    Subjective Phoria Test
                  </span>
                  <br />
                  <em style={{ fontSize: '0.8rem' }}>
                    (including its magnitude and direction)
                  </em>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.subjectivePhoriaTestTot`}
                      render={args => (
                        <TextField {...args} label='Type of test' />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>D</td>
              <td width='30%'>
                <div>
                  <FastField
                    name={`${prefixProp}.subjectivePhoriaTestD`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={true}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
              <td width='5%'>Vertical</td>
              <td>
                <div>
                  <FastField
                    name={`${prefixProp}.subjectivePhoriaTestDVertical`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={true}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td width='5%'>N</td>
              <td width='30%'>
                <div>
                  <FastField
                    name={`${prefixProp}.subjectivePhoriaTestN`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={true}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
              <td width='5%'>Vertical</td>
              <td>
                <div>
                  <FastField
                    name={`${prefixProp}.subjectivePhoriaTestNVertical`}
                    render={args => (
                      <MultipleTextField
                        maxLength={2000}
                        bordered={false}
                        autoSize={true}
                        {...args}
                      />
                    )}
                  />
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* AC / A Ratio  */}
        <GridItem md={12} className={classes.gridItem}>
          <table
            className={classnames({
              [classes.itemTable]: true,
              [classes.itemTableSPT]: true,
            })}
          >
            <tr>
              <td rowSpan='3' width='30%'>
                <div>
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    AC / A Ratio
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '5px',
                      top: '40px',
                      fontSize: '0.8rem',
                    }}
                  >
                    Type of test:
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      top: '35px',
                      left: '80px',
                    }}
                  >
                    <Field
                      name={`${prefixProp}.acaRatioMaddoxWing`}
                      render={args => {
                        return (
                          <Checkbox
                            label='Maddox Wing'
                            disabled={_.get(
                              args?.form?.values,
                              `${prefixProp}.acaRatioHowellPhoriaCard`,
                            )}
                            {...args}
                          />
                        )
                      }}
                    />
                    <Field
                      name={`${prefixProp}.acaRatioHowellPhoriaCard`}
                      render={args => {
                        return (
                          <Checkbox
                            label='Howell Phoria Card'
                            disabled={_.get(
                              args?.form?.values,
                              `${prefixProp}.acaRatioMaddoxWing`,
                            )}
                            {...args}
                          />
                        )
                      }}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>+2.00</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.acaRatioPlusTwo`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>-2.00</td>
              <td>
                <FastField
                  name={`${prefixProp}.acaRatioMinusTwo`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td width='5%'>+1.00</td>
              <td>
                <FastField
                  name={`${prefixProp}.acaRatioPlusOne`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>-1.00</td>
              <td>
                <FastField
                  name={`${prefixProp}.acaRatioMinusOne`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td width='5%'>Plano</td>
              <td>
                <FastField
                  name={`${prefixProp}.acaRatioPlano`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>AC/A Ratio</td>
              <td>
                <FastField
                  name={`${prefixProp}.acaRatio`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Amplitude of Accommodation  */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Amplitude of Accommodation
                  </span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.amplitudeAccommodationRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.amplitudeAccommodationLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* MEM */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>MEM</span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.memRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.memLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Relative Accommodation  */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Relative Accommodation{' '}
                  </span>
                </div>
              </td>
              <td width='5%'>PRA</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.relativeAccommodationPra`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>NRA</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.relativeAccommodationNra`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Fusional Reserve */}
        <GridItem md={12} className={classes.gridItem}>
          <table
            className={classnames({
              [classes.itemTable]: true,
              [classes.itemTableSPT]: true,
            })}
          >
            <tr>
              <td rowSpan='2' width='30%'>
                <div>
                  <span className={classes.itemTitle}>Fusional Reserve</span>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.fusionalReserveTot`}
                      render={args => (
                        <TextField {...args} label='Type of test' />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>D</td>
              <td width='5%'>PFR</td>
              <td width='25%'>
                <FastField
                  name={`${prefixProp}.fusionalReserveDPfr`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>NFR</td>
              <td>
                <FastField
                  name={`${prefixProp}.fusionalReserveDNfr`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td width='5%'>N</td>
              <td width='5%'>PFR</td>
              <td width='25%'>
                <FastField
                  name={`${prefixProp}.fusionalReserveNPfr`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>NFR</td>
              <td>
                <FastField
                  name={`${prefixProp}.fusionalReserveNNfr`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Accommodation Facility  */}
        <GridItem md={12} className={classes.gridItem}>
          <table
            className={classnames({
              [classes.itemTable]: true,
              [classes.itemTableSPT]: true,
            })}
          >
            <tr>
              <td rowSpan='2' width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Accommodation Facility
                  </span>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.acommodationFacilityOne`}
                      render={args => {
                        return <Checkbox label='+/- 1' {...args} />
                      }}
                    />
                    <FastField
                      name={`${prefixProp}.acommodationFacilityTwo`}
                      render={args => {
                        return <Checkbox label='+/- 2' {...args} />
                      }}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>Binocular</td>
              <td>
                <FastField
                  name={`${prefixProp}.acommodationFacilityBinocular`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td width='5%'>Monocular</td>
              <td>
                <FastField
                  name={`${prefixProp}.acommodationFacilityMonocular`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Vergence Facility */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Vergence Facility</span>
                  <div
                    className={classes.itemTitleField}
                    style={{ bottom: '0px' }}
                  >
                    <FastField
                      name={`${prefixProp}.vergenceFacilityFifteenB`}
                      render={args => {
                        return <Checkbox label='12 BO/3 BI' {...args} />
                      }}
                    />
                    <FastField
                      name={`${prefixProp}.vergenceFacilityEightB`}
                      render={args => {
                        return <Checkbox label='8 BO/BI' {...args} />
                      }}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>Binocular</td>
              <td>
                <FastField
                  name={`${prefixProp}.vergenceFacilityBinocular`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Other relevant BV Tests  */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Other relevant BV Tests
                  </span>
                </div>
              </td>
              <td>
                <FastField
                  name={`${prefixProp}.otherTests`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </GridItem>
      </GridContainer>
    )
  }
}
export default compose(_styles)(BinocularVision)
