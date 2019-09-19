import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  CodeSelect,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingDocumentTemplate }) =>
  settingDocumentTemplate.filter || {},
  handleSubmit: () => {},
  displayName: 'DocumentTemplateFilter',
})
class Filter extends PureComponent {
  render () {
    console.log({ props: this.props.values })
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='documentType'
              render={() => (
                <Select
                  label='Document Type'
                  options={[
                    { name: 'Referral Letter', value: 'referral letter' },
                    { name: 'Vaccination Cert', value: 'vaccination cert' },
                    { name: 'Memo', value: 'memo' },
                    { name: 'Others', value: 'others' },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='status'
              render={() => (
                <Select
                  label='Status'
                  options={[
                    { name: 'Active', value: 'active' },
                    { name: 'Inactive', value: 'inactive' },
                  ]}
                />
              )}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { codeDisplayValue } = this.props.values
                  this.props.dispatch({
                    type: 'settingDocumentTemplate/query',
                    payload: {
                      group: [
                        {
                          code: codeDisplayValue,
                          displayValue: codeDisplayValue,
                          combineCondition: 'or',
                        },
                      ],
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
                    type: 'settingDocumentTemplate/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
              >
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
