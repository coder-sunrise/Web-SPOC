import React, { PureComponent } from 'react'
import { FastField } from 'formik'
import { FormattedMessage } from 'umi'
import { standardRowHeight } from 'mui-pro-jss'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
  ProgressButton,
} from '@/components'

const styles = theme => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})

@withFormikExtend({
  mapPropsToValues: ({ settingClinicBreakHour }) =>
  ({
    ...(settingClinicBreakHour.filter || {}),
    isActive: true,
  }),
  handleSubmit: () => {},
  displayName: 'ClinicBreakHourFilter',
})
class Filter extends PureComponent {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='codeDisplayValue'
              render={args => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={3} md={2}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' {...args} options={status} />
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const { codeDisplayValue, isActive } = this.props.values
                  this.props.dispatch({
                    type: 'settingClinicBreakHour/query',
                    payload: {
                      isActive,
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
                    type: 'settingClinicBreakHour/updateState',
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
