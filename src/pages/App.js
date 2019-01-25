import React, { Component, Fragment } from 'react'
import { CssBaseline } from '@material-ui/core'
import DashboardPOS from '../components/container/DashboardPOS'
import Footer from '../components/layouts/Footer'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline />
        {/*<Header />*/}
        {this.props.fetching ? (
          <CircularProgress disableShrink />
        ) : (
          <DashboardPOS />
        )}        
        <Footer />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  fetching: state.fetching
})

export default connect(mapStateToProps)(App)
