import _ from 'lodash'
import moment from 'moment'
import { GridContainer, TextField } from '@/components'
import { scribbleTypes } from '@/utils/codes'
import tablestyles from './PatientHistoryStyle.less'
import { hasValue } from './config'

export default ({
  classes,
  current,
  scribbleNoteUpdateState,
  fieldName = '',
  title,
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
  let e = document.createElement('div')
  e.innerHTML = current[fieldName]
  let htmlData = (e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue)
    .replaceAll('<p', '<div')
    .replaceAll('</p>', '</div>')

  const base64Prefix = 'data:image/jpeg;base64,'

  const { scribbleNotes = [] } = current

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

  const scribbleLink = currentScribbleNotes.map(o => {
    let src
    if (o.thumbnail && o.thumbnail !== '') {
      src = `${base64Prefix}${o.thumbnail}`
    }
    return (
      <div
        style={{
          margin: '5px 10px',
          fontSize: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #CCCCCC',
            width: 253,
            height: 140,
            cursor: 'pointer',
            backgroundColor: 'white',
          }}
          onClick={() => {
            viewScribbleNote(o)
          }}
        >
          {src ? (
            <img
              src={src}
              alt={o.subject}
              style={{ maxHeight: 138, maxWidth: 250 }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
        <span style={{ color: '#4255bd' }}>{o.subject}</span>
      </div>
    )
  })

  if (
    (!hasValue(current[fieldName]) || !current[fieldName].trim().length) &&
    !scribbleLink.length
  )
    return ''
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      {current[fieldName] !== undefined ? (
        <div
          style={{ fontSize: '0.85rem' }}
          className={classes.paragraph}
          dangerouslySetInnerHTML={{ __html: htmlData }}
        />
      ) : (
        ''
      )}
      {scribbleLink.length > 0 && <GridContainer>{scribbleLink}</GridContainer>}
    </div>
  )
}
