import React,{PureComponent,memo} from 'react'
import { formatMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'

import {
  Button,
  CommonModal,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  Field,
  CodeSelect,
  withFormikExtend,
  DateRangePicker,
  ClinicianSelect,
  DatePicker,
  Select,
  reversedDateFormat,
  ProgressButton,
  Tooltip,
  Checkbox,
} from '@/components'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '20px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})


class FilterBar extends PureComponent {

  render() {

    const {handleSubmit} = this.props
    return(
    <div>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='searchValue'
                render={args => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'patient.patientresult.serviceName',
                    })}
                    autoFocus
                  />
                )}
              />
            </GridItem>
            <GridItem md={5}>
              <FastField
                name='visitDate'
                render={args => (
                  <DateRangePicker label='Visit Date' label2='To' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs sm={4} md={3}>
              <FastField
                name='isAllDateChecked'
                render={args => {
                  return (
                    <Tooltip
                      title={formatMessage({
                        id: 'form.date.placeholder.allDate',
                      })}
                      placement='bottom'
                    >
                      <Checkbox
                        label={formatMessage({
                          id: 'form.date.placeholder.allDate',
                        })}
                        inputLabel=' '
                        {...args}
                      />
                    </Tooltip>
                  )
                }}
              />
            </GridItem>
            <GridItem xs sm={8} md={4}>
              <ProgressButton
                icon={null}
                color='primary'
                size='sm'
                onClick={handleSubmit}
              >
                <Search />
                Search
              </ProgressButton>
            </GridItem>
          </GridContainer>
        </div>
    )
  }
}

export default memo(
  withFormikExtend({
    handleSubmit: (values, { props }) => {
      const { dispatch } = props

      dispatch({
        type: 'labTrackingDetails/query',
        payload: {
          apiCriteria: {
            ...values,
          },
        },
      })
    },
  })(FilterBar),
)
