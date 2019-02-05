import React, { Component, Fragment } from 'react'
import { CssBaseline } from '@material-ui/core'
import { connect } from 'react-redux'
import SignIn from './SignIn'
import POS from './POS'
import {isLoggedIn} from '../selectors'


class App extends Component {

  render() {
    return (
      <Fragment>
      {this.props.isLoggedIn
      	? <POS/>
      	: <SignIn/>
      }        
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  fetching: state.customers.fetching,
  isLoggedIn : isLoggedIn(state)
})

export default connect(mapStateToProps)(App)
