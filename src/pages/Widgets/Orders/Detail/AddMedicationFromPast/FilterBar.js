import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { Field } from 'formik'
import Search from '@material-ui/icons/Search'
// custom component
import {
  GridContainer,
  GridItem,
  TextField,
  Checkbox,
  ProgressButton,
} from '@/components'
import { primaryColor } from '@/assets/jss'
import { FilterBarDate } from '@/components/_medisys'

const styles = () => ({
  container: {
    textAlign: 'center',
    marginLeft: '2px',
    marginRight: '2px',
    width: 70,
    minWidth: 'auto',
    cursor: 'pointer',
    border: 0,
    borderRadius: '4px',
    color: primaryColor,
  },
})

const FilterBar = (props) => {
  const { handelSearch, type, selectItemCount, values } = props
  const { visitFromDate, visitToDate, isAllDate } = values

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={10} lg={10}>
          <div>
            <div style={{ display: 'inline-Block', width: 150 }}>
              <Field
                name='visitFromDate'
                render={(args) => (
                  <FilterBarDate
                    {...args}
                    label='Visit Date From'
                    formValues={{
                      startDate: visitFromDate,
                      endDate: visitToDate,
                    }}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div
              style={{ display: 'inline-Block', marginLeft: 10, width: 150 }}
            >
              <Field
                name='visitToDate'
                render={(args) => (
                  <FilterBarDate
                    {...args}
                    label='Visit Date To'
                    isEndDate
                    formValues={{
                      startDate: visitFromDate,
                      endDate: visitToDate,
                    }}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div style={{ display: 'inline-Block', marginLeft: 10 }}>
              <Field
                name='isAllDate'
                render={(args) => <Checkbox {...args} label='All Date' />}
              />
            </div>
            <div style={{ display: 'inline-Block' }}>
              <Field
                name='searchName'
                render={(args) => (
                  <TextField
                    {...args}
                    label={
                      type === '1' ? 'Medication Name' : 'Vaccination Name'
                    }
                  />
                )}
              />
            </div>
            <div style={{ display: 'inline-Block', marginLeft: 10 }}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={handelSearch}
              >
                Search
              </ProgressButton>
            </div>
          </div>
        </GridItem>

        <GridItem
          xs={3}
          sm={3}
          md={2}
          lg={2}
          justify='flex-end'
          alignItems='center'
          container
          style={{ position: 'relative' }}
        >
          <span style={{ position: 'absolute', bottom: 8 }}>
            <span style={{ color: 'red' }}>{selectItemCount}</span>{' '}
            {selectItemCount > 1 ? 'item(s)' : 'item'} selected
          </span>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}
export default withStyles(styles, { name: 'FilterBar' })(FilterBar)
