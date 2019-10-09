import React, { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import Delete from '@material-ui/icons/Delete'
import { CircularProgress, Chip, withStyles } from '@material-ui/core'
// custom components
import { notification } from 'antd'
import {
  Button,
  Danger,
  GridContainer,
  GridItem,
  Select,
  ProgressButton,
  TextField,
} from '@/components'
// services
import {
  uploadFile,
  downloadAttachment,
  deleteFileByFileID,
} from '@/services/file'
// utils
import { getCodes } from '@/utils/codes'

const Templates = ({ cestemplate, dispatch }) => {
  const [
    templateName,
    setTemplateName,
  ] = useState()
  const [
    currentId,
    setCurrentId,
  ] = useState()

  const { list = [] } = cestemplate
  return (
    <div>
      <Select
        label='My Template'
        strongLabel
        value={currentId}
        options={list}
        valueField='cesId'
        dropdownMatchSelectWidth={false}
        onChange={(v) => {
          console.log(v)
          setCurrentId(v)
        }}
      />
      {currentId && (
        <React.Fragment>
          <ProgressButton>Replace</ProgressButton>
          <ProgressButton color='danger' icon={<Delete />}>
            Delete
          </ProgressButton>
        </React.Fragment>
      )}
      {!currentId && (
        <React.Fragment>
          <TextField
            label='Template Name'
            onChange={(e) => {
              setTemplateName(e.target.value.trim())
            }}
          />
          <ProgressButton
            disabled={!templateName}
            onClick={() => {
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
                }
              })
            }}
          >
            Save
          </ProgressButton>
        </React.Fragment>
      )}
    </div>
  )
}

export default connect(({ cestemplate }) => ({
  cestemplate,
}))(Templates)
