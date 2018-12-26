import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { CssBaseline } from '@material-ui/core'
import HeaderCheckIn from '../components/layouts/HeaderCheckIn'
import FooterCheckIn from '../components/layouts/FooterCheckIn'
import DashboardCheckIn from '../components/container/DashboardCheckIn'
import CircularProgress from '@material-ui/core/CircularProgress'

class CheckIn extends Component {
  componentDidMount() {
    // this.props.dispatch(initialData())
  }

  render() {
    return (
      <Fragment>
        <CssBaseline />
        <HeaderCheckIn />
        {this.props.fetching ? (
          <CircularProgress disableShrink />
        ) : (
          <DashboardCheckIn />
        )}
        <FooterCheckIn />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  fetching: state.fetching
})

export default connect(mapStateToProps)(CheckIn)
