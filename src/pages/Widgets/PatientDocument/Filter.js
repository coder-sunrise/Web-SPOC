import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
  FastField,
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
  DateRangePicker,
} from '@/components'
import { Attachment } from '@/components/_medisys'
import { findGetParameter } from '@/utils/utils'

class Filter extends PureComponent {
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
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return <TextField label='Document' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={7} md={4}>
            <FastField
              name='effectiveDates'
              render={(args) => {
                return (
                  <DateRangePicker label='Create Date' label2='To' {...args} />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { codeDisplayValue, effectiveDates } = this.props.values
                  this.props.dispatch({
                    type: 'patientAttachment/query',
                    payload: {
                      lgteql_createDate: effectiveDates
                        ? effectiveDates[0]
                        : undefined,
                      lsteql_createDate: effectiveDates
                        ? effectiveDates[1]
                        : undefined,
                      group: [
                        {
                          'FileIndexFKNavigation.FileName': codeDisplayValue,
                          combineCondition: 'or',
                        },
                      ],
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <GridItem xs={6} md={4}>
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
              </GridItem>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter

// <Button
// color='primary'
// onClick={() => {
//   this.props.dispatch({
//     type: 'settingDocumentTemplate/updateState',
//     payload: {
//       entity: undefined,
//     },
//   })
//   this.props.toggleModal()
// }}
// >
// Upload
// </Button>
