import { Table } from 'antd'
import moment from 'moment'
import tablestyles from './PatientHistoryStyle.less'
import { Tooltip, dateFormatLongWithTimeNoSec } from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import { scribbleTypes } from '@/utils/codes'
import Notes from './Notes'
import { notesTypes, showNote } from './config'

const wrapCellTextStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
}

export default ({
  classes,
  current,
  scribbleNoteUpdateState,
  getSelectNoteTypes,
}) => {
  const getData = () => {
    if (!getSelectNoteTypes().length) return []
    const selectNoteTypes = notesTypes.filter(
      n => getSelectNoteTypes().indexOf(n.value) >= 0,
    )
    const { doctorNotes = [], scribbleNotes = [], visitPurposeFK } = current
    let data = doctorNotes
      .filter(note =>
        selectNoteTypes.find(noteType =>
          showNote(note, scribbleNotes, noteType, visitPurposeFK),
        ),
      )
      .map(note => {
        const doctorScibble = scribbleNotes.filter(
          s =>
            visitPurposeFK !== VISIT_TYPE.MC ||
            s.signedByUserFK === note.signedByUserFK,
        )
        return {
          ...note,
          scribbleNotes: doctorScibble,
        }
      })
    return data
  }

  const getColumns = () => {
    if (!getSelectNoteTypes().length) return
    const selectNoteTypes = notesTypes.filter(
      n => getSelectNoteTypes().indexOf(n.value) >= 0,
    )

    let columns = [
      {
        dataIndex: 'doctor',
        title: 'Doctor',
        width: 150,
        render: (text, row) => {
          const noteUserName = `${
            row.signedByUserTitle && row.signedByUserTitle.trim().length
              ? `${row.signedByUserTitle} ${row.signedByUserName || ''}`
              : `${row.signedByUserName || ''}`
          }`
          return <span>{noteUserName}</span>
        },
      },
    ]

    selectNoteTypes.forEach(noteType => {
      columns.push({
        dataIndex: noteType.fieldName,
        title: noteType.title,
        render: (text, row) => {
          return (
            <Notes
              classes={classes}
              current={row}
              scribbleNoteUpdateState={scribbleNoteUpdateState}
              fieldName={noteType.fieldName}
            />
          )
        },
      })
    })

    columns.push({
      dataIndex: 'signedDate',
      title: 'Last Update Time',
      width: 140,
      render: (text, row) => {
        return (
          <span>
            {moment(row.signedDate).format(dateFormatLongWithTimeNoSec)}
          </span>
        )
      },
    })

    return columns
  }

  return (
    <div style={{ marginBottom: 8, marginTop: 8 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        dataSource={getData()}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
        columns={getColumns()}
      />
    </div>
  )
}