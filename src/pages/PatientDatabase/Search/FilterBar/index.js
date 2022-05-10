import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi'
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
  DatePicker,
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

@withFormik({
  mapPropsToValues: ({ search, dob }) => {
    return {
      search,
      dob,
    }
  },
})
class FilterBar extends PureComponent {
  onSearchPatientClick = () => {
    const { search, dob } = this.props.values
    const prefix = this.props.values.isExactSearch ? 'eql_' : 'like_'
    this.props.dispatch({
      type: 'patientSearch/query',
      payload: {
        apiCriteria: {
          searchValue: search,
          dob: dob,
          includeinactive: window.location.pathname.includes('patient'),
        },
      },
    })
  }
  render() {
    const { classes, dispatch, disableAdd, simple } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <Authorized authority='patientdatabase/searchpatient'>
            <GridItem md={12} lg={5} style={{ position: 'relative' }}>
              <FastField
                name='search'
                render={args => {
                  return (
                    <TextField
                      autoFocus={!simple}
                      label={formatMessage({
                        id: 'reception.queue.patientSearchPlaceholder',
                      })}
                      onKeyUp={e => {
                        if ([13].includes(e.which)) {
                          setTimeout(() => {
                            this.onSearchPatientClick()
                          }, 1)
                        }
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={2}>
              <FastField
                name='dob'
                render={args => <DatePicker {...args} label='DOB' />}
              />
            </GridItem>
          </Authorized>
          <GridItem md={12} lg={5}>
            <div className={classes.filterBtn}>
              <Authorized authority='patientdatabase/searchpatient'>
                <Button
                  variant='contained'
                  color='primary'
                  size='sm'
                  onClick={this.onSearchPatientClick}
                >
                  <Search /> <FormattedMessage id='form.search' />
                </Button>
              </Authorized>
              <Authorized authority='patientdatabase.newpatient'>
                {!disableAdd && (
                  <Button
                    variant='contained'
                    size='sm'
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
