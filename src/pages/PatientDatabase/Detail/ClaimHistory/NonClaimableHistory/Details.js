import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import Yup from '@/utils/yup'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  Tooltip,
  withFormikExtend,
  FastField,
  Button,
  dateFormatLongWithTimeNoSec,
  MultipleTextField,
} from '@/components'
const styles = theme => ({})
const ContentGridItem = ({ children, title }) => {
  return (
    <GridItem md={12} style={{ paddingLeft: 70 }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: 70,
            textAlign: 'right',
            position: 'absolute',
            left: '-70px',
            fontWeight: 600,
            top: '6px',
          }}
        >
          {title}
        </div>
        <div style={{ marginLeft: 6 }}> {children}</div>
      </div>
    </GridItem>
  )
}
const Details = ({ values, onClose, handleSubmit }) => {
  const getUpdateMessage = () => {
    if (!values.id) return ''
    const updateUser = `${
      values.updateUserTitle && values.updateUserTitle.trim().length
        ? `${values.updateUserTitle}. `
        : ''
    }${values.updateUserName || ''}`

    return `Last Updated by ${updateUser} on ${moment(
      values.lastUpdateDate,
    ).format(dateFormatLongWithTimeNoSec)}`
  }
  return (
    <div style={{ padding: '0px 10px' }}>
      <GridContainer>
        <ContentGridItem
          title={
            <div>
              Reason:&nbsp;
              {(values.details === undefined ||
                values.details === null ||
                !values.details.trim().length) && (
                <span style={{ color: 'red' }}>*</span>
              )}
            </div>
          }
        >
          <FastField
            name='details'
            render={args => (
              <MultipleTextField maxLength={2000} rows={5} {...args} />
            )}
          />
        </ContentGridItem>
        <ContentGridItem title='Remarks:'>
          <FastField
            name='remarks'
            render={args => (
              <MultipleTextField maxLength={2000} rows={3} {...args} />
            )}
          />
        </ContentGridItem>
      </GridContainer>
      <div
        style={{
          margin: '10px 0px',
          position: 'relative',
          paddingRight: 220,
          height: 18,
        }}
      >
        <Tooltip title={getUpdateMessage()}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 400,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {getUpdateMessage()}
          </div>
        </Tooltip>
        <div style={{ position: 'absolute', right: 0, bottom: '-6px' }}>
          <Button
            color='danger'
            size='sm'
            onClick={() => {
              if (onClose) {
                onClose()
              }
            }}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            size='sm'
            onClick={() => {
              if (handleSubmit) {
                handleSubmit()
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ nonClaimableHistory }) => ({
    nonClaimableHistory: nonClaimableHistory,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ nonClaimableHistory, patientProfileFK }) => {
      return nonClaimableHistory.entity || { patientProfileFK }
    },
    validationSchema: Yup.object().shape({
      details: Yup.string().required(),
    }),
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onConfirm } = props
      dispatch({
        type: 'nonClaimableHistory/upsert',
        payload: {
          ...values,
        },
      }).then(r => {
        if (r) {
          resetForm()
          if (onConfirm) onConfirm()
        }
      })
    },
    displayName: 'NonClaimableHistoryDetails',
  }),
)(Details)
