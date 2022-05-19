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
  Tooltip,
  Popconfirm,
  DatePicker,
  IconButton,
} from '@/components'
import { Button, Tag } from 'antd'
import {
  EditOutlined,
  CloudDownloadOutlined,
  DeleteFilled,
} from '@ant-design/icons'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'

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
      attachmentList = [],
      selectedFolderFK,
      folderList = [],
      onEditFileName,
      onAddNewFolders,
      onFileUpdated,
      readOnly,
      modelName,
      isEnableEditDocument = true,
      isEnableDeleteDocument = true,
      isEnableEditFolder = true,
      filterDocumentValue = '',
    } = this.props

    return (
      <CommonTableGrid
        style={{ margin: '0px 1px 0px 0px' }}
        forceRender
        rows={_.orderBy(
          attachmentList.filter(
            f =>
              (f.fileName || '')
                .toUpperCase()
                .indexOf(filterDocumentValue.toUpperCase()) >= 0 &&
              (selectedFolderFK === -99 ||
                f.folderFKs.includes(selectedFolderFK)),
          ),
          [data => (data.fileName || '').toLowerCase()],
          ['asc'],
        ).map(a => {
          return { ...a, folderList: _.sortBy(folderList, 'sortOrder') }
        })}
        FuncProps={{
          pager: true,
        }}
        columns={[
          {
            name: 'fileName',
            title: 'Document Name',
            sortBy: data => (data.fileName || '').toLowerCase(),
          },
          { name: 'folderFKs', title: 'Tags' },
          {
            name: 'createByUserName',
            title: 'Created By',
            sortBy: data => (data.createByUserName || '').toLowerCase(),
          },
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
                  {!readOnly && isEnableEditDocument && (
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
                        <EditOutlined />
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
            sortingEnabled: false,
            render: row => {
              return (
                <div style={{ marginRight: 20 }}>
                  <div style={{ whiteSpace: 'pre-wrap', float: 'left' }}>
                    {row.folderList
                      .filter(f => row.folderFKs.includes(f.id))
                      .map(item => (
                        <Tag
                          style={{
                            margin: '2px 5px 2px 0px',
                          }}
                        >
                          {item.displayValue}
                        </Tag>
                      ))}
                  </div>
                  {!readOnly && isEnableEditDocument && (
                    <div
                      style={{
                        float: 'right',
                        width: 40,
                        marginRight: -40,
                      }}
                    >
                      <SetFolderWithPopover
                        justIcon
                        key={row.id}
                        isEnableEditFolder={isEnableEditFolder}
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
                        type={this.props.type}
                        onAddNewFolders={onAddNewFolders}
                      />
                    </div>
                  )}
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
            width: 80,
            render: row => {
              return (
                <div>
                  <Tooltip title='Download'>
                    <Button
                      size='small'
                      onClick={() => {
                        this.downloadFile(row)
                      }}
                      icon={<CloudDownloadOutlined />}
                      type='primary'
                      style={{ marginRight: 8 }}
                    ></Button>
                  </Tooltip>
                  {isEnableDeleteDocument && (
                    <Popconfirm
                      title='Permanently delete this document in all tags?'
                      onConfirm={() => {
                        dispatch({
                          type: `${modelName}/removeRow`,
                          payload: {
                            id: row.id,
                          },
                        }).then(() => {
                          dispatch({
                            type: `${modelName}/query`,
                          })
                        })
                      }}
                    >
                      <Tooltip title='Delete'>
                        <Button
                          size='small'
                          disabled={readOnly}
                          type='danger'
                          icon={<DeleteFilled />}
                        ></Button>
                      </Tooltip>
                    </Popconfirm>
                  )}
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
