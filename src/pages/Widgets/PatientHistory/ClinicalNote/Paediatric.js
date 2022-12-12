import { GridContainer, GridItem } from '@/components'
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

class Paediatric extends PureComponent {
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
      scribbleNoteUpdateState,
      defaultThumbnail,
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
              Paediatric
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
              <td width='70%'>{formContent?.npc}</td>
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
                  <span
                    className={classnames({
                      [classes.itemTitle]: true,
                      [classes.extraDom]: true,
                    })}
                  >
                    Stereopsis
                  </span>
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
        <GridItem md={12} style={{ marginBottom: '20px' }}>
          {'+ Compulsory Test for Paediatric (< 16 years old).'}
        </GridItem>

        {/* Colour Vision */}
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
                    Colour Vision
                  </span>
                  <div className={classes.itemTitleField}>
                    {formContent?.colourVisionTot}
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>{formContent?.colourVision}</div>
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
                    {formContent?.axialLengthInstrument}
                  </div>
                </div>
              </td>
              <td width='70%'>
                <div>{formContent?.axialLength}</div>
              </td>
            </tr>
          </table>
        </GridItem>
      </GridContainer>
    )
  }
}
export default compose(_styles)(Paediatric)
