import React, { useEffect, useState, useRef } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi'
import { Search, Add, ImportExport, AttachFile } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { compose } from 'redux'
import { status } from '@/utils/codes'
import { LoadingWrapper } from '@/components/_medisys'
import { downloadFile } from '@/services/file'
import { convertToBase64, ableToViewByAuthority } from '@/utils/utils'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  TextField,
  CodeSelect,
  ProgressButton,
  notification,
} from '@/components'

const styles = theme => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    // paddingTop: '13px',
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const allowedFiles = '.xlsx'

const FilterBar = ({ classes, dispatch, history, values }) => {
  const unmount = () =>
    dispatch({
      type: 'invoiceList/updateState',
      payload: {
        filter: {},
      },
    })

  useEffect(() => {
    return unmount
  }, [])

  const [exporting, setExporting] = useState(false)

  const [loadingText, setLoadingText] = useState('')

  const inputEl = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [importOverwrite, setImportOverwrite] = useState(false)
  const [confirmImportOption, setConfirmImportOption] = useState(false)

  const onExportClick = async () => {
    setExporting(true)
    setLoadingText('Exporting...')

    dispatch({
      type: 'consumable/export',
    }).then(result => {
      if (result) {
        downloadFile(result, 'Product.xlsx')
      }

      setExporting(false)
    })
  }

  const onSearchClick = () => {
    const { code, displayValue, supplier, isActive } = values
    dispatch({
      type: 'consumable/query',
      payload: {
        code,
        displayValue,
        FavouriteSupplierFkNavigation: {
          id: supplier,
        },
        isActive,
      },
    })
  }

  const clearValue = e => {
    e.target.value = null
  }

  const mapToFileDto = async file => {
    const base64 = await convertToBase64(file)
    const originalFile = {
      content: base64,
    }

    return originalFile
  }

  const onImportClick = () => {
    inputEl.current.click()
  }

  const onFileChange = async event => {
    try {
      const { files } = event.target

      const selectedFiles = await Promise.all(
        Object.keys(files).map(key => mapToFileDto(files[key])),
      )

      if (selectedFiles.length > 0) {
        setExporting(true)
        setLoadingText('Importing...')

        dispatch({
          type: 'consumable/import',
          payload: {
            ...selectedFiles[0],
            importOverwrite,
          },
        }).then(result => {
          if (result && result.byteLength === 0) {
            notification.success({
              message: 'Import success',
            })

            onSearchClick()
          } else if (result && result.byteLength > 0) {
            notification.warning({
              message:
                'File is not valid, please download the validation file and check the issues',
            })
            downloadFile(result, 'Validation.xlsx')
          } else {
            notification.error({
              message: 'Import failed',
            })
          }

          setExporting(false)
        })
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
    setConfirmImportOption(true)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setConfirmImportOption(false)
  }

  const handleMenuItemClick = value => {
    setImportOverwrite(value == 1)
    onImportClick()
    handleMenuClose()
  }

  const importOptions = [
    { name: 'Overwrite', value: 1 },
    { name: 'Normal', value: 2 },
  ]
  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6} md={3}>
          <FastField
            name='code'
            render={args => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.consumable.code',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='displayValue'
            render={args => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.consumable.name',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='supplier'
            render={args => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'inventory.master.consumable.supplier',
                  })}
                  code='ctSupplier'
                  labelField='displayValue'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='isActive'
            render={args => {
              return (
                <Select
                  label={formatMessage({
                    id: 'inventory.master.consumable.status',
                  })}
                  options={status}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <LoadingWrapper linear loading={exporting} text={loadingText}>
            <div className={classes.filterBtn}>
              <ProgressButton
                icon={<Search />}
                variant='contained'
                color='primary'
                onClick={onSearchClick}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              {ableToViewByAuthority('inventorymaster.consumable') && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    dispatch({
                      type: 'consumableDetail/updateState',
                      payload: {
                        entity: undefined,
                        currentId: undefined,
                      },
                    })
                    history.push('/inventory/master/consumable')
                  }}
                >
                  <Add />
                  Add New
                </Button>
              )}
              <Button color='primary' onClick={onExportClick}>
                <ImportExport />
                Export
              </Button>
              {ableToViewByAuthority('inventorymaster.consumable') && (
                <span>
                  <input
                    style={{ display: 'none' }}
                    type='file'
                    accept={allowedFiles}
                    id='importMedicationFile'
                    ref={inputEl}
                    multiple={false}
                    onChange={onFileChange}
                    onClick={clearValue}
                  />

                  <Button
                    color='primary'
                    aria-haspopup='true'
                    aria-expanded={confirmImportOption}
                    onClick={handleMenuClick}
                  >
                    <AttachFile />
                    Import
                  </Button>

                  <Menu
                    id='pp-positioned-menu'
                    aria-labelledby='pp-positioned-button'
                    disableAutoFocusItem
                    anchorEl={anchorEl}
                    open={confirmImportOption}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    {importOptions.map(x => (
                      <MenuItem onClick={() => handleMenuItemClick(x.value)}>
                        {x.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </span>
              )}
            </div>
          </LoadingWrapper>
        </GridItem>
      </GridContainer>
      {/* <CommonModal
          open={consumable.showBatchEditModal}
          title='Batch Edit'
          bodyNoPadding
          onClose={() => {
            dispatch({
              type: 'consumable/updateState',
              payload: {
                showBatchEditModal: false,
              },
            })
          }}
          // onConfirm={this.toggleModal}
          fullScreen
          showFooter={false}
        >
        </CommonModal> */}
    </div>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => ({ isActive: true }),
  }),
  React.memo,
)(FilterBar)
