import React, { Component } from 'react'
import { withWidth, AppBar, Toolbar, Typography } from '@material-ui/core'

class FooterCheckIn extends Component {
  render() {
    return (
      <footer>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </footer>
    )
  }
}

export default withWidth()(FooterCheckIn)
