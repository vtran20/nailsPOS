import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  DialogActions,
  ListItemText
} from '@material-ui/core'
import { addCustomerForm } from '../../../actions/forms'
import {
  searchCustomers,
  clearCustomerSearchs
} from '../../../actions/customerSearch'

import {
  addCustomerServiceForm,
  checkInAppointmentCustomer
} from '../../../actions/forms'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  flex: {
    flex: 1
  }
})

class ScheduledAppointment extends Component {
  state = {}

  handleClickFindYourAccount = () => {
    //call back to parent method
    if (typeof this.props.onSelectFindYourAccount === 'function') {
      this.props.onSelectFindYourAccount()
    }
  }

  handleClickCreateNewCustomer = () => {
    //call back to parent method
    if (typeof this.props.onSelectCreateNewCustomer === 'function') {
      this.props.onSelectCreateNewCustomer()
    }
  }

  handleClose = () => {
    //call back to parent method
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  handleFoundAppointment = customer => {
    this.props.dispatch(checkInAppointmentCustomer(customer))
    //call back to parent method
    if (typeof this.props.onSelectSchedule === 'function') {
      this.props.onSelectSchedule()
    }
  }

  render() {
    const {
      classes,
      fullScreen,
      open,
      onClose,
      row
    } = this.props
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">
          {this.props.allIds && this.props.allIds.length > 0
            ? 'Please select your appointment'
            : 'We cannot find your appointment today'}
        </DialogTitle>
        <List>
          {this.props.allIds.map(customerId => {
            let customer = this.props.customers[customerId]
            return (
              <ListItem
                button
                onClick={() => this.handleFoundAppointment(customer)}
                key={customerId}
              >
                <ListItemText
                  primary={
                    customer.firstName +
                    ' ' +
                    customer.lastName +
                    ' - ' +
                    customer.email +
                    ' - ' +
                    customer.phone
                  }
                />
              </ListItem>
            )
          })}
        </List>
        <DialogActions>
          <Button
            onClick={this.handleClickFindYourAccount}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Find Your Account
          </Button>
          <Button
            onClick={this.handleClickCreateNewCustomer}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            New Customer
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
const mapStateToProps = state => ({
  customers: state.customers.byId,
  allIds: state.customers.allIds.filter(
    customerId => state.customers.byId[customerId].status === 'SCHEDULED'
  )
})

//  export default withStyles(styles)(ScheduledAppointment)

export default connect(mapStateToProps)(
  withStyles(styles)(ScheduledAppointment)
)
