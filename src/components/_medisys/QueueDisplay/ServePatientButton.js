import React, { useState, useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { UserAddOutlined } from '@ant-design/icons'
import PersonAdd from '@material-ui/icons/PersonAdd'

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
  if(justShow){
    if(!isAnyServing)
      return null
  }
  else if(isServingAlready)
    return null

  const btn = !justIcon ? (
    <Button
      color='primary'
      size='sm'
      onClick={handleServingBy}
      icon={<PersonAdd style={{transform:'rotateY(180deg)'}}/>}
    >
      Serve Patient
    </Button>
  ) : (
    <Button
      color='primary'
      size='sm'
      justIcon
      style={{ marginRight: '0px' }}
      onClick={handleServingBy}
    >
      <PersonAdd style={{transform:'rotateY(180deg)'}}/>
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
