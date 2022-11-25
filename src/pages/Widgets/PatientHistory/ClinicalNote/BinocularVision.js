import { GridContainer, GridItem, Checkbox } from '@/components'
import { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import CoverTest from './components/CoverTest'
import classnames from 'classnames'

const _styles = withStyles(
  theme => ({
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
  }),
  { withTheme: true },
)

const base64Prefix = 'data:image/jpeg;base64,'

class BinocularVision extends PureComponent {
  render() {
    let {
      classes,
      theme: { spacing },
      defaultImage,
      cavanSize,
      imageSize,
      position,
      thumbnailDisplaySize,
      formContent,
      defaultThumbnail,
      scribbleNoteUpdateState,
    } = this.props
    const base64Prefix = 'data:image/jpeg;base64,'

    const srcOcularMotilityScribbleNote = `${base64Prefix}${
      formContent.ocularMotilityScribbleNote
        ? formContent.ocularMotilityScribbleNote.thumbnail
        : defaultThumbnail
    }`

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
          {formContent?.coverTest?.map(coverTestItem => (
            <CoverTest {...coverTestItem} />
          ))}
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
                <div>{formContent?.npc}</div>
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
                <div
                  onClick={() => {
                    scribbleNoteUpdateState(
                      formContent.ocularMotilityScribbleNote,
                      defaultImage,
                      cavanSize,
                      imageSize,
                      position,
                      'OcularMotilityScribbleNote',
                    )
                  }}
                >
                  <img
                    src={srcOcularMotilityScribbleNote}
                    style={{
                      maxHeight: thumbnailDisplaySize.height,
                      maxWidth: thumbnailDisplaySize.width,
                    }}
                  />
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
                    {formContent?.stereopsisTot}
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>{formContent?.stereopsis}</div>
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
                  <span className={classes.itemTitle}>
                    Subjective Phoria Test*
                    <br />
                    <em style={{ fontSize: '0.8rem' }}>
                      (including its magnitude and direction)
                    </em>
                  </span>
                  <div className={classes.itemTitleField}>
                    {formContent?.subjectivePhoriaTestTot}
                  </div>
                </div>
              </td>
              <td width='5%'>D</td>
              <td width='30%'>
                <div>{formContent?.subjectivePhoriaTestD}</div>
              </td>
              <td width='5%'>Vertical</td>
              <td>
                <div>{formContent?.subjectivePhoriaTestDVertical}</div>
              </td>
            </tr>
            <tr>
              <td width='5%'>N</td>
              <td width='30%'>
                <div>{formContent?.subjectivePhoriaTestN}</div>
              </td>
              <td width='5%'>Vertical</td>
              <td>
                <div>{formContent?.subjectivePhoriaTestNVertical}</div>
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
                  <span className={classes.itemTitle}>AC / A Ratio*</span>
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
                    <Checkbox
                      disabled
                      checked={formContent?.acaRatioMaddoxWing}
                      label='Maddox Wing'
                    />

                    <Checkbox
                      disabled
                      checked={formContent?.acaRatioHowellPhoriaCard}
                      label='Howell Phoria Card'
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>+2.00</td>
              <td width='30%'>{formContent?.acaRatioPlusTwo}</td>
              <td width='5%'>-2.00</td>
              <td>{formContent?.acaRatioMinusTwo}</td>
            </tr>
            <tr>
              <td width='5%'>+1.00</td>
              <td>{formContent?.acaRatioPlusOne}</td>
              <td width='5%'>-1.00</td>
              <td>{formContent?.acaRatioMinusOne}</td>
            </tr>
            <tr>
              <td width='5%'>Plano</td>
              <td>{formContent?.acaRatioPlano}</td>
              <td width='5%'>AC/A Ratio</td>
              <td>{formContent?.acaRatio}</td>
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
              <td width='30%'>{formContent?.amplitudeAccommodationRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.amplitudeAccommodationLe}</td>
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
              <td width='30%'>{formContent?.memRe}</td>
              <td width='5%'>LE</td>
              <td width='30%'>{formContent?.memLe}</td>
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
              <td width='30%'>{formContent?.relativeAccommodationPra}</td>
              <td width='5%'>NRA</td>
              <td width='30%'>{formContent?.relativeAccommodationNra}</td>
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
                    {formContent?.fusionalReserveTot}
                  </div>
                </div>
              </td>
              <td width='5%'>D</td>
              <td width='5%'>PFR</td>
              <td width='25%' style={{}}>
                {formContent?.fusionalReserveDPfr}
              </td>
              <td width='5%'>NFR</td>
              <td>{formContent?.fusionalReserveDNfr}</td>
            </tr>
            <tr>
              <td width='5%'>N</td>
              <td width='5%'>PFR</td>
              <td width='25%'>{formContent?.fusionalReserveNPfr}</td>
              <td width='5%'>NFR</td>
              <td>{formContent?.fusionalReserveNNfr}</td>
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
                  <div
                    className={classes.itemTitleField}
                    style={{ bottom: '0px' }}
                  >
                    <Checkbox
                      label='+/- 1'
                      disabled
                      checked={formContent?.acommodationFacilityOne}
                    />
                    <Checkbox
                      label='+/- 2'
                      disabled
                      checked={formContent?.acommodationFacilityTwo}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>Binocular</td>
              <td>{formContent?.acommodationFacilityBinocular}</td>
            </tr>
            <tr>
              <td width='5%'>Monocular</td>
              <td>{formContent?.acommodationFacilityMonocular}</td>
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
                    style={{ bottom: '-15px' }}
                  >
                    <Checkbox
                      label='12 BO/3 BI'
                      disabled
                      checked={formContent?.vergenceFacilityFifteenB}
                    />
                    <Checkbox
                      label='8 BO/B'
                      disabled
                      checked={formContent?.vergenceFacilityEightB}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>Binocular</td>
              <td>{formContent?.vergenceFacilityBinocular}</td>
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
              <td>{formContent?.otherTests}</td>
            </tr>
          </table>
        </GridItem>
      </GridContainer>
    )
  }
}
export default compose(_styles)(BinocularVision)
