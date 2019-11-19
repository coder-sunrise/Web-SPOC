import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { Primary } from '@/components'

const styles = (theme) => ({
  container: {
    // display: 'inline-block',
    marginLeft: theme.spacing(1),
    '& span': {
      textDecoration: 'underline',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

const MoreButton = ({ classes }) => (
  <div className={classes.container}>
    <Primary>
      <span>More</span>
    </Primary>
    {/* <Button simple variant='outlined' link color='info' size='sm'>
          More
        </Button> */}
  </div>
)

export default withStyles(styles, { name: 'MoreButtonComponent' })(MoreButton)
