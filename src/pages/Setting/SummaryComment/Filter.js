import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { summaryCommentGroup } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  ProgressButton,
  Select,
  CodeSelect,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingSummaryComment }) =>
    settingSummaryComment.filter || {},
  handleSubmit: () => {},
  displayName: 'SummaryCommentFilter',
})
class Filter extends PureComponent {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={args => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='examinationItemFK'
              render={args => (
                <CodeSelect
                  label='Examination'
                  code='ctexaminationitem'
                  {...args}
                />
              )}
            />
          </GridItem> 
          <GridItem>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const {
                    codeDisplayValue,
                    groupNo,
                    examinationItemFK,
                  } = this.props.values
                  const { clinicSettings } = this.props
                  const { secondaryPrintoutLanguage = '' } = clinicSettings
                  this.props.dispatch({
                    type: 'settingSummaryComment/query',
                    payload: {
                      groupNo,
                      examinationItemFK,
                      apiCriteria: {
                        Language: secondaryPrintoutLanguage,
                        Key: 'displayValue',
                        SearchValue: codeDisplayValue,
                      },
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingSummaryComment/updateState',
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
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
