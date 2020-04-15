import _ from 'lodash'
import { GridContainer } from '@/components'
import { SCRIBBLE_NOTE_TYPE } from '@/utils/constants'

export default ({
  classes,
  current,
  scribbleNoteUpdateState,
  fieldName = '',
}) => {
  let e = document.createElement('div')
  e.innerHTML = current[fieldName]
  let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

  const base64Prefix = 'data:image/jpeg;base64,'
  const scribbleTypes = [
    { type: 'history', typeFK: SCRIBBLE_NOTE_TYPE.HISTORY },
    { type: 'chiefComplaints', typeFK: SCRIBBLE_NOTE_TYPE.CHIEFCOMPLAINTS },
    { type: 'note', typeFK: SCRIBBLE_NOTE_TYPE.CLINICALNOTES },
    { type: 'plan', typeFK: SCRIBBLE_NOTE_TYPE.PLAN },
  ]

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
        showScribbleModal: true,
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
        }}
      >
        <a
          style={{ textDecoration: 'underline' }}
          onClick={() => {
            viewScribbleNote(o)
          }}
        >
          {o.subject}
        </a>
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
