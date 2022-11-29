import * as WidgetConfig from '../config'
import { getIn } from 'formik'
import withStyles from '@material-ui/core/styles/withStyles'
import moment from 'moment'
import { dateFormatLongWithTimeNoSec } from '@/components'

const styles = theme => ({
  symbolText: {
    position: 'relative',
    top: 8,
    textAlign: 'center',
  },
  cellStyle: {
    border: '1px solid #CCCC',
    padding: '8px 4px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  centerCellStyle: {
    border: '1px solid #CCCC',
    padding: '8px 4px',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  textWithBorder: {
    border: '1px solid #CCCCCC',
    padding: 4,
    width: '100%',
  },
  textWithUnderline: {
    borderBottom: '1px solid #CCCCCC',
    overflowWrap: 'anywhere',
    padding: 4,
    width: '100%',
    minHeight: 31,
  },
  sectionTitle: {
    fontWeight: 500,
    marginTop: 8,
  },
  tableWithoutBorder: {
    width: '100%',
    '& > tr > td': {
      textAlign: 'center',
      padding: '4px',
      overflowWrap: 'anywhere',
    },
  },
  tableWithBorder: {
    width: '100%',
    '& > tr > td': {
      border: '1px solid #CCCCCC',
      textAlign: 'center',
      padding: '4px',
      overflowWrap: 'anywhere',
    },
  },
  cellLabel: {
    textAlign: 'right !important',
    paddingRight: '16px !important',
  },
})

const ClinicalNotes = props => {
  const { current, selectForms = [], scribbleNoteUpdateState } = props
  return (
    <div>
      {WidgetConfig.formWidgets(props, scribbleNoteUpdateState).map(fw => {
        const formList = getIn(current, fw.prop)
        if (
          selectForms.indexOf(fw.id) >= 0 &&
          formList &&
          formList.length > 0
        ) {
          const FormWidget = fw.component
          return (
            <div style={{ marginBottom: 8 }}>
              <div>
                <span
                  style={{
                    fontWeight: 500,
                    color: 'darkBlue',
                    fontSize: '0.85rem',
                    marginRight: 10,
                  }}
                >
                  {fw.name}
                </span>
                <span
                  style={{ fontStyle: 'italic', fontSize: '0.7rem' }}
                >{`Last Update on ${moment(formList[0].lastChangeDate).format(
                  dateFormatLongWithTimeNoSec,
                )}`}</span>
              </div>
              <div style={{ padding: 16, border: '1px solid #CCCCCC' }}>
                <FormWidget
                  formContent={formList[0]}
                  {...props}
                  defaultImage={fw.defaultImage}
                  cavanSize={fw.cavanSize}
                  imageSize={fw.imageSize}
                  position={fw.position}
                  thumbnailDisplaySize={fw.thumbnailDisplaySize}
                  defaultThumbnail={fw.defaultThumbnail}
                />
              </div>
            </div>
          )
        }
        return ''
      })}
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
