import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, FastField } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import model from './models'
import { Attachment } from '@/components/_medisys'
import { findGetParameter } from '@/utils/utils'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ patientAttachment }) => ({
  patientAttachment,
}))
class PatientDocument extends Component {
  state = {}

  componentDidMount () {
    const { dispatch, values } = this.props
    dispatch({
      type: 'patientAttachment/query',
      payload: {
        'PatientProfileFKNavigation.Id': values.id,
      },
    })
  }

  updateAttachments = (args) => ({ added, deleted }) => {
    // console.log({ added, deleted }, args)
    const { dispatch } = this.props
    const { form, field } = args

    let updated = [
      ...(field.value || []),
    ]
    if (added)
      updated = [
        ...updated,
        ...added.map((o) => ({
          ...o,
          fileIndexFK: o.id,
        })),
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

    const sortIndex = this.props.patientAttachment.list.length
    dispatch({
      type: 'patientAttachment/upsert',
      payload: {
        patientProfileFK: findGetParameter('pid'),
        sortOrder: sortIndex + 1,
        fileIndexFK: updated[0].fileIndexFK,
      },
    }).then((r) => {
      if (r) {
        dispatch({
          type: 'patientAttachment/query',
        })
      }
    })
  }

  render () {
    return (
      <div>
        <Filter {...this.props} />
        <Grid {...this.props} />
        <div style={{ float: 'left' }}>
          <FastField
            name='patientAttachment'
            render={(args) => {
              this.form = args.form

              return (
                <Attachment
                  attachmentType='patientAttachment'
                  handleUpdateAttachments={this.updateAttachments(args)}
                  attachments={args.field.value}
                  label=''
                  // isReadOnly
                />
              )
            }}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDocument)
