import React from 'react'
import { formatMessage } from 'umi'
import moment from 'moment'
import { Button } from '@/components'
import Edit from '@material-ui/icons/Edit'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'
import { Timeline } from 'antd';

const PatientNurseNotesContent = ({ canEdit, entity, handleEdit,isEditableNotes }) => {
  const {
    createDate,
    createByUserName = '',
    createByUserTitle = '',
    notes = '',
    createByUserRole = '',
  } = entity

  const formateDate = moment(createDate).format('DD MMM YYYY HH:mm') 
  const createByUserFullName = `${createByUserTitle} ${createByUserName}`
  const html = htmlDecodeByRegExp(notes)
  return (
    <React.Fragment>
      <div style={{ margin: '0px 20px 10px 5px', fontWeight: 'bold' }}>
        <span>{`${formateDate} - ${createByUserFullName} (${createByUserRole})`}</span>
        {!canEdit ? (
          ''
        ) : (
          <Button
            disabled={!isEditableNotes}
            style={{ marginLeft: 10, marginTop: 10 }}
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
