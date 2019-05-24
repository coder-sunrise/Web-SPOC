import React from 'react'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Assignment } from '@material-ui/icons'
import {
  CommonHeader,
  GridContainer,
  GridItem,
  Select,
  TextField,
  ANTDSelect,
} from '@/components'

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

@withFormik({ mapPropsToValues: () => ({}) })
class FixSelect extends React.PureComponent {
  render () {
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
              name='Test2'
              render={(args) => (
                <ANTDSelect {...args} options={antDOptions} label='Test2' />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name='TestMultiple'
              render={(args) => (
                <ANTDSelect
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
          <GridItem xs md={2}>
            <FastField
              name='Test1'
              render={(args) => (
                <Select {...args} options={antDOptions} label='Test1' />
              )}
            />
          </GridItem>
        </GridContainer>
      </CommonHeader>
    )
  }
}
export default FixSelect
