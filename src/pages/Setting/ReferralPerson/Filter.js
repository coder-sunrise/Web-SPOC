import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  ProgressButton,
  CodeSelect,
  Field,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingReferralPerson }) =>
    settingReferralPerson.filter || {},
  handleSubmit: (values, { props }) => {
    const { name, referralSourceId } = values
    const payload = {
      name,
      'ReferralSource_ReferralPerson.ReferralSourceFK': referralSourceId,
    }

    props.dispatch({
      type: 'settingReferralPerson/query',
      payload,
    })
  },
  displayName: 'ReferralPersonFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes, handleSubmit, referralSource } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='name'
              render={(args) => {
                return <TextField label='Name' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <Field
              name='referralSourceId'
              render={(args) => (
                <CodeSelect
                  {...args}
                  options={referralSource}
                  labelField='name'
                  mode='single'
                  label='Referral Source'
                />
              )}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={handleSubmit}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingReferralPerson/updateState',
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
