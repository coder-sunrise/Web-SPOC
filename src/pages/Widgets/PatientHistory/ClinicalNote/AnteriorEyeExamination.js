import React from 'react'
import { GridContainer, GridItem } from '@/components'
const AnteriorEyeExamination = props => {
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
        style={{ position: 'relative', paddingLeft: 140 }}
      >
        <div style={{ position: 'absolute', left: 0, top: 6 }}>
          Grading Chart used:
        </div>
        <div className={classes.textWithBorder} style={{ minHeight: 32 }}>
          {formContent.gradingChartName}
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
                  cursor: 'pointer',
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
                  cursor: 'pointer',
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
              <div>{formContent.rightGeneral}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              General
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftGeneral}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightLidsMargins}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Lids / Margins
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftLidsMargins}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightConjunctiva}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Conjunctiva
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftConjunctiva}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightCornea}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Cornea
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftCornea}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightLens}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Lens
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftLens}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightIris}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Iris
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftIris}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightAnteriorChamber}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Anterior Chamber
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftAnteriorChamber}</div>
            </td>
          </tr>
          <tr>
            <td className={classes.centerCellStyle}>
              <div>{formContent.rightVanHerickAngle}</div>
            </td>
            <td colspan='2' className={classes.centerCellStyle}>
              Van Herick Angle
            </td>
            <td className={classes.centerCellStyle}>
              <div>{formContent.leftVanHerickAngle}</div>
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
export default AnteriorEyeExamination
