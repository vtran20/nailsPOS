import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'
import { addCustomerForm } from '../../../actions/forms'
import {
  searchCustomers,
  clearCustomerSearchs
} from '../../../actions/customerSearch'

import {
  addCustomerServiceForm
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

class FindYourAccount extends Component {
  state = {}

  handleFoundCustomer = () => {
    //call back to parent method
    if (typeof this.props.handleFoundCustomer === 'function') {
      this.props.handleFoundCustomer()
    }
  }

  handleClickCreateNewCustomer = () => {
    //call back to parent method
    if (typeof this.props.onSelectCreateNewCustomer === 'function') {
      this.props.onSelectCreateNewCustomer()
    }
  }

  onClose = () => {
    //clear customer search if any
    this.props.dispatch(clearCustomerSearchs())
    //call back to parent method
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  handleChange = name => event => {
    if (event.target.value && event.target.value.length >= 3) {
      this.props.dispatch(searchCustomers(event.target.value, name))
    }
  }

  selectCustomer = customer => {
    this.props.dispatch(addCustomerForm(customer))
    this.props.dispatch(clearCustomerSearchs())
    //call back to parent method
    if (typeof this.props.onSelectCustomer === 'function') {
      this.props.onSelectCustomer()
    }
  }

  render() {
    const { classes, fullScreen, open, row, selectCustomer } = this.props
    return (
      <Dialog
        open={open}
        onClose={this.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Find Your Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email or phone number to find your account
            information.
          </DialogContentText>
          <TextField
            // autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            onChange={this.handleChange('email')}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone Number"
            type="phone"
            fullWidth
            onChange={this.handleChange('phone')}
          />
          <br />
          <br />
          <Paper>
            <Table>
              <TableBody>
                {this.props.notFound ? (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Cannot find your account
                    </TableCell>
                  </TableRow>
                ) : (
                  this.props.customerResults.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell component="th" scope="row">
                        {customer.firstName} {customer.lastName} -{' '}
                        {customer.phone} - {customer.email}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={() => this.selectCustomer(customer)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClickCreateNewCustomer}
            variant="contained"
            color="primary"
            // className={classes.button}
          >
            New Customer
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
const mapStateToProps = state => ({
  customerResults: state.customerSearch.customerResults,
  fetching: state.customerSearch.fetching,
  notFound: state.customerSearch.notFound
})
export default connect(mapStateToProps)(withStyles(styles)(FindYourAccount))
//export default withStyles(styles)(FindYourAccount)
