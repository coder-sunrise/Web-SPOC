import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'

const _styles = withStyles(
  theme => ({
    containerTable: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '15px',
      '& > tr > td': {
        height: theme.spacing(10),
      },
    },
    itemTable: {
      width: '100%',
      '& > tr > td': {
        border: '1px solid #ccc',
        height: theme.spacing(10),
        whiteSpace: 'pre-line',
        wordBreak: 'break-all',
        wordWrap: 'break-word',
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
  }),
  { withTheme: true },
)

const PreliminaryAssessment = props => {
  let {
    classes,
    theme,
    thumbnailDisplaySize,
    defaultImage,
    cavanSize,
    imageSize,
    position,
    formContent,
    scribbleNoteUpdateState,
    defaultThumbnail,
  } = props
  const base64Prefix = 'data:image/jpeg;base64,'

  const srcConfrontationScribbleNote = `${base64Prefix}${
    formContent.confrontationScribbleNote
      ? formContent.confrontationScribbleNote.thumbnail
      : defaultThumbnail
  }`
  const srcPupillaryAssessmentScribbleNote = `${base64Prefix}${
    formContent.pupillaryAssessmentScribbleNote
      ? formContent.pupillaryAssessmentScribbleNote.thumbnail
      : defaultThumbnail
  }`

  return (
    <table className={classes.containerTable}>
      <tr>
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>
          Preliminary Assessment
        </span>
      </tr>

      {/* Pupillary Assessment */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr height={theme.spacing(15)}>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Pupillary Assessment
                  </span>
                </div>
              </td>
              <td width='70%'>
                <div
                  onClick={() => {
                    scribbleNoteUpdateState(
                      formContent.pupillaryAssessmentScribbleNote,
                      defaultImage.PupillaryAssessment,
                      cavanSize,
                      imageSize,
                      position,
                      'Pupillary Assessment',
                    )
                  }}
                >
                  <img
                    src={srcPupillaryAssessmentScribbleNote}
                    style={{
                      maxHeight: thumbnailDisplaySize.height,
                      maxWidth: thumbnailDisplaySize.width,
                    }}
                  />
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Pupillary Size (Bright / dm)  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Pupil Size (Bright / dim)
                  </span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.pupillarySizeRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.pupillarySizeLe}</td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Keratometry Reading  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Keratometry Reading</span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.keratometryReadingRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.keratometryReadingLe}</td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Tonometry Instrument  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Tonometry Instrument
                  </span>
                  <br />
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '15px',
                      left: '5px',
                    }}
                  >
                    {formContent?.tonometryInstrument}
                  </div>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '35px',
                      left: '5px',
                    }}
                  >
                    {formContent?.tonometryInstrumentTime}
                  </div>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.tonometryInstrumentRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.tonometryInstrumentLe}</td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Corneal Pachymetry */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Corneal Pachymetry</span>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '15px',
                      left: '5px',
                    }}
                  >
                    {formContent?.cornealPachymetryInstrument}
                  </div>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.cornealPachymetryRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.cornealPachymetryLe}</td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Confrontation  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Confrontation</span>
                </div>
              </td>

              <td width='70%'>
                <div
                  onClick={() => {
                    scribbleNoteUpdateState(
                      formContent.confrontationScribbleNote,
                      defaultImage.Confrontation,
                      cavanSize,
                      imageSize,
                      position,
                      'Confrontation',
                    )
                  }}
                >
                  <img
                    src={srcConfrontationScribbleNote}
                    style={{
                      maxHeight: thumbnailDisplaySize.height,
                      maxWidth: thumbnailDisplaySize.width,
                    }}
                  />
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Amsler  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Amsler</span>
                  <br />
                  <span
                    style={{
                      position: 'absolute',
                      top: '25px',
                      left: '5px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {`Please scan and upload into Patient Document(if there's any
                    findings)`}
                  </span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.amslerRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.amslerLe}</td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Colour Vision  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Colour Vision</span>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '15px',
                      left: '5px',
                    }}
                  >
                    {formContent?.colourVisionTot}
                  </div>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>{formContent?.colourVisionRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.colourVisionLe}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <span>{`  + Compulsory Test for Paediatric (< 16 years old)`}</span>
      </tr>

      {/* Other relevant Tests  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Other relevant Tests
                  </span>
                </div>
              </td>

              <td width='70%'>{formContent?.otherRelevantTests}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  )
}

export default compose(_styles)(PreliminaryAssessment)
