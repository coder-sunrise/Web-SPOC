import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { Field } from 'formik'
import { Link } from 'umi'
import Search from '@material-ui/icons/Search'
import Authorized from '@/utils/Authorized'
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
  const { handelSearch, type, selectItemCount, handelNewPrescriptionSet } = props
  const prescriptionSetAccessRight = Authorized.check('queue.consultation.order.prescriptionset') || {}
  return (
    <Fragment>
      <GridContainer>
        <GridItem md={6} style={{ paddingRight: 140 }}>
          <div style={{ position: 'relative' }}>
            <Field
              name='searchName'
              render={(args) => (
                <TextField
                  {...args}
                  label='Prescription Set Name'
                />
              )}
            />
            <ProgressButton
              style={{ position: 'absolute', right: -140, top: 10 }}
              color='primary'
              icon={<Search />}
              onClick={handelSearch}
            >
              Search
            </ProgressButton>
          </div>
        </GridItem>

        <GridItem
          md={6}
          justify='flex-end'
          alignItems='center'
          container
          style={{ paddingRight: 150 }}
        >
          <div style={{ position: 'relative' }}>
            {prescriptionSetAccessRight.rights === 'enable' &&
              <Link onClick={(e) => {
                e.preventDefault()
                handelNewPrescriptionSet()
              }}><span style={{ textDecoration: 'underline' }}>Add New Prescription Set</span></Link>
            }
            <div style={{ position: 'absolute', right: -150, top: 0 }}>
              <span >
                <span style={{ color: 'red' }}>{selectItemCount || 0}</span>{' '}
                {selectItemCount > 1 ? 'item(s)' : 'item'} selected
              </span>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}
export default withStyles(styles, { name: 'FilterBar' })(FilterBar)
