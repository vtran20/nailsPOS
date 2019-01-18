import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import { connect } from 'react-redux'
  

import {
  searchCustomers
} from '../../../actions/customerSearch'
import {checkInCustomerAtPOS} from '../../../actions/customers'
import {addCustomerForm} from '../../../actions/forms'

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
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
})

class SearchCustom extends React.Component {
  state = {
    dense: false,
    secondary: false
  }
  handleChange = name => event => {
    if (event.target.value && event.target.value.length >= 3) {
      this.props.dispatch(searchCustomers(event.target.value, name))
    }
  }

  handleSelectCustomer = customer => {
    this.props.dispatch(checkInCustomerAtPOS(customer.id))
  }

  handleSelectCustomerForAppointment = customer => {
    const updatedCustomer = {...customer, status: 'SCHEDULED'}
    this.props.dispatch(addCustomerForm(updatedCustomer))
    //call back to parent method and move to select appointment time
    if (typeof this.props.onSelectCustomer === 'function') {
      this.props.onSelectCustomer()
    }
  }

  render() {
    const { classes, page, customerResults, fetching, notFound } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" className={classes.title}>
              Search Customers
            </Typography>
            <div className={classes.demo}>
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
            </div>
          <br />
          <br />
          <Paper>
            <Table>
              <TableBody>
                {notFound ? (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Cannot find your account
                    </TableCell>
                  </TableRow>
                ) : (
                  customerResults.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell component="th" scope="row">
                        {customer.firstName} {customer.lastName} -{' '}
                        {customer.phone} - {customer.email}
                      </TableCell>
                      <TableCell>
                      {page === 'appointment'
                        ? (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.handleSelectCustomerForAppointment(customer)}
                          >
                            Select Customer
                          </Button>
                          )
                        : (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.handleSelectCustomer(customer)}
                          >
                            Check In
                          </Button>
                          )
                      }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          </Grid>
        </Grid>
      </div>
    )
  }
}

SearchCustom.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  customerResults: state.customerSearch.customerResults,
  fetching: state.customerSearch.fetching,
  notFound: state.customerSearch.notFound
})
export default connect(mapStateToProps)(withStyles(styles)(SearchCustom))

