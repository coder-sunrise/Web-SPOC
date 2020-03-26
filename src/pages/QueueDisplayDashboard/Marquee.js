import React from 'react'
import { withStyles } from '@material-ui/core'

const styles = (theme) => ({
  '@keyframes marquee': {
    '0% ': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-100%,0)' },
  },

  marquee: {
    width: '60%',
    lineHeight: '10vh',
    backgroundColor: 'red',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },

  text: {
    animation: 'marquee 2s linear infinite',
    display: 'inline-block',
    paddingLeft: '100%',
  },
})

const Marquee = ({ classes }) => {
  return (
    <div classes={classes.marquee}>
      <p className={classes.text}>test</p>
    </div>
  )
}

export default withStyles(styles)(Marquee)
