import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import {
  FastField,
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
  DateRangePicker,
  withFormikExtend,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ patientAttachment }) =>
  patientAttachment.filter || {},
  handleSubmit: () => {},
  displayName: 'DocumentTemplateFilter',
})
class Filter extends PureComponent {
  

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
