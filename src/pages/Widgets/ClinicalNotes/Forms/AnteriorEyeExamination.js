import React, { useState } from 'react'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  MultipleTextField,
  Button,
} from '@/components'
import { FastField, getIn } from 'formik'
import Edit from '@material-ui/icons/Edit'

const AnteriorEyeExamination = props => {
  const {
    prefixProp,
    classes,
    editScribbleNote,
    values,
    defaultImage,
    cavanSize,
    imageSize,
    thumbnailSize,
    position,
    thumbnailDisplaySize,
  } = props
  const base64Prefix = 'data:image/jpeg;base64,'
  return (
    <GridContainer style={{ marginTop: 8 }}>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
          Anterior Eye Examination
        </span>
      </GridItem>
      <GridItem md={7} style={{ position: 'relative', top: 6 }}>
        Please draw out relevant diagram below.
      </GridItem>
      <GridItem
        md={5}
        container
        style={{ position: 'relative', paddingLeft: 140 }}
      >
        <div style={{ position: 'absolute', left: 0, top: 6 }}>
          Grading Chart used:
        </div>
        <FastField
          name={`${prefixProp}.gradingChartFK`}
          render={args => (
            <CodeSelect label='' {...args} code='ctGradingChart' />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <table style={{ width: '100%', margin: '8px 0px' }}>
          <tr>
            <td style={{ width: '40%' }}></td>
            <td style={{ width: '10%' }}></td>
            <td style={{ width: '10%' }}></td>
            <td style={{ width: '40%' }}></td>
          </tr>
          <tr>
            <td
              colspan='2'
              className={classes.cellStyle}
              style={{ padding: 4 }}
            >
              <div>
                <span>RE</span>
                <Button
                  color='primary'
                  size='sm'
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    editScribbleNote(
                      prefixProp,
                      'rightScribbleNote',
                      'rightScribbleNoteFK',
                      defaultImage,
                      cavanSize,
                      imageSize,
                      thumbnailSize,
                      position,
                    )
                  }}
                  justIcon
                >
                  <Edit />
                </Button>
              </div>
              <div
                style={{
                  width: thumbnailDisplaySize.width + 6,
                  marginTop: 6,
                  position: 'relative',
                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                }}
              >
                <FastField
                  name={`${prefixProp}.rightScribbleNote`}
                  render={args => {
                    if (
                      !args.field.value?.thumbnail ||
                      args.field.value?.thumbnail === ''
                    ) {
                      return ''
                    }
                    let src = `${base64Prefix}${args.field.value.thumbnail}`
                    return (
                      <div>
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
            </td>
            <td
              colspan='2'
              className={classes.cellStyle}
              style={{ padding: 4 }}
            >
              <div>
                <span>LE</span>
                <Button
                  color='primary'
                  size='sm'
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    editScribbleNote(
                      prefixProp,
                      'leftScribbleNote',
                      'leftScribbleNoteFK',
                      defaultImage,
                      cavanSize,
                      imageSize,
                      thumbnailSize,
                      position,
                    )
                  }}
                  justIcon
                >
                  <Edit />
                </Button>
              </div>
              <div
                style={{
                  width: 260,
                  marginTop: 6,
                  position: 'relative',
                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                }}
              >
                <FastField
                  name={`${prefixProp}.leftScribbleNote`}
                  render={args => {
                    if (
                      !args.field.value?.thumbnail ||
                      args.field.value?.thumbnail === ''
                    ) {
                      return ''
                    }
                    const src = `${base64Prefix}${args.field.value.thumbnail}`
                    return (
                      <div>
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
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightGeneral`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              General
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftGeneral`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightLidsMargins`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Lids / Margins
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftLidsMargins`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightConjunctiva`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Conjunctiva
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftConjunctiva`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightCornea`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Cornea
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftCornea`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightLens`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Lens
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftLens`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightIris`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Iris
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftIris`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightAnteriorChamber`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Anterior Chamber
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftAnteriorChamber`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightVanHerickAngle`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Van Herick Angle
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftVanHerickAngle`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightOthers`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Others
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftOthers`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
        </table>
      </GridItem>
      <GridItem md={12} container>
        <div style={{ fontWeight: 500 }}>Remarks:</div>
        <FastField
          name={`${prefixProp}.remarks`}
          render={args => (
            <MultipleTextField
              label=''
              maxLength={2000}
              autoSize={{ minRows: 3 }}
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default AnteriorEyeExamination
