import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  GetApp as Download,
  Delete,
  Visibility,
  Edit,
  BorderColor,
} from '@material-ui/icons'

import {
  CommonTableGrid,
  EditableTableGrid,
  Button,
  Tooltip,
  Popconfirm,
  DatePicker,
  IconButton,
} from '@/components'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
import { Chip } from '@material-ui/core'

import { downloadAttachment } from '@/services/file'
import SetFolderWithPopover from './SetFolderWithPopover'

class Grid extends PureComponent {
  downloadFile = row => {
    const { fileName } = row
    const splits = fileName.split('.')
    const ext = splits[splits.length - 1]

    if (ext !== row.fileExtension) {
      downloadAttachment({
        ...row,
        fileName: `${fileName}.${row.fileExtension}`,
      })
    } else downloadAttachment(row)
  }

  render() {
    const {
      dispatch,
      onPreview,
      patient: { entity },
      attachmentList = [],
      selectedFolderFK,
      folderList = [],
      onEditFileName,
      onAddNewFolders,
      onFileUpdated,
      readOnly,
    } = this.props

    const patientIsActive = entity && entity.isActive
    return (
      <CommonTableGrid
        style={{ margin: '0px 1px 0px 0px' }}
        forceRender
        rows={attachmentList
          .filter(
            f =>
              selectedFolderFK === -99 ||
              f.folderFKs.includes(selectedFolderFK),
          )
          .map(a => {
            return { ...a, folderList: _.sortBy(folderList, 'sortOrder') }
          })}
        FuncProps={{
          pager: false,
        }}
        columns={[
          { name: 'fileName', title: 'Document' },
          { name: 'folderFKs', title: 'Folders' },
          { name: 'createByUserName', title: 'Created By' },
          { name: 'createDate', title: 'Created Date' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          {
            columnName: 'fileName',
            width: 400,
            render: row => {
              return (
                <div style={{ marginRight: 20 }}>
                  <Tooltip title={row.fileName}>
                    <div
                      style={{
                        float: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: 350,
                      }}
                    >
                      <NavLink
                        to={window.location.search}
                        // className={`${classes.itemLink  } ${  classes.userCollapseButton}`}
                        onClick={() => onPreview(row)}
                      >
                        <span>{row.fileName}</span>
                      </NavLink>
                    </div>
                  </Tooltip>
                  {!readOnly && (
                    <div
                      style={{
                        float: 'right',
                        width: 40,
                        marginRight: -40,
                      }}
                    >
                      <IconButton
                        color='primary'
                        onClick={() => {
                          onEditFileName(row)
                        }}
                      >
                        <BorderColor />
                      </IconButton>
                    </div>
                  )}
                </div>
              )
            },
          },
          {
            columnName: 'folderFKs',
            disabled: true,
            render: row => {
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {row.folderList
                    .filter(f => row.folderFKs.includes(f.id))
                    .map(item => (
                      <Chip
                        style={{
                          margin: '0px 0px 5px 5px',
                        }}
                        key={item.id}
                        size='small'
                        variant='outlined'
                        label={item.displayValue}
                        color='primary'
                      />
                    ))}
                </div>
              )
            },
          },
          {
            columnName: 'createDate',
            type: 'date',
            format: 'DD MMM YYYY ',
            disabled: true,
            width: 110,
          },
          {
            columnName: 'createByUserName',
            disabled: true,
            width: 200,
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            disabled: true,
            width: 110,
            render: row => {
              return (
                <div>
                  <Tooltip title='Download'>
                    <Button
                      size='sm'
                      onClick={() => {
                        this.downloadFile(row)
                      }}
                      justIcon
                      color='primary'
                      style={{ marginRight: 5 }}
                    >
                      <Download />
                    </Button>
                  </Tooltip>
                  {!readOnly && (
                    <SetFolderWithPopover
                      key={row.id}
                      folderList={row.folderList}
                      selectedFolderFKs={row.folderFKs || []}
                      onClose={selectedFolder => {
                        const originalFolders = _.sortedUniq(
                          row.folderFKs || [],
                        )
                        const newFolders = _.sortedUniq(selectedFolder)

                        if (
                          originalFolders.length !== newFolders.length ||
                          originalFolders.join(',') !== newFolders.join(',')
                        ) {
                          row.folderFKs = newFolders
                          onFileUpdated(row)
                        }
                      }}
                      onAddNewFolders={onAddNewFolders}
                    />
                  )}
                  <Popconfirm
                    title='Permanently delete this file in all folders?'
                    onConfirm={() => {
                      dispatch({
                        type: 'patientAttachment/removeRow',
                        payload: {
                          id: row.id,
                        },
                      }).then(() => {
                        dispatch({
                          type: 'patientAttachment/query',
                        })
                      })
                    }}
                  >
                    <Tooltip title='Delete'>
                      <Button
                        size='sm'
                        disabled={readOnly}
                        color='danger'
                        justIcon
                      >
                        <Delete />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
