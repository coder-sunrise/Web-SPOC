import React from 'react'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Assignment } from '@material-ui/icons'
import {
  Button,
  CommonHeader,
  CommonModal,
  GridContainer,
  GridItem,
  Select,
  TextField,
  // ANTDSelect,
  // DatePicker,
  DateRangePicker,
} from '@/components'
import CustomDatePicker from '@/components/DatePicker/ANTDatePicker'
import { Select as ANTDSelect, DatePicker as ANTDatePicker } from 'antd'

const options = [
  { name: 'test', value: 'test' },
  { name: 'test1', value: 'test1' },
]

const antDOptions = [
  { name: 'Penang', value: 'penang' },
  { name: 'Singapore', value: 'singapore' },
  { name: 'United States', value: 'us' },
  { name: 'Canada', value: 'canada' },
  { name: 'Switzerland', value: 'switzerland' },
  { name: 'Chang Jiang', value: 'changjiang' },
  { name: 'Malaysia', value: 'malaysia' },
  { name: 'Vietnam', value: 'vietnam' },
  { name: 'Thailand', value: 'thailand' },
  { name: 'england', value: 'england' },
  { name: 'Denmark', value: 'denmark' },
  { name: 'Indonesia', value: 'indonesia' },
  { name: 'Brazil', value: 'brazil' },
  { name: 'Argentina', value: 'argentina' },
  { name: 'Roma', value: 'roma' },
  { name: 'Egypt', value: 'egypt' },
  { name: 'China', value: 'china' },
  { name: 'Taiwan', value: 'taiwan' },
  { name: 'Korea', value: 'korea' },
  { name: 'Japan', value: 'japan' },
  { name: 'South Korea', value: 'southkorea' },
  { name: 'Indo', value: 'indo' },
]

@withFormik({
  mapPropsToValues: () => ({
    TestDatePicker2: '20192205',
  }),
})
class FixSelect extends React.PureComponent {
  state = {
    showModal: false,
  }

  toggleModal = () => {
    const { showModal } = this.state
    this.setState({ showModal: !showModal })
  }

  render () {
    const { showModal } = this.state

    return (
      <CommonHeader Icon={<Assignment />}>
        <GridContainer>
          <GridItem xs md={2}>
            <FastField
              name='Test'
              render={(args) => <TextField {...args} label='Test1' />}
            />
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='TestSelect'
              render={(args) => (
                <Select {...args} options={antDOptions} label='Test Select' />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name='multipleNation'
              render={(args) => (
                <Select
                  {...args}
                  options={antDOptions}
                  multiple
                  label='Multiple select'
                />
              )}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem>
            <Button color='primary' onClick={this.toggleModal}>
              Open Modal
            </Button>
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='TestDatePicker'
              render={(args) => (
                <CustomDatePicker {...args} label='Test DatePicker' />
              )}
            />
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='TestDateRange'
              render={(args) => (
                <DateRangePicker {...args} label='Range Picker' />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name='CurrentDatePicker'
              render={(args) => (
                <CustomDatePicker {...args} label='Current Date Picker' />
              )}
            />
          </GridItem>
          <GridItem>
            <ANTDatePicker />
          </GridItem>
        </GridContainer>
        <CommonModal
          open={showModal}
          title='Test Select'
          bodyNoPadding
          onClose={this.toggleModal}
        >
          <GridContainer>
            <GridItem xs md={2}>
              <FastField
                name='Test2'
                render={(args) => (
                  <Select {...args} options={antDOptions} label='Test2' />
                )}
              />
            </GridItem>

            <GridItem xs md={2}>
              <FastField
                name='TestDatePicker2'
                render={(args) => (
                  <CustomDatePicker {...args} label='Test DatePicker' />
                )}
              />
            </GridItem>
            <GridItem>
              <ANTDatePicker />
            </GridItem>

            <GridItem xs md={4}>
              <FastField
                name='TestMultiple'
                render={(args) => (
                  <Select
                    {...args}
                    options={antDOptions}
                    multiple
                    label='Multiple select'
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </CommonModal>
      </CommonHeader>
    )
  }
}
export default FixSelect
