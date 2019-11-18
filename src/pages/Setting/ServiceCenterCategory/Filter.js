import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import { Search } from '@material-ui/icons'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingServiceCenterCategory }) =>
    settingServiceCenterCategory.filter || {},
  handleSubmit: () => {},
  displayName: 'ServiceCenterFilter',
})
class Filter extends PureComponent {
  render () {
    // console.log({ props: this.props.values })
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

          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const { codeDisplayValue } = this.props.values
                  this.props.dispatch({
                    type: 'settingServiceCenterCategory/query',
                    payload: {
                      keepFilter: false,
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
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
