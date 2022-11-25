import { GridContainer, GridItem } from '@/components'

const CellBordered = (value, colspan, style) => (
  <td colspan={colspan}>
    <div
      style={{
        border: '1px solid #cccccc',
        minHeight: 'calc(1rem + 8px)',
        overflowWrap: 'anywhere',
        padding: '0 4px',
        ...style,
      }}
    >
      {value}
    </div>
  </td>
)
export default ({
  formContent,
  classes,
  scribbleNoteUpdateState,
  defaultImage,
  cavanSize,
  imageSize,
  position,
  thumbnailDisplaySize,
  defaultThumbnail,
}) => {
  const base64Prefix = 'data:image/jpeg;base64,'

  return (
    <GridContainer>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
          Contact Lens Fitting
        </span>
      </GridItem>
      <GridItem md={12} style={{ position: 'relative', top: 6 }}>
        Please illustrate the lens fitting below.
      </GridItem>
      <GridItem md={12} style={{ padding: '10px 0 0 0' }}>
        {formContent.corContactLensFitting_Item?.map(item => {
          const srcRightEye = `${base64Prefix}${
            item.rightScribbleNote
              ? item.rightScribbleNote.thumbnail
              : defaultThumbnail
          }`
          const srcLeftEye = `${base64Prefix}${
            item.leftScribbleNote
              ? item.leftScribbleNote.thumbnail
              : defaultThumbnail
          }`
          return (
            <div style={{ width: '100%', marginBottom: 10 }}>
              <GridItem md={12}>
                <table className={classes.tableWithBorder}>
                  <tr>
                    <th style={{ width: '40%' }}></th>
                    <th style={{ width: '10%' }}></th>
                    <th style={{ width: '10%' }}></th>
                    <th style={{ width: '40%' }}></th>
                  </tr>
                  <tr>
                    <td colspan='2'>
                      <div style={{ textAlign: 'left' }}>
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
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            scribbleNoteUpdateState(
                              item.rightScribbleNote,
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
                    <td colspan='2'>
                      <div style={{ textAlign: 'left' }}>
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
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            scribbleNoteUpdateState(
                              item.leftScribbleNote,
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
                    <td>{item.reLensDetails}</td>
                    <td colspan='2'>Lens Details</td>
                    <td>{item.leLensDetails}</td>
                  </tr>
                  <tr>
                    <td>{item.reComfort}</td>
                    <td colspan='2'>Comfort</td>
                    <td>{item.leComfort}</td>
                  </tr>
                  <tr>
                    <td>{item.reCoverage}</td>
                    <td colspan='2'>Coverage</td>
                    <td>{item.leCoverage}</td>
                  </tr>
                  <tr>
                    <td>{item.reCentration}</td>
                    <td colspan='2'>Centration</td>
                    <td>{item.leCentration}</td>
                  </tr>
                  <tr>
                    <td>{item.reLagSag}</td>
                    <td colspan='2'>Lag / Sag</td>
                    <td>{item.leLagSag}</td>
                  </tr>
                  <tr>
                    <td>{item.reMovementPGM}</td>
                    <td colspan='2'>Movement (PGM)</td>
                    <td>{item.leMovementPGM}</td>
                  </tr>
                  <tr>
                    <td>{item.reMovementUpgaze}</td>
                    <td colspan='2'>Movement (Upgaze)</td>
                    <td>{item.leMovementUpgaze}</td>
                  </tr>
                  <tr>
                    <td>{item.reMovementPushup}</td>
                    <td colspan='2'>Movement (Pushup)</td>
                    <td>{item.reMovementPushup}</td>
                  </tr>
                  <tr>
                    <td>{item.reVADN}</td>
                    <td colspan='2'>VA (D / N)</td>
                    <td>{item.leVADN}</td>
                  </tr>
                  <tr>
                    <td>{item.reOverRxVA}</td>
                    <td colspan='2'>Over Rx (VA)</td>
                    <td>{item.leOverRxVA}</td>
                  </tr>
                  <tr>
                    <td>{item.reConclusionOfLensFit}</td>
                    <td colspan='2'>Conclusion of lens fit</td>
                    <td>{item.leConclusionOfLensFit}</td>
                  </tr>
                </table>
              </GridItem>
              <GridItem md={12} container>
                <div className={classes.sectionTitle}>Remarks:</div>
                <div
                  style={{
                    border: '1px solid #cccccc',
                    minHeight: 84,
                    overflowWrap: 'anywhere',
                    padding: '0 4px',
                    width: '100%',
                  }}
                >
                  {item.remarks}
                </div>
              </GridItem>
            </div>
          )
        })}
      </GridItem>
    </GridContainer>
  )
}
