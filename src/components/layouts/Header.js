import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  flex: {
    flex: 1
  }
}

export default withStyles(styles)(({ classes }) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" color="inherit" noWrap>
        Welcome to Victoria Nails
      </Typography>
    </Toolbar>
  </AppBar>
))
