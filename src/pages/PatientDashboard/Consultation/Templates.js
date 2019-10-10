import React, { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import { compose } from 'redux'
import Delete from '@material-ui/icons/Delete'
import GetApp from '@material-ui/icons/GetApp'
import { CircularProgress, Chip, withStyles } from '@material-ui/core'
// custom components
import {
  Button,
  Danger,
  GridContainer,
  GridItem,
  Select,
  ProgressButton,
  TextField,
  Popconfirm,
  notification,
} from '@/components'
// services
import {
  uploadFile,
  downloadAttachment,
  deleteFileByFileID,
} from '@/services/file'
// utils
import { getCodes } from '@/utils/codes'

const styles = () => ({})
const Templates = ({ cestemplate, dispatch, theme }) => {
  const [
    templateName,
    setTemplateName,
  ] = useState()
  const [
    currentId,
    setCurrentId,
  ] = useState()

  const { list = [] } = cestemplate

  const saveTemplate = () => {
    dispatch({
      type: 'cestemplate/create',
      payload: {
        name: templateName,
      },
    }).then((o) => {
      if (o) {
        notification.success({
          message: `Template ${templateName} saved`,
        })
        dispatch({
          type: 'cestemplate/query',
        })
        setTemplateName('')
      }
    })
  }

  const deleteTemplate = () => {
    dispatch({
      type: 'cestemplate/delete',
      payload: currentId,
    }).then((o) => {
      if (o) {
        notification.success({
          message: `Template ${templateName} deleted`,
        })
        dispatch({
          type: 'cestemplate/query',
        })
        setCurrentId(undefined)
      }
    })
  }
  return (
    <div>
      <GridContainer gutter={0} style={{ marginBottom: theme.spacing(1) }}>
        <GridItem xs={6}>
          <Select
            label='My Template'
            strongLabel
            value={currentId}
            options={list}
            valueField='cesId'
            dropdownMatchSelectWidth={false}
            onChange={(v) => {
              setCurrentId(v)
              setTemplateName('')
            }}
          />
        </GridItem>
        <GridItem xs={6} alignItems='flex-end' justify='flex-end' container>
          <ProgressButton icon={<GetApp />} disabled={!currentId}>
            Load
          </ProgressButton>
        </GridItem>
      </GridContainer>

      {currentId && (
        <GridContainer gutter={0}>
          <GridItem xs={6}>
            <ProgressButton>Replace</ProgressButton>
          </GridItem>
          <GridItem xs={6} justify='flex-end' container>
            <Popconfirm onConfirm={deleteTemplate}>
              <ProgressButton color='danger' icon={<Delete />}>
                Delete
              </ProgressButton>
            </Popconfirm>
          </GridItem>
        </GridContainer>
      )}
      {!currentId && (
        <React.Fragment>
          <TextField
            label='Template Name'
            onChange={(e) => {
              setTemplateName(e.target.value.trim())
            }}
          />
          <ProgressButton disabled={!templateName} onClick={saveTemplate}>
            Save
          </ProgressButton>
        </React.Fragment>
      )}
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ cestemplate }) => ({
    cestemplate,
  })),
)(Templates)
