import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem } from '@/components'
// sub components

const styles = (theme) => ({
  verticalSpacing: {
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    '& > h4': {
      fontWeight: 500,
    },
  },
})
class Prompt extends React.PureComponent {
  render () {
    const { classes, footer, updateSelectedValues } = this.props
    return (
      <div>
        <React.Fragment>
          <div className={classes.verticalSpacing}>
            <GridContainer>
              <GridItem md={12} className={classes.verticalSpacing}>
                <p style={{ fontSize: '1.3em' }}>
                  Confirm to change this module&lsquo;s access right？
                </p>
              </GridItem>
            </GridContainer>
          </div>

          <GridItem md={4} />
          {footer &&
            footer({
              confirmBtnText: 'Confirm',
              onConfirm: updateSelectedValues,
            })}
        </React.Fragment>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'prompt' })(Prompt)
