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
import Tooltip from '@material-ui/core/Tooltip'
import SvgIcon from '@material-ui/core/SvgIcon'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import { deleteEmployeeService, updateEmployeeServiceInfo } from '../../../actions/employeeServices'
import { deleteCustomerService } from '../../../actions/customerServices'
import { cents2Dollars, cents2Fixed2, dollars2Cents } from '../../../utils'
import { handleOpenDialog } from '../../../actions'
import { getCustomerServicesOfCustomer } from '../../../selectors'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 600
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    width: 100,
  },
  margin: {
    margin: theme.spacing.unit,
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

class ServiceTables extends React.Component {
  handleServicePayChange = (employeeServiceId) => ({ target: { value } }) => {
    this.props.dispatch(updateEmployeeServiceInfo({id: employeeServiceId, servicePrice:dollars2Cents(value)}))
  }

  handleRemoveEmployeeService = employeeService => {
    this.props.dispatch(deleteEmployeeService(employeeService))
  }

  handleRemoveCustomerService = customerService => {
    this.props.dispatch(deleteCustomerService(customerService))
  }

  handleOpenAddEmployeesDialog = (dialog) => {
    this.props.dispatch(handleOpenDialog(dialog))
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
                        <TableCell align="right">
                        <Tooltip disableFocusListener title="Add Employee">
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            className={classes.button}
                            onClick={() =>
                              this.handleOpenAddEmployeesDialog({
                                openAddEmployeeDialog: true, customerServiceId: customerService.id
                              })
                            }
                          >
                            <SvgIcon>
                              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </SvgIcon>
                          </Button>
                          </Tooltip>
                        <Tooltip disableFocusListener title="Remove Service">
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            className={classes.button}
                            onClick={() =>
                              this.handleRemoveCustomerService(customerService)
                            }
                          >
                            <DeleteIcon className={classes.icon} />
                          </Button>
                          </Tooltip>
                        </TableCell>
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
                                {employee? employee.firstName + ' ' + employee.lastName : ''}
                              </TableCell>
                              <TableCell align="right">
                                <FormControl className={classes.input}>
                                  <InputLabel htmlFor="adornment-amount">Pay</InputLabel>
                                  <Input
                                    id={'service-amount_'+employeeService.id}
                                    onFocus={e => e.target.select()}
                                    defaultValue = {cents2Fixed2(employeeService.servicePrice)}
                                    onChange={this.handleServicePayChange(employeServiceId)}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                  />
                                </FormControl>
                              </TableCell>
                              <TableCell align="right">
                              <Tooltip disableFocusListener title="Remove Employee">
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  className={classes.button}
                                  onClick={() =>
                                    this.handleRemoveEmployeeService(
                                      employeeService
                                    )
                                  }
                                >
                                  <SvgIcon>
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                  </SvgIcon>
                                </Button>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    ) : (
                      ''
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
ServiceTables.propTypes = {
  classes: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  employees: state.employees.byId,
  services: state.services.byId,
  customerServices : getCustomerServicesOfCustomer(state),
  employeeServices: state.employeeServices.byId
})

export default connect(mapStateToProps)(withStyles(styles)(ServiceTables))
