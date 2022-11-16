import React from 'react'
import { GridContainer, GridItem } from '@/components'
const PosteriorEyeExamination = props => {
  const {
    formContent,
    classes,
    scribbleNoteUpdateState,
    defaultImage,
    cavanSize,
    imageSize,
    position,
    thumbnailDisplaySize,
    defaultThumbnail,
  } = props
  const base64Prefix = 'data:image/jpeg;base64,'
  const srcRightEye = `${base64Prefix}${
    formContent.rightScribbleNote
      ? formContent.rightScribbleNote.thumbnail
      : defaultThumbnail
  }`
  const srcLeftEye = `${base64Prefix}${
    formContent.leftScribbleNote
      ? formContent.leftScribbleNote.thumbnail
      : defaultThumbnail
  }`
  return (
    <GridContainer>
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
        style={{ position: 'relative', paddingLeft: 120 }}
      >
        <div style={{ position: 'absolute', left: 0, top: 6 }}>
          Instrument used:
        </div>
        <div className={classes.textWithBorder}>
          {formContent.instrumentName}
        </div>
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
              </div>
              <div
                style={{
                  width: thumbnailDisplaySize.width + 6,
                  marginTop: 6,
                  position: 'relative',
                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                }}
              >
                <div
                  onClick={() => {
                    scribbleNoteUpdateState(
                      formContent.rightScribbleNote,
                      defaultImage,
                      cavanSize,
                      imageSize,
                      position,
                      'Right Eye',
                    )
                  }}
                >
                  <img
                    src={srcRightEye}
                    style={{
                      maxHeight: thumbnailDisplaySize.height,
                      maxWidth: thumbnailDisplaySize.width,
                    }}
                  />
                </div>
              </div>
            </td>
            <td
              colspan='2'
              className={classes.cellStyle}
              style={{ padding: 4 }}
            >
              <div>
                <span>LE</span>
              </div>
              <div
                style={{
                  width: 260,
                  marginTop: 6,
                  position: 'relative',
                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                }}
              >
                <div
                  onClick={() => {
                    scribbleNoteUpdateState(
                      formContent.leftScribbleNote,
                      defaultImage,
                      cavanSize,
                      imageSize,
                      position,
                      'Left Eye',
                    )
                  }}
                >
                  <img
                    src={srcLeftEye}
                    style={{
                      maxHeight: thumbnailDisplaySize.height,
                      maxWidth: thumbnailDisplaySize.width,
                    }}
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightDiscColourMargin}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Disc colour, Margin
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftDiscColourMargin}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightNRR}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              NRR
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftNRR}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightCDRatio}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              C / D Ratio
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftCDRatio}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightTetinalVessels}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Tetinal Vessels
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftTetinalVessels}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightMedPeriphery}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Mid Periphery
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftMedPeriphery}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightOcularMedia}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Ocular Media
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftOcularMedia}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightMacula}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Macula
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftMacula}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightFevea}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Fovea
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftFevea}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightOthers}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Others
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftOthers}</div>
            </td>
          </tr>
        </table>
      </GridItem>
      <GridItem md={12} container>
        <div style={{ fontWeight: 500 }}>Remarks:</div>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.remarks}
        </div>
      </GridItem>
    </GridContainer>
  )
}
export default PosteriorEyeExamination
