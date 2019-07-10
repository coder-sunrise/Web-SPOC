import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import NearMe from '@material-ui/icons/NearMe'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import BaseSearchBar from '../common/BaseSearchBar'
import TableGrid from '../common/TableGrid'
// variables
import {
  DraftMedisaveColumnExtensions,
  DraftMedisaveColumns,
  DraftMedisaveTableData,
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
class DraftMedisave extends React.Component {
  render () {
    const { classes, handleContextMenuItemClick } = this.props

    return (
      <CardContainer hideHeader size='sm'>
        <BaseSearchBar hideInvoiceDate />
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={DraftMedisaveTableData}
              columnExtensions={DraftMedisaveColumnExtensions}
              columns={DraftMedisaveColumns}
              onContextMenuItemClick={handleContextMenuItemClick}
              contextMenuOptions={[
                {
                  id: 0,
                  label: 'Claim Details',
                  Icon: NearMe,
                },
              ]}
            />
          </GridItem>
          <GridItem md={4} className={classes.buttonGroup}>
            <Button color='info'>Refresh</Button>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'DraftMedisave' })(DraftMedisave)
