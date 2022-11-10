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

const PosteriorEyeExamination = props => {
  const {
    prefixProp,
    classes,
    editScribbleNote,
    values,
    formId,
    defaultImage,
    cavanSize,
    imageSize,
    thumbnailSize,
    position,
  } = props
  const base64Prefix = 'data:image/jpeg;base64,'
  return (
    <GridContainer style={{ marginTop: 8 }}>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
          Posterior Eye Examination
        </span>
      </GridItem>
      <GridItem md={7} style={{ position: 'relative', top: 6 }}>
        Please draw out relevant diagram below.
      </GridItem>
      <GridItem
        md={5}
        container
        style={{ position: 'relative', paddingLeft: 120 }}
      >
        <div style={{ position: 'absolute', left: 0, top: 6 }}>
          Instrument used:
        </div>
        <FastField
          name={`${prefixProp}.instrumentFK`}
          render={args => <CodeSelect label='' {...args} code='ctInstrument' />}
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
                      formId,
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
                  left: 'calc((100% -  260px) / 2)',
                }}
              >
                <FastField
                  name={`${prefixProp}.rightScribbleNote`}
                  render={args => {
                    let src
                    if (
                      args.field.value?.thumbnail &&
                      args.field.value?.thumbnail !== ''
                    ) {
                      src = `${base64Prefix}${args.field.value.thumbnail}`
                    }
                    return (
                      <div
                        style={{
                          width: 253,
                          height: 138,
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          backgroundColor: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={args.field.value.subject}
                            style={{ maxHeight: 136, maxWidth: 250 }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
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
                      formId,
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
                  left: 'calc((100% -  260px) / 2)',
                }}
              >
                <FastField
                  name={`${prefixProp}.leftScribbleNote`}
                  render={args => {
                    let src
                    if (
                      args.field.value?.thumbnail &&
                      args.field.value?.thumbnail !== ''
                    ) {
                      src = `${base64Prefix}${args.field.value.thumbnail}`
                    }
                    return (
                      <div
                        style={{
                          width: 253,
                          height: 138,
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          backgroundColor: 'white',
                        }}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={args.field.value.subject}
                            style={{ maxHeight: 136, maxWidth: 250 }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
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
                name={`${prefixProp}.rightDiscColourMargin`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Disc colour, Margin
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftDiscColourMargin`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightNRR`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              NRR
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftNRR`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightCDRatio`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              C / D Ratio
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftCDRatio`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightTetinalVessels`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Tetinal Vessels
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftTetinalVessels`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightMedPeriphery`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Mid Periphery
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftMedPeriphery`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightOcularMedia`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Ocular Media
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftOcularMedia`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightMacula`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Macula
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.leftMacula`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.rightFevea`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                )}
              />
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Fovea
            </td>
            <td className={classes.cellStyle}>
              <FastField
                name={`${prefixProp}.LeftFevea`}
                render={args => (
                  <MultipleTextField
                    label=''
                    maxLength={500}
                    {...args}
                    bordered={false}
                    autoSize={{ minRows: 1, maxRows: 1 }}
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
                    autoSize={{ minRows: 1, maxRows: 1 }}
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
                    autoSize={{ minRows: 1, maxRows: 1 }}
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
              autoSize={{ minRows: 3, maxRows: 3 }}
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default PosteriorEyeExamination
