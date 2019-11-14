import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
// common components
import {
  Button,
  CommonTableGrid2,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'

const columns = [
  { name: 'module', title: 'Module' },
  { name: 'submodule', title: 'Sub Module' },
  { name: 'functionAccess', title: 'Function Access' },
  { name: 'accessbility', title: 'Accessbility' },
]

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

const AccessRight = ({ classes }) => {
  return (
    <GridContainer alignItems='center'>
      <GridItem md={4} className={classes.verticalSpacing}>
        <TextField
          label='Module / Sub Module / Function Access'
          onChange={() => ({})}
        />
      </GridItem>
      <GridItem>
        <Button color='primary'>
          <Search />
          Search
        </Button>
      </GridItem>
      <GridItem md={12}>
        <CommonTableGrid2 rows={[]} columns={columns} />
      </GridItem>
      <GridItem md={12} className={classes.verticalSpacing}>
        <p>
          * Represents function access to Patient Notes Viewable/Actionable only
          by users with an MCR number.
        </p>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'AccessRight' })(AccessRight)
