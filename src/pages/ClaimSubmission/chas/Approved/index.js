import React from 'react'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  Select,
} from '@/components'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../../common/TableGrid'
// variables
import {
  NewCHASColumnExtensions,
  NewCHASColumns,
  NewCHASTableData,
  TableConfig,
} from './variables'

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@withFormik({
  mapPropsToValues: () => ({}),
})
class ApprovedCHAS extends React.Component {
  render () {
    const { classes, handleContextMenuItemClick } = this.props
    return (
      <CardContainer hideHeader size='sm'>
        <BaseSearchBar>
          <GridItem md={12}>
            <FastField
              name='claimStatus'
              render={(args) => (
                <Select {...args} label='Claim Status' options={[]} />
              )}
            />
          </GridItem>
        </BaseSearchBar>
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={NewCHASTableData}
              columnExtensions={NewCHASColumnExtensions}
              columns={NewCHASColumns}
              tableConfig={TableConfig}
              onContextMenuItemClick={handleContextMenuItemClick}
            />
          </GridItem>
          <GridItem md={4} className={classes.buttonGroup}>
            <Button color='primary'>Get Status</Button>
            <Button color='success'>Collect Payment</Button>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'ApprovedCHAS' })(ApprovedCHAS)
