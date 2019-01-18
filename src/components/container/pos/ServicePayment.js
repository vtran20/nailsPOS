import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import { deleteEmployeeService } from '../../../actions/employeeServices'
import { deleteCustomerService } from '../../../actions/customerServices'
import { cents2Dollars } from '../../../utils'
import { getCustomerServicesOfCustomer } from '../../../selectors'

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
    const { classes, customerServices, employeeServices, employees, services } = this.props

    return (
      <div>
        {customerServices
          ? customerServices.map(customerService => {
              const employeeServiceIds = customerService.employeeServices
              const service = services[customerService.serviceId]
              return (
                <Paper className={classes.root} key={customerService.id}>
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
                          const employeeService = employeeServices[employeServiceId]
                          const employee = employees[employeeService.employeeId]
                          return (
                            <TableRow key={employeeService.id}>
                              <TableCell component="th" scope="row">
                                {employee.firstName + ' ' + employee.lastName}
                              </TableCell>
                              <TableCell align="right">
                              {cents2Dollars(employeeService.servicePrice)}
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
  employees: state.employees.byId,
  services: state.services.byId,
  employeeServices: state.employeeServices.byId,
  customerServices : getCustomerServicesOfCustomer(state)
})

export default connect(mapStateToProps)(withStyles(styles)(ServicePayment))
