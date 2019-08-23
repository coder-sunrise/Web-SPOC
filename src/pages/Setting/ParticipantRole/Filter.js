import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'

import {
  GridContainer,
  GridItem,
  Button,
  TextField,
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
  displayName: 'ParticipantRoleFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='isActive'
              render={(args) => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { codeDisplayValue, isActive } = this.props.values
                  this.props.dispatch({
                    type: 'settingParticipantRole/query',
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
                  this.props.toggleModal()
                  this.props.dispatch({
                    type: 'settingParticipantRole/updateState',
                  })
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
