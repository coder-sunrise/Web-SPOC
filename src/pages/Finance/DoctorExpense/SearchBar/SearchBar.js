import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'

import { GridContainer, GridItem, Button } from 'mui-pro-components'
import { withStyles } from '@material-ui/core/styles'
import { Search, Replay, AddBox } from '@material-ui/icons'

import { formatMessage, FormattedMessage } from 'umi/locale'
import { withFormik, FastField } from 'formik'

import { DatePicker, Select, ProgressButton } from '@/components'

const styles = {
  addNewBtn: {
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 10,
  },
  deButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
}

@connect(({ doctorExpense }) => ({
  doctorExpense,
}))
@withFormik({
  mapPropsToValues: () => ({
    DoctorNames: [],
    Start: moment().add(-1, 'months'),
    End: moment(),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    props.dispatch({
      type: 'doctorExpense/fetchList',
      payload: [
        ...values.DoctorNames,
      ],
    })
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      setSubmitting(false)
    }, 1000)
  },
})
class SearchBar extends PureComponent {
  state = {}

  render () {
    const {
      values,
      handleSubmit,
      doctorExpense: { list },
      classes,
      onAddExpense,
    } = this.props

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <FastField
            name='DoctorNames'
            render={(args) => {
              return (
                <Select
                  mode='multiple'
                  label={formatMessage({
                    id: 'finance.doctor-expense.doctorName',
                  })}
                  options={[
                    { name: 'Chris', value: 'Chris' },
                    { name: 'Patrik', value: 'Patrik' },
                    { name: 'Teo Jiayan', value: 'Teo Jiayan' },
                    { name: 'Jack', value: 'Jack' },
                    { name: 'Jason', value: 'Jason' },
                    { name: 'Dave', value: 'Dave' },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <FastField
            name='Start'
            render={(args) => (
              <DatePicker
                label={formatMessage({ id: 'finance.invoice.search.start' })}
                timeFormat={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <FastField
            name='End'
            render={(args) => (
              <DatePicker
                label={formatMessage({ id: 'finance.invoice.search.end' })}
                timeFormat={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={9}>
          <div className={classes.deButtonContainer}>
            <ProgressButton
              icon={<Search />}
              variant='contained'
              color='primary'
              type='submit'
              onClick={handleSubmit}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Button variant='contained' type='reset'>
              <Replay />
              <FormattedMessage id='form.reset' />
            </Button>
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <div className={classes.addNewBtn}>
            <Button variant='contained' color='primary' onClick={onAddExpense}>
              <AddBox />
              <FormattedMessage id='form.addNew' />
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(SearchBar)
