import _ from 'lodash'
import moment from 'moment'
import { GridContainer, TextField } from '@/components'
import { scribbleTypes } from '@/utils/codes'
import tablestyles from './PatientHistoryStyle.less'

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
    const { referralBy = '', referralInstitution = '', referralDate } = current
    return (
      <div style={{ fontSize: '0.875rem', marginLeft: 8 }}>
        <span>{`Referred By: ${referralBy}`}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          {`Referral Date: ${referralDate
            ? moment(referralDate).format('DD MMM YYYY')
            : '-'}`}
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>{`Institution: ${referralInstitution}`}</span>
      </div>
    )
  }
  let e = document.createElement('div')
  e.innerHTML = current[fieldName]
  let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

  const base64Prefix = 'data:image/jpeg;base64,'

  const { scribbleNotes = [] } = current

  let currentScribbleNotes = []
  const scribbleType = scribbleTypes.find((o) => o.type === fieldName)
  if (scribbleType) {
    currentScribbleNotes = _.orderBy(
      scribbleNotes.filter((o) => o.scribbleNoteTypeFK === scribbleType.typeFK),
      [
        'subject',
      ],
      [
        'asc',
      ],
    )
  }

  const viewScribbleNote = (scribbleNote) => {
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

  const scribbleLink = currentScribbleNotes.map((o) => {
    let src
    if (o.thumbnail && o.thumbnail !== '') {
      src = `${base64Prefix}${o.thumbnail}`
    }
    return (
      <div
        style={{
          margin: 10,
          fontSize: '0.875rem',
        }}
      >
        <span>{o.subject}</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #CCCCCC',
            width: 277,
            height: 152,
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
      </div>
    )
  })
  return (
    <div>
      {current[fieldName] !== undefined ? (
        <div
          style={{ fontSize: '0.875rem' }}
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
