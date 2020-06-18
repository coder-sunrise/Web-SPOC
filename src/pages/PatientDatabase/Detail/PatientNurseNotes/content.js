import React from 'react'
import { formatMessage } from 'umi/locale'
import moment from 'moment'
import {
  dateFormatLong,
  dateFormatLongWithTimeNoSec,
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  NumberInput,
  Switch,
  Button,
} from '@/components'
import Edit from '@material-ui/icons/Edit'

const PatientNurseNotesContent = ({ canEdit, entity, handleEdit }) => {
  const { createDate, createByUserFullName = '', notes } = entity
  const formateDate = moment(createDate).format(dateFormatLongWithTimeNoSec)
  let e = document.createElement('div')
  e.innerHTML = notes
  let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

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
        dangerouslySetInnerHTML={{ __html: htmlData }}
        style={{ paddingLeft: 20 }}
      />
    </React.Fragment>
  )
}
export default PatientNurseNotesContent
