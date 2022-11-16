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
    verticalAlign: 'top',
  },
  centerCellStyle: {
    border: '1px solid #CCCC',
    padding: '8px 4px',
    textAlign: 'center',
    verticalAlign: 'top',
  },
  textWithBorder: {
    border: '1px solid #CCCCCC',
    padding: 4,
    width: '100%',
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
                >{`Last Update on ${moment(formList[0].lastUpdateDate).format(
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
