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
import { Add } from '@material-ui/icons'
import Edit from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid'
import { getUniqueNumericId } from '@/utils/utils'
import CoverTest from './components/CoverTest'

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
      },
      '& td[width="5%"]': {
        textAlign: 'center',
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
  }),
  { withTheme: true },
)

const base64Prefix = 'data:image/jpeg;base64,'

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
              Paediatric
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
                  <span className={classes.itemTitle}>NPC*</span>
                </div>
              </td>
              <td width='70%'>
                <div>
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
                  <span className={classes.itemTitle}>Ocular Motility*</span>
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
                  <span className={classes.itemTitle}>Stereopsis*</span>
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
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Colour Vision */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Colour Vision*</span>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.colourVisionTot`}
                      render={args => (
                        <TextField {...args} label='Type of test' />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>
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
                </div>
              </td>
            </tr>
          </table>
        </GridItem>

        {/* Axial Length */}
        <GridItem md={12} className={classes.gridItem}>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Axial Length*</span>
                  <div className={classes.itemTitleField}>
                    <FastField
                      name={`${prefixProp}.axialLengthInstrument`}
                      render={args => (
                        <TextField {...args} label='Instrument' />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>
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
                </div>
              </td>
            </tr>
          </table>
        </GridItem>
      </GridContainer>
    )
  }
}
export default compose(_styles)(Paediatric)
