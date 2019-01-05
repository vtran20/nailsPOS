import React, { Component, Fragment } from 'react'
import { CssBaseline } from '@material-ui/core'
import DashboardPOS from '../components/container/DashboardPOS'

export default class extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline />
        {/*<Header />*/}
        <DashboardPOS />
        {/*<Footer />*/}
      </Fragment>
    )
  }
}
