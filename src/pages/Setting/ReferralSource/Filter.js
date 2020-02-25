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
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingReferralSource }) =>
    settingReferralSource.filter || {},
  handleSubmit: (values, { props}) => {

    const {  isActive, name, institution, department } = values

    const payload = {
      isActive,
      name,
      institution,
      department,
    }

    props.dispatch({
      type: 'settingReferralSource/query',
      payload,
    })
  },
  displayName: 'ReferralSourceFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes,handleSubmit } = this.props
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
            <FastField
              name='institution'
              render={(args) => {
                return <TextField label='Institution' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='department'
              render={(args) => {
                return <TextField label='Department' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={3}>
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
                    type: 'settingReferralSource/updateState',
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
