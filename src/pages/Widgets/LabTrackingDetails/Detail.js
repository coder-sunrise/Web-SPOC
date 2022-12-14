import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import Authorized from '@/utils/Authorized'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  Accordion,
} from '@/components'
import * as WidgetConfig from './config'
import { LAB_TRACKING_STATUS } from '@/utils/constants'

const styles = theme => ({})

@connect(({ codetable, global }) => ({
  codetable,
  mainDivHeight: global.mainDivHeight,
}))
@withFormikExtend({
  mapPropsToValues: ({ labTrackingDetails }) => labTrackingDetails.entity,
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'labTrackingDetails/upsert',
      payload: {
        ...values,
      },
    }).then(r => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'labTrackingDetails/query',
        })
      }
    })
  },
  validationSchema: Yup.object().shape({
    statusFK: Yup.number().required(),
    writeOffReason: Yup.string().when('statusFK', {
      is: val => val === LAB_TRACKING_STATUS.WRITEOFF,
      then: Yup.string().required(),
    }),
  }),
  displayName: 'labTrackingDetails',
})
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.widgets = WidgetConfig.widgets(props)
    this.state = { readOnly: false }
  }

  componentDidMount() {
    const accessRight = Authorized.check('reception/labtracking') || {
      rights: 'hidden',
    }
    this.setState({ readOnly: accessRight.rights !== 'enable' })
  }

  getTitle = row => {
    const { name = '' } = row

    return (
      <div className={this.props.classes.title}>
        <GridContainer>
          <GridItem sm={12}>
            <p>
              <span>{name}</span>
            </p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  getContent = data => {
    const Widget = data.component
    return <Widget {...this.props} />
  }

  render() {
    const { footer, handleSubmit, setFieldValue, mainDivHeight } = this.props
    return (
      <div style={{ padding: '0px 8px' }}>
        <div style={{ maxHeight: mainDivHeight - 130, overflowY: 'auto' }}>
          <div>
            <GridContainer>
              <GridItem md={4}>
                <FastField
                  name='patientName'
                  render={args => (
                    <TextField label='Patient Name' {...args} disabled />
                  )}
                />
              </GridItem>
              <GridItem md={4}>
                <FastField
                  name='referreceNo'
                  render={args => (
                    <TextField label='Patient Ref No.' {...args} disabled />
                  )}
                />
              </GridItem>
              <GridItem md={4}>
                <FastField
                  name='statusFK'
                  render={args => (
                    <CodeSelect
                      label='Status'
                      {...args}
                      code='ltlabtrackingstatus'
                      allowClear={false}
                      disabled={this.state.readOnly}
                      onChange={v => {
                        if (v !== LAB_TRACKING_STATUS.WRITEOFF) {
                          setFieldValue('writeOffReason', undefined)
                        }
                      }}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div>
            <div>
              <Accordion
                defaultActive={[0, 1]}
                mode='multiple'
                collapses={this.widgets.map(o => {
                  return {
                    title: this.getTitle(o),
                    hideExpendIcon: false,
                    content: this.getContent(o),
                  }
                })}
              />
            </div>
          </div>
        </div>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: this.state.readOnly,
            },
          })}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
