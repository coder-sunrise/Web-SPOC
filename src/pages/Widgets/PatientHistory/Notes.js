import _ from 'lodash'
import moment from 'moment'
import { GridContainer, TextField, dateFormatLong } from '@/components'
import { scribbleTypes } from '@/utils/codes'
import tablestyles from './PatientHistoryStyle.less'
import { VISIT_TYPE } from '@/utils/constants'

export default ({
  classes,
  current,
  scribbleNoteUpdateState,
  fieldName = '',
}) => {
  if (fieldName === 'visitRemarks') {
    return (
      <TextField
        inputRootCustomClasses={tablestyles.historyText}
        noUnderline
        multiline
        disabled
        value={current.visitRemarks || ''}
      />
    )
  }
  if (fieldName === 'visitReferral') {
    let referral = ''
    if (current.referralPatientProfileFK) {
      referral = `Referred By Patient: ${current.referralPatientName}`
    } else if (current.referralSourceFK) {
      referral = `Referred By: ${current.referralSource}`
      if (current.referralPersonFK) {
        referral = `Referred By: ${current.referralSource}        Referral Person: ${current.referralPerson}`
      }
    }
    if (current.referralRemarks) {
      referral += `\r\n\r\nRemarks: ${current.referralRemarks}`
    }
    // const { referralBy = '', referralInstitution = '', referralDate } = current
    // const referral = `Referred By: ${referralBy}        Referral Date: ${referralDate
    //   ? moment(referralDate).format('DD MMM YYYY')
    //   : '-'}        Institution: ${referralInstitution}`
    return (
      <TextField
        inputRootCustomClasses={tablestyles.historyText}
        noUnderline
        multiline
        disabled
        value={referral}
      />
    )
  }

  const base64Prefix = 'data:image/jpeg;base64,'

  const { scribbleNotes = [], doctorNotes = [] } = current

  let currentScribbleNotes = []
  const scribbleType = scribbleTypes.find(o => o.type === fieldName)
  if (scribbleType) {
    currentScribbleNotes = _.orderBy(
      scribbleNotes.filter(o => o.scribbleNoteTypeFK === scribbleType.typeFK),
      ['subject'],
      ['asc'],
    )
  }

  const viewScribbleNote = scribbleNote => {
    scribbleNoteUpdateState(scribbleNote)
    window.g_app._store.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        showViewScribbleModal: true,
        isReadonly: true,
        entity: scribbleNote,
      },
    })
  }

  const doctorNote = userProfileFK => {
    const doctorNote = doctorNotes.find(
      n =>
        current.visitPurposeFK !== VISIT_TYPE.MC ||
        n.signedByUserFK === userProfileFK,
    )
    const doctorScrible = currentScribbleNotes.filter(
      s =>
        current.visitPurposeFK !== VISIT_TYPE.MC ||
        s.signedByUserFK === userProfileFK,
    )
    if (!doctorNote) return ''
    if (
      (doctorNote[fieldName] === undefined ||
        doctorNote[fieldName] === null ||
        !doctorNote[fieldName].trim().length) &&
      !doctorScrible.length
    )
      return ''
    let e = document.createElement('div')
    e.innerHTML = doctorNote[fieldName]
    let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

    const noteUserName = `${
      doctorNote.signedByUserTitle && doctorNote.signedByUserTitle.trim().length
        ? `${doctorNote.signedByUserTitle} ${doctorNote.signedByUserName || ''}`
        : `${doctorNote.signedByUserName || ''}`
    }`
    const noteCreateBy = `${noteUserName}, ${moment(
      doctorNote.orderDate,
    ).format(dateFormatLong)}`

    const scribbleLink = doctorScrible.map(o => {
      let src
      if (o.thumbnail && o.thumbnail !== '') {
        src = `${base64Prefix}${o.thumbnail}`
      }

      return (
        <div
          style={{
            margin: '4px 10px 0px 8px',
            fontSize: '0.85rem',
            display: 'inline-block',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #CCCCCC',
              width: 278,
              height: 153,
              cursor: 'pointer',
            }}
            onClick={() => {
              viewScribbleNote(o)
            }}
          >
            {src ? (
              <img src={src} alt={o.subject} width={275} height={150} />
            ) : (
              <span>No Image</span>
            )}
          </div>
          <div
            title={o.subject}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: 277,
            }}
          >
            {o.subject}
          </div>
        </div>
      )
    })
    return (
      <div style={{ margin: '4px 0px 10px 0px' }}>
        {doctorNote[fieldName] !== undefined ? (
          <div>
            <div style={{ marginLeft: 8, textDecoration: 'underline' }}>
              {noteCreateBy}
            </div>
            <div
              style={{ fontSize: '0.85rem' }}
              className={classes.paragraph}
              dangerouslySetInnerHTML={{ __html: htmlData }}
            />
          </div>
        ) : (
          ''
        )}
        {scribbleLink.length > 0 && <div>{scribbleLink}</div>}
      </div>
    )
  }
  return (
    <div>
      {current.visitPurposeFK === VISIT_TYPE.MC
        ? current.doctors.map(r => doctorNote(r.userProfileFK))
        : doctorNote()}
    </div>
  )
}
