import React from 'react'
import * as Yup from 'yup'
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
  AntdInput,
  DateRangePicker,
} from '@/components'
import AntdSelect from '@/components/Antd/AntdSelect'
import CustomDatePicker from '@/components/DatePicker/ANTDatePicker'
import { DatePicker as ANTDatePicker } from 'antd'

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

const ValidationSchema = Yup.object().shape({
  AntdInputError: Yup.string().required(),
  Test: Yup.string().required(),
  selectLocation: Yup.string().required(),
})

@withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: () => ({
    TestDatePicker2: '20192205',
  }),
})
class FixSelect extends React.PureComponent {
  state = {
    showModal: false,
    testAntdInput: '',
  }

  toggleModal = () => {
    const { showModal } = this.state
    this.setState({ showModal: !showModal })
  }

  handleChange = (event) => {
    console.log('fixSelect handleChange', event.target.value)
    this.setState({ testAntdInput: event.target.value })
  }

  render () {
    const { showModal, testAntdInput } = this.state
    console.log('fixselect', this.props)
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
              name='AntdInput'
              render={(args) => <AntdInput {...args} label='Antd Input' />}
            />
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='AntdInputError'
              render={(args) => (
                <AntdInput {...args} label='Antd Input Error' />
              )}
            />
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='selectLocation'
              render={(args) => (
                <AntdSelect
                  {...args}
                  options={antDOptions}
                  label='Antd Select'
                />
              )}
            />
          </GridItem>
          <GridItem xs md={2}>
            <AntdSelect
              options={antDOptions}
              value='penang'
              label='Antd Select'
            />
          </GridItem>
          <GridItem xs md={2}>
            <FastField
              name='testMultipleSelect'
              render={(args) => (
                <AntdSelect
                  options={antDOptions}
                  label='Antd Select'
                  mode='multiple'
                  {...args}
                />
              )}
            />
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
