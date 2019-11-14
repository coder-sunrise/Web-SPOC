import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { FormattedMessage, formatMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
// custom component
import {
  GridContainer,
  GridItem,
  DateRangePicker,
  TextField,
  ProgressButton,
} from '@/components'

const styles = () => ({
  actionBarContainer: {
    marginBottom: '10px',
  },
  row: {
    padding: '0 !important',
  },
  searchBtn: {
    marginTop: '15px',
  },
})

@withFormik({ mapPropsToValues: () => ({}) })
class ActionBar extends PureComponent {
  onDateRangeChange = (name, value) => {
    const { setFieldValue } = this.props
    setFieldValue(name, value)
  }

  render () {
    const { classes, values } = this.props
    return (
      <GridContainer className={classnames(classes.actionBarContainer)}>
        <GridItem className={classnames(classes.row)} container md={12}>
          <GridItem xs md={3}>
            <FastField
              name='invoiceNo'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({ id: 'finance.cdNote.invoiceNo' })}
                />
              )}
            />
          </GridItem>
          {/**
            <GridItem xs md={3}>
              <FastField
                name='dateTo'
                render={(args) => <DatePicker {...args} label='Date from' />}
              />
            </GridItem>
            <GridItem xs md={3}>
              <FastField
                name='dateFrom'
                render={(args) => <DatePicker {...args} label='Date to' />}
              />
            </GridItem>
          */}
          <GridItem xs md={5}>
            <DateRangePicker
              nameDateFrom='dateFrom'
              nameDateTo='dateTo'
              handleChange={this.onDateRangeChange}
              values={values}
            />
          </GridItem>
        </GridItem>
        <GridItem className={classnames(classes.row)} container xs md={12}>
          <GridItem xs md={3}>
            <FastField
              name='noteNo'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({ id: 'finance.cdNote.noteNo' })}
                />
              )}
            />
          </GridItem>
        </GridItem>
        <GridItem className={classnames(classes.row)} container xs md={12}>
          <GridItem xs md={3}>
            <FastField
              name='patientID'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({ id: 'finance.cdNote.patientID' })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name='name'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({ id: 'finance.cdNote.patientName' })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <ProgressButton
              icon={<Search />}
              className={classnames(classes.searchBtn)}
              color='primary'
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
          </GridItem>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(ActionBar)
