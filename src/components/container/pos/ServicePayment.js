import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import { deleteEmployeeService } from '../../../actions/employeeServices'
import { deleteCustomerService } from '../../../actions/customerServices'
import { cents2Dollars } from '../../../utils'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 300
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class ServicePayment extends React.Component {

  handleRemoveEmployeeService = employeeService => {
    this.props.dispatch(deleteEmployeeService(employeeService))
  }

  handleRemoveCustomerService = customerService => {
    this.props.dispatch(deleteCustomerService(customerService))
  }

  render() {
    const { classes } = this.props
    const customerServiceIds = this.props.customers[this.props.customerId]
      .customerServices
    return (
      <div>
        {(customerServiceIds && customerServiceIds.length > 0)
          ? customerServiceIds.map(customerServiceId => {
              const customerService = this.props.customerServices[
                customerServiceId
              ]
              const employeeServiceIds = customerService.employeeServices
              const service = this.props.services[customerService.serviceId]
              return (
                <Paper className={classes.root} key={customerServiceId}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{service.name}</TableCell>
                        <TableCell align="right">{cents2Dollars(service.price)}</TableCell>
                      </TableRow>
                    </TableHead>
                    {employeeServiceIds && employeeServiceIds.length > 0 ? (
                      <TableBody>
                        {employeeServiceIds.map(employeServiceId => {
                          const employeeService = this.props.employeeServices[
                            employeServiceId
                          ]
                          const employee = this.props.employees[
                            employeeService.employeeId
                          ]
                          return (
                            <TableRow key={employeeService.id}>
                              <TableCell component="th" scope="row">
                                {employee.firstName + ' ' + employee.lastName}
                              </TableCell>
                              <TableCell align="right">
                              {cents2Dollars(employeeService.servicePay)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    ) : (
                      ' '
                    )}
                  </Table>
                </Paper>
              )
            })
          : ''}
      </div>
    )
  }
}
ServicePayment.propTypes = {
  classes: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  customers: state.customers.byId,
  employees: state.employees.byId,
  customerId: state.posScreen.customerId,
  services: state.services.byId,
  customerServices: state.customerServices.byId,
  employeeServices: state.employeeServices.byId
})

export default connect(mapStateToProps)(withStyles(styles)(ServicePayment))
