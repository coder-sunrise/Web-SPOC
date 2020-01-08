import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import PersonAdd from '@material-ui/icons/PersonAdd'

import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
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
  mapPropsToValues: ({ search }) => {
    return {
      search,
    }
  },
})
class FilterBar extends PureComponent {
  render () {
    const { classes, dispatch, disableAdd, simple } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem md={12} lg={3} style={{ position: 'relative' }}>
            <FastField
              name='search'
              render={(args) => {
                return (
                  <TextField
                    autoFocus={!simple}
                    label={formatMessage({
                      id: 'reception.queue.patientSearchPlaceholder',
                    })}
                    {...args}
                  />
                )
              }}
            />
            {/* <div className={classes.tansactionCheck}>
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
            </div> */}
          </GridItem>
          <GridItem md={12} lg={5}>
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
                  const { search } = this.props.values
                  const prefix = this.props.values.isExactSearch
                    ? 'eql_'
                    : 'like_'
                  this.props.dispatch({
                    type: 'patientSearch/query',
                    payload: {
                      // group: [
                      //   {
                      //     // [`${prefix}patientReferenceNo`]: search,
                      //     [`${prefix}name`]: search,
                      //     [`${prefix}patientAccountNo`]: search,
                      //     [`${prefix}patientReferenceNo`]: search,
                      //     [`${prefix}contactFkNavigation.contactNumber.number`]: search,
                      //     combineCondition: 'or',
                      //   },
                      // ],
                      apiCriteria: {
                        searchValue: search,
                      },
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>
              <Authorized authority='patientdatabase.newpatient'>
                {!disableAdd && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      dispatch({
                        type: 'patient/updateState',
                        payload: {
                          entity: undefined,
                          version: undefined,
                        },
                      })
                      dispatch({
                        type: 'patient/openPatientModal',
                      })
                    }}
                  >
                    <PersonAdd />
                    <FormattedMessage id='reception.queue.patientSearch.registerNewPatient' />
                  </Button>
                )}
              </Authorized>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(FilterBar)
