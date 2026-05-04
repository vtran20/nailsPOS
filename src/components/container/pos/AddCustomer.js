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

const AddCustomer = (props) => {
  const { classes, page, phone, email } = props

  const handleSubmitCustomerForm = () => {
    //call back to parent method, this will save information to store.forms
    console.log ("handleSubmitCustomerForm props.onSubmit", props.onSubmit)
    if (typeof props.onSubmit === 'function') {
      props.onSubmit()
    }
    //Create new customer service for checkin and clear forms after that.
    props.dispatch(createNewCustomerServiceForCheckIn())
  }

  const handleSubmitCustomerFormForAppointment = () => {
    console.log("handleSubmitCustomerFormForAppointment", props.onSelectCustomer)
    //call back to parent method and move to select appointment time
    if (typeof props.onSelectCustomer === 'function') {
      props.onSelectCustomer()
    }    
  }

  const handleSubmitCustomerFormForPOSCheckIn = () => {
    console.log("handleSubmitCustomerFormForPOSCheckIn", props.onSelectCustomer)
    //call back to parent method and move to select appointment time
    if (typeof props.onSelectCustomer === 'function') {
      props.onSelectCustomer()
    }    
  }

  return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.title}>
              New Customer
            </Typography>
            <div className={classes.demo}>
              <CustomerForm
                  onSubmit={handleSubmitCustomerForm}
                  onSelectCustomer={handleSubmitCustomerFormForAppointment}
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

AddCustomer.propTypes = {
  classes: PropTypes.object.isRequired,
  page: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  onSelectCustomer: PropTypes.func
}

// const mapStateToProps = state => ({
//   customersIds: state.customers.allIds,
//   customers: state.customers.byId
// })
export default connect()(withStyles(styles)(AddCustomer))

