import React, { PureComponent } from 'react'
// umi
import { formatMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { Book } from '@material-ui/icons'
// custom components
import { NavPills, CommonHeader, RadioGroup } from '@/components'
// sub components
import ActionBar from './ActionBar'
import DetailGrid from './DetailGrid'

@withFormik({ mapPropsToValues: () => ({}) })
class CreditDebitNote extends PureComponent {
  render () {
    return (
      <CommonHeader Icon={<Book />} titleId='finance.cdNote.title'>
        <FastField
          name='noteType'
          render={(args) => (
            <RadioGroup
              label=' '
              simple
              defaultValue='credit'
              options={[
                {
                  value: 'credit',
                  label: formatMessage({ id: 'finance.cdNote.credit' }),
                },
                {
                  value: 'debit',
                  label: formatMessage({ id: 'finance.cdNote.debit' }),
                },
              ]}
              {...args}
            />
          )}
        />
        <ActionBar />
        <DetailGrid />
      </CommonHeader>
    )
  }
}

export default CreditDebitNote
