import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import { Field } from 'formik'
import { Link } from 'umi'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import Authorized from '@/utils/Authorized'
// custom component
import {
  GridContainer,
  GridItem,
  TextField,
  Checkbox,
  ProgressButton,
  RadioGroup
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
  const { handelSearch, type, selectItemCount, handelNewPrescriptionSet, selectType, typeChange,
    generalAccessRight, personalAccessRight, theme
  } = props

  const disableFilterPrescriptionSet = generalAccessRight.rights === 'hidden' || personalAccessRight.rights === 'hidden'
  const addPrescriptionSetEnable = generalAccessRight.rights === 'enable' || personalAccessRight.rights === 'enable'

  return (
    <Fragment>
      <GridContainer>
        <GridItem md={4} >
            <Field
              name='searchName'
              render={(args) => (
                <TextField
                  {...args}
                  label='Prescription Set Name'
                  maxLength={100}
                />
              )}
            />
        </GridItem>
        <GridItem md={8} style={{ marginTop: theme.spacing(2) }}>
          <div style={{ position: 'relative' }}>
            <ProgressButton
              color='primary'
              size='sm'
              icon={<Search />}
              onClick={handelSearch}
            >
              Search
            </ProgressButton>
            <ProgressButton
              disabled={!addPrescriptionSetEnable}
              color='primary'
              size='sm'
              icon={<Add />}
              onClick={handelNewPrescriptionSet}
            >
              Add New
            </ProgressButton>
            <div
              style={{ display: 'inline-block', marginLeft: 10 }}>
              <RadioGroup
                disabled={disableFilterPrescriptionSet}
                value={selectType}
                label=''
                onChange={typeChange}
                options={[
                  {
                    value: 'All',
                    label: 'All',
                  },
                  {
                    value: 'General',
                    label: 'General',
                  },
                  {
                    value: 'Personal',
                    label: 'Personal',
                  },
                ]}
              />
            </div>
            <div style={{ position: 'absolute', right: 0, top: 10 }}>
              <span >
                <span style={{ color: 'red' }}>{selectItemCount || 0}</span> set selected
              </span>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}
export default withStyles(styles, { name: 'FilterBar' })(FilterBar)
