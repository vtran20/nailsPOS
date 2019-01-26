import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import CustomerForm from '../forms/CustomerForm'
import {
  createNewCustomerServiceForCheckIn
  } from '../../../actions/forms'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    padding: `0 ${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
  },
  title: {
    margin: `0 0 ${theme.spacing.unit * 2}px`
  }
})

class AddCustomer extends React.Component {

  handleSubmitCustomerForm = () => {
    //call back to parent method, this will save information to store.forms
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
    //Create new customer service for for checkin and clear forms after that.
    this.props.dispatch(createNewCustomerServiceForCheckIn())
  }

  handleSubmitCustomerFormForAppointment = () => {
    //call back to parent method and move to select appointment time
    if (typeof this.props.onSelectCustomer === 'function') {
      this.props.onSelectCustomer()
    }    
  }

  handleSubmitCustomerFormForPOSCheckIn = () => {
    //call back to parent method and move to select appointment time
    if (typeof this.props.onSelectCustomer === 'function') {
      this.props.onSelectCustomer()
    }    
  }

  render() {
    const { classes, page, phone, email } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.title}>
              New Customer
            </Typography>
            <div className={classes.demo}>
              <CustomerForm 
              onSubmit={this.handleSubmitCustomerForm} 
              onSelectCustomer={this.handleSubmitCustomerFormForAppointment}
              page={page}
              phone={phone}
              email={email}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

AddCustomer.propTypes = {
  classes: PropTypes.object.isRequired
}

// const mapStateToProps = state => ({
//   customersIds: state.customers.allIds,
//   customers: state.customers.byId
// })
export default connect()(withStyles(styles)(AddCustomer))

