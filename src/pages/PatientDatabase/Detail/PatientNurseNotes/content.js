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

const PatientNurseNotesContent = ({ clinicianProfile, entity, dispatch }) => {
  const {
    createDate,
    createByUserFK,
    createByUserFullName = '',
    notes,
  } = entity
  const formateDate = moment(createDate).format(dateFormatLongWithTimeNoSec)

  const canEdit =
    clinicianProfile.userProfileFK === createByUserFK &&
    moment(createDate).utc().formatUTC(true) === moment().formatUTC(true)

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
              dispatch({
                type: 'patientNurseNotes/updateState',
                payload: {
                  entity,
                },
              })
            }}
          >
            <Edit />
          </Button>
        )}
      </div>
      <div>
        <span style={{ marginLeft: 20 }}>{notes}</span>
      </div>
    </React.Fragment>
  )
}
export default PatientNurseNotesContent
