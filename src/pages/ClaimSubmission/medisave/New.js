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
  TextField,
} from '@/components'
// sub components
import BaseSearchBar from '../common/BaseSearchBar'
import TableGrid from '../common/TableGrid'
// variables
import {
  NewMedisaveColumnExtensions,
  NewMedisaveColumns,
  NewMedisaveTableData,
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
class NewMedisave extends React.Component {
  render () {
    const { classes, handleContextMenuItemClick } = this.props

    return (
      <CardContainer hideHeader size='sm'>
        <BaseSearchBar>
          <GridItem md={12}>
            <FastField
              name='hrnNo'
              render={(args) => <TextField {...args} label='HRN No.' />}
            />
          </GridItem>
        </BaseSearchBar>
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={NewMedisaveTableData}
              columnExtensions={NewMedisaveColumnExtensions}
              columns={NewMedisaveColumns}
              tableConfig={TableConfig}
              onContextMenuItemClick={handleContextMenuItemClick}
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

export default withStyles(styles, { name: 'DraftMedisave' })(NewMedisave)
