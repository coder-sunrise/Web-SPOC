import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  CodeSelect,
  Select,
  ProgressButton,
} from '@/components'

const styles = (theme) => ({
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

@withFormik({
  handleSubmit: () => {},
  displayName: 'ServiceFilter',
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
                return <TextField label='Code / DisplayValue' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='serviceCenterFK'
              render={(args) => {
                return (
                  <CodeSelect
                    code='ctServiceCenter'
                    label='Service Center'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} md={12}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const {
                    codeDisplayValue,
                    isActive,
                    serviceCenterFK,
                  } = this.props.values
                  this.props.dispatch({
                    type: 'settingClinicService/query',
                    payload: {
                      keepFilter: false,
                      'ServiceFKNavigation.isActive': isActive,
                      serviceCenterFK,
                      group: [
                        {
                          'ServiceFKNavigation.Code': codeDisplayValue,
                          'ServiceFKNavigation.DisplayValue': codeDisplayValue,
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
                    type: 'settingClinicService/updateState',
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
