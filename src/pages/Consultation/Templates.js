import React, { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import { compose } from 'redux'
import Delete from '@material-ui/icons/Delete'
import GetApp from '@material-ui/icons/GetApp'
import {
  CircularProgress,
  Chip,
  FormControlLabel,
  withStyles,
} from '@material-ui/core'
// custom components
import {
  Button,
  Danger,
  CheckboxGroup,
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
const Templates = ({
  cestemplate,
  dispatch,
  theme,
  onLoadTemplate,
  onSaveTemplate,
}) => {
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
    if (onSaveTemplate) onSaveTemplate()
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

  const updateTemplate = () => {
    if (onSaveTemplate) onSaveTemplate()

    dispatch({
      type: 'cestemplate/update',
      payload: currentId,
    }).then((o) => {
      if (o) {
        notification.success({
          message: `Template ${templateName} saved`,
        })
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

  const loadTemplate = () => {
    dispatch({
      type: 'cestemplate/queryOne',
      payload: currentId,
    }).then((o) => {
      if (o) {
        notification.success({
          message: `Template ${templateName} loaded`,
        })
        if (onLoadTemplate) onLoadTemplate(o)
      }
    })
  }
  return (
    <div>
      <GridContainer gutter={0} style={{ marginBottom: theme.spacing(1) }}>
        <GridItem xs={12}>
          <h5 style={{ fontWeight: 500, lineHeight: 1.3 }}>Manage Template</h5>
        </GridItem>
        <GridItem xs={8}>
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
        <GridItem xs={4} alignItems='flex-end' justify='flex-end' container>
          <ProgressButton
            icon={<GetApp />}
            disabled={!currentId}
            onClick={loadTemplate}
          >
            Load
          </ProgressButton>
        </GridItem>
      </GridContainer>

      {currentId && (
        <GridContainer gutter={0}>
          <GridItem xs={12}>
            <ProgressButton onClick={updateTemplate}>Replace</ProgressButton>
            <Popconfirm onConfirm={deleteTemplate}>
              <ProgressButton color='danger' icon={<Delete />}>
                Delete
              </ProgressButton>
            </Popconfirm>
          </GridItem>
          {/* <GridItem xs={6} justify='flex-end' container>
            
          </GridItem> */}
        </GridContainer>
      )}
      {!currentId && (
        <GridContainer
          gutter={0}
          style={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),
          }}
        >
          <GridItem xs={12}>
            <h5 style={{ fontWeight: 500, lineHeight: 1.3 }}>
              Add New Template
            </h5>
          </GridItem>
          <GridItem xs={8}>
            <TextField
              label='Template Name'
              onChange={(e) => {
                setTemplateName(e.target.value.trim())
              }}
            />
          </GridItem>
          <GridItem xs={4} alignItems='flex-end' justify='flex-end' container>
            <ProgressButton disabled={!templateName} onClick={saveTemplate}>
              Save
            </ProgressButton>
          </GridItem>
        </GridContainer>
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
