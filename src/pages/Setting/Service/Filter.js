import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi'
import { Search, Add, ImportExport, AttachFile } from '@material-ui/icons'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'
import { downloadFile } from '@/services/file'
import { convertToBase64 } from '@/utils/utils'
import { LoadingWrapper } from '@/components/_medisys'

import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  CodeSelect,
  Select,
  ProgressButton,
  notification,
} from '@/components'

const allowedFiles = '.xlsx'

const styles = theme => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})

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

@withFormik({
  mapPropsToValues: () => ({
    isActive: true,
  }),
  handleSubmit: () => {},
  displayName: 'ServiceFilter',
})
class Filter extends PureComponent {
  constructor(props) {
    super(props)
    this.uploadInput = React.createRef()
  }

  state = {
    loading: false,
    loadingText: 'Exporting...',
  }

  showLoading = (isShow, text = '') => {
    this.setState({
      loading: isShow,
      loadingText: text,
    })
  }

  onSearchClick = () => {
    const { codeDisplayValue, isActive, serviceCenterFK } = this.props.values
    this.props.dispatch({
      type: 'settingClinicService/query',
      payload: {
        'ServiceFKNavigation.isActive': isActive,
        serviceCenterFK,
        group: [
          {
            'ServiceFKNavigation.Code': codeDisplayValue,
            'ServiceFKNavigation.DisplayValue': codeDisplayValue,
            combineCondition: 'or',
          },
        ],
      },
    })
  }

  onExportClick = async () => {
    this.showLoading(true, 'Exporting...')

    this.props
      .dispatch({
        type: 'settingClinicService/export',
      })
      .then(result => {
        if (result) {
          downloadFile(result, 'Service.xlsx')
        }

        this.showLoading(false)
      })
  }

  onImportClick = () => {
    this.uploadInput.current.click()
  }

  onFileChange = async event => {
    try {
      const { files } = event.target

      const selectedFiles = await Promise.all(
        Object.keys(files).map(key => mapToFileDto(files[key])),
      )

      if (selectedFiles.length > 0) {
        this.showLoading(true, 'Importing...')
        this.props
          .dispatch({
            type: 'settingClinicService/import',
            payload: {
              ...selectedFiles[0],
            },
          })
          .then(result => {
            if (result && result.byteLength === 0) {
              notification.success({
                message: 'Import success',
              })

              this.onSearchClick()
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

            this.showLoading(false)
          })
      }
    } catch (error) {
      console.log({ error })
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={args => {
                return <TextField label='Code / DisplayValue' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='serviceCenterFK'
              render={args => {
                return (
                  <CodeSelect
                    code='ctServiceCenter'
                    label='Service Center'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} md={12}>
            <LoadingWrapper
              linear
              loading={this.state.loading}
              text={this.state.loadingText}
            >
              <div className={classes.filterBtn}>
                <ProgressButton
                  color='primary'
                  icon={<Search />}
                  onClick={this.onSearchClick}
                >
                  <FormattedMessage id='form.search' />
                </ProgressButton>

                <Button
                  color='primary'
                  onClick={() => {
                    this.props.dispatch({
                      type: 'settingClinicService/updateState',
                      payload: {
                        entity: undefined,
                      },
                    })
                    this.props.toggleModal()
                  }}
                >
                  <Add />
                  Add New
                </Button>
              </div>
            </LoadingWrapper>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
