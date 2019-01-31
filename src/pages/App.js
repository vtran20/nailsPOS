import React, { Component, Fragment } from 'react'
import { CssBaseline } from '@material-ui/core'
import DashboardPOS from '../components/container/DashboardPOS'
import Footer from '../components/layouts/Footer'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { reloadData } from '../actions'

class App extends Component {
  // componentDidMount () {
  //  var intervalId = setInterval(this.timer, 1000)
  //  // store intervalId in the state so it can be accessed later:
  //  this.setState({intervalId: intervalId})
  // }

  // componentWillUnmount () {
  //    // use intervalId from the state to clear the interval
  //    clearInterval(this.state.intervalId)
  // }

  // timer () {
  //  var newCount = this.state.currentCount - 1
  //  //  console.log(this.state? this.state.intervalId : 0)
  //  //  console.log(this.state? this.state.currentCount : 0)
  //  if(newCount >= 0) { 
  //      this.setState({ currentCount: newCount })
  //  } else {
  //      clearInterval(this.state.intervalId)
  //  }
  // }

componentDidMount() {
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
  fetching: state.fetching
})

export default connect(mapStateToProps)(App)
