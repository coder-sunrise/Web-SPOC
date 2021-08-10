import React, { useState, useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { UserAddOutlined } from '@ant-design/icons'

import { notification, Tooltip, Button, ProgressButton } from '@/components'

const ServePatientButton = ({
  dispatch,
  servingPersons = [],
  justShow = false,
  user,
  patientName,
  visitFK,
  justIcon = true,
  onConfirm = null,
}) => {
  const handleServingBy = () => {
    if (justShow) return false

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: 'Patient Serving',
        openConfirmContent: `Are you sure to serve patient ${patientName}?`,
        onConfirmSave: () => {
          if(onConfirm)
            onConfirm()
          else
          dispatch({
            type: 'queueLog/setServingPerson',
            payload: { visitFK: visitFK },
          })
        },
      },
    })
  }

  const isAnyServing = servingPersons.length > 0
  const isServingAlready = isAnyServing
    ? servingPersons.filter(x => x.servingByUserFK === user.id).length > 0
    : false
  const clinicRoleFK = user.clinicianProfile.userProfile?.role?.clinicRoleFK
  if(justShow){
    if(!isAnyServing)
      return null
  }
  else if(clinicRoleFK !== 2 || isServingAlready)
    return null

  const btn = !justIcon ? (
    <ProgressButton
      color={'primary'}
      size='sm'
      onClick={handleServingBy}
      icon={<UserAddOutlined />}
    >
      Serve Patient
    </ProgressButton>
  ) : (
    <Button
      color='primary'
      size='sm'
      justIcon
      style={{ marginRight: '0px' }}
      onClick={handleServingBy}
    >
      <UserAddOutlined />
    </Button>
  )

  return isAnyServing ? (
    <Tooltip
      title={
        isAnyServing
          ? `Serve By ${servingPersons.map(o => o.servingBy).join(', ')}`
          : null
      }
    >
      {btn}
    </Tooltip>
  ) : (
    btn
  )
}

export default React.memo(
  compose(
    connect(({ user }) => ({
      user: user.data || {},
    })),
  )(ServePatientButton),
)
