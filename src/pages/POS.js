import React, { Component, Fragment } from 'react'
import { CssBaseline } from '@material-ui/core'
import DashboardPOS from '../components/container/DashboardPOS'
import Footer from '../components/layouts/Footer'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { initialData, reloadData } from '../actions'
import Cookies from 'universal-cookie'

class POS extends Component {
componentDidMount() {
  const cookies = new Cookies()
  const storeIdFromCookie = cookies.get('STORE_ID_COOKIE')
  this.props.dispatch(initialData(storeIdFromCookie))
  this.interval = setInterval(() => this.reloadNewData(), 1000*60*60); // load new data each hour
}
componentWillUnmount() {
  clearInterval(this.interval);
}

reloadNewData () {
  this.props.dispatch(reloadData()) 
}
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
  fetching: state.fetching,
})

export default connect(mapStateToProps)(POS)
