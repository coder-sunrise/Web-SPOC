import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, PermIdentity } from '@material-ui/icons'
import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { getAppendUrl } from '@/utils/utils'

import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
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
  mapPropsToValues: () => {},
})
class FilterBar extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem lg={12} xl={8} style={{ position: 'relative' }}>
            <FastField
              name='search'
              render={(args) => {
                return (
                  <TextField
                    label={formatMessage({
                      id: 'patient.search.message',
                    })}
                    {...args}
                  />
                )
              }}
            />
            <div className={classes.tansactionCheck}>
              <FastField
                name='isExactSearch'
                render={(args) => {
                  return (
                    <Tooltip
                      title={formatMessage({
                        id: 'patient.search.exact',
                      })}
                      placement='bottom'
                    >
                      <Checkbox simple {...args} />
                    </Tooltip>
                  )
                }}
              />
            </div>
          </GridItem>
          <GridItem lg={12} xl={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                variant='contained'
                color='primary'
                icon={<Search />}
                onClick={() => {
                  // console.log(this.props.values)
                  // this.props.dispatch({
                  //   type: 'patientSearch/updateFilter',
                  //   payload: this.props.values,
                  // })
                  const prefix = this.props.values.isExactSearch
                    ? 'eql_'
                    : 'like_'
                  this.props.dispatch({
                    type: 'patientSearch/query',
                    payload: {
                      [`${prefix}name`]: this.props.values.search,
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  this.props.history.push(
                    getAppendUrl({
                      md: 'pt',
                      cmt: '1',
                      new: 1,
                    }),
                  )
                }}
              >
                <PermIdentity />
                New Patient
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
