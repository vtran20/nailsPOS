import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormGroup
} from '@material-ui/core'
import { removePOSDialog } from '../../../actions'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import { addEmployeeToCustomer } from '../../../actions/employees'
import { getEmployees, getEmployeeIdsOfCustomer } from '../../../selectors'


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
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

class EmployeesButtonDialog extends Component {

  handleAddServiceToCustomer = (employeeId, customerServiceId) => {
    //add employee to this current customer.
    this.props.dispatch(addEmployeeToCustomer(employeeId, customerServiceId))
  }

  onClose = () => {
    this.props.dispatch(removePOSDialog('openAddEmployeeDialog'))
    this.props.dispatch(removePOSDialog('customerServiceId'))
  }

  render() {
    const { classes, employees, posScreen, selectedEmployeeIds } = this.props
    const customerServiceId = posScreen? posScreen.customerServiceId : null
    return (
      <Dialog
        fullScreen
        open={this.props.openAddEmployeeDialog}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Select Employee'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormGroup row>
              {employees.map(employee => {
                return (
                  <Button
                    key={employee.id}
                    variant={selectedEmployeeIds.find(x => x === employee.id)? 'outlined' : 'contained'}
                    color="secondary"
                    size="small"
                    className={classes.button}
                    onClick={() =>
                        this.handleAddServiceToCustomer(employee.id, customerServiceId)
                      }
                  >
                  <SvgIcon>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/>
                  </SvgIcon>
                    {employee.firstName + ' ' + employee.lastName}
                  </Button>
                )
              })}
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.onClose}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
const mapStateToProps = state => ({
  employees: getEmployees (state),
  selectedEmployeeIds: getEmployeeIdsOfCustomer(state),
  openAddEmployeeDialog : (state.posScreen && state.posScreen.openAddEmployeeDialog)? true : false,
  posScreen : state.posScreen
})

export default connect(mapStateToProps)(withStyles(styles)(EmployeesButtonDialog))