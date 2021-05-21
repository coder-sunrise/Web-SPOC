import React from 'react'
import { formatMessage } from 'umi'
import moment from 'moment'
import { Button } from '@/components'
import Edit from '@material-ui/icons/Edit'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'

const PatientNurseNotesContent = ({ canEdit, entity, handleEdit }) => {
  const {
    createDate,
    createByUserName = '',
    createByUserTitle = '',
    notes = '',
  } = entity
  const formateDate = moment(createDate).format('DD MMM YYYY HH:mm')
  const createByUserFullName = `${createByUserTitle} ${createByUserName}`
  const html = htmlDecodeByRegExp(notes)
  return (
    <React.Fragment>
      <div style={{ margin: '20px 20px 10px 10px', fontWeight: 'bold' }}>
        <span>{`${formateDate} - Nurse Notes - ${createByUserFullName}`}</span>
        {!canEdit ? (
          ''
        ) : (
          <Button
            style={{ marginLeft: 10 }}
            justIcon
            color='primary'
            size='sm'
            onClick={() => {
              handleEdit(entity)
            }}
          >
            <Edit />
          </Button>
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ paddingLeft: 20 }}
      />
    </React.Fragment>
  )
}
export default PatientNurseNotesContent
