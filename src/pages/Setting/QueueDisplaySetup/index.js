import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { getBizSession } from '@/services/queue'
import { FILE_CATEGORY, VALUE_KEYS } from '@/utils/constants'

import {
  withFormikExtend,
  Field,
  GridContainer,
  GridItem,
  CardContainer,
  Button,
  Switch,
  TextField,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import {
  AttachmentWithThumbnail,
  QueueDashboardButton,
} from '@/components/_medisys'

const styles = (theme) => ({
  ...basicStyle(theme),
  queueDiplayButton: {
    margin: theme.spacing(2),
    marginLeft: 0,
  },
  container: {
    marginTop: 0,
  },
  tableHeader: {
    marginTop: theme.spacing(2),
  },
})

@connect(({ queueDisplaySetup }) => ({
  queueDisplaySetup,
}))
@withFormikExtend({
  enableReinitialize: true,

  mapPropsToValues: ({ queueDisplaySetup }) => {
    if (!queueDisplaySetup.entity) return queueDisplaySetup.default

    return {
      ...queueDisplaySetup.entity,
    }
  },

  handleSubmit: (values, { props }) => {
    const { value, lastUpdateDate, ...restValues } = values
    const { dispatch, history } = props

    const formattedImages = value.images
      .filter((image) => !image.isDeleted)
      .map((image) => {
        const {
          thumbnail,
          content,
          thumbnailIndexFK,
          ...restImageValues
        } = image
        return {
          ...restImageValues,
          fileIndexFK: restImageValues.id,
          thumbnailIndexFK: thumbnailIndexFK || thumbnail.id,
        }
      })

    const valueObj = {
      ...value,
      images: formattedImages,
    }

    const stringifyValue = JSON.stringify(valueObj)

    const payload = {
      ...restValues,
      value: stringifyValue,
      key: VALUE_KEYS.QUEUEDISPLAYSETUP,
      isUserMaintainable: true,
    }

    dispatch({
      type: 'queueDisplaySetup/upsert',
      payload,
    }).then((r) => {
      if (r) {
        history.push('/setting')
        dispatch({
          type: 'queueDisplaySetup/query',
        })
      }
    })
  },
  displayName: 'queueDisplaySetup',
})
class QueueDisplaySetup extends PureComponent {
  componentDidMount = () => {
    this.props.dispatch({
      type: 'queueDisplaySetup/query',
      payload: {
        keys: VALUE_KEYS.QUEUEDISPLAYSETUP,
      },
    })
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  handleUpdateAttachments = ({ added, deleted }) => {
    const { values: { value: { images = [] } }, setFieldValue } = this.props
    let updated = [
      ...images,
    ]

    if (added)
      updated = [
        ...updated,
        ...added,
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    setFieldValue('value.images', updated)
  }

  render () {
    const { classes, handleSubmit, values: { value = {} } } = this.props
    const activeImages = (value.images || [])
      .filter((image) => !image.isDeleted)

    return (
      <React.Fragment>
        <QueueDashboardButton />
        <CardContainer hideHeader className={classes.container}>
          <GridContainer>
            <GridItem md={10}>
              <AttachmentWithThumbnail
                label='Image: (maximum 5)'
                attachmentType='QueueDisplay'
                hideRemarks
                handleUpdateAttachments={this.handleUpdateAttachments}
                attachments={activeImages}
                disableUpload={activeImages.length >= 5}
                fileCategory={FILE_CATEGORY.QUEUEDISPLAY}
                maxFilesAllowUpload={5}
                restrictFileTypes={[
                  'image/jpeg',
                  'image/png',
                  'image/bmp',
                ]}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem md={10}>
              <Field
                name='value.message'
                render={(args) => (
                  <TextField
                    label='Message (max 150 characters)'
                    multiline
                    maxLength={150}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem md={3}>
              <Field
                name='value.showDateTime'
                render={(args) => (
                  <Switch
                    label='Show Date and Time after the message'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              onClick={navigateDirtyCheck({
                redirectUrl: '/setting',
              })}
            >
              Cancel
            </Button>

            <Button color='primary' onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(QueueDisplaySetup)
