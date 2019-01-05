import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { addEmployeeToCustomer } from '../../../actions/employees'

class EmployeeList extends Component {
  handleAddEmployeeToCustomer = employeeId => {
    //add employee to all customerService that this current customer has.
    this.props.dispatch(addEmployeeToCustomer(employeeId))
  }
  render() {
    return (
      <div>
        <ListSubheader>Employees</ListSubheader>
        {this.props.employeeIds.map(employeeId => {
          const employee = this.props.employees[employeeId]
          return (
            <ListItem
              button
              key={employeeId}
              onClick={() => this.handleAddEmployeeToCustomer(employeeId)}
            >
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText
                primary={employee.firstName + ' ' + employee.lastName}
              />
            </ListItem>
          )
        })}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  employeeIds: state.employees.allIds,
  employees: state.employees.byId
})
export default connect(mapStateToProps)(EmployeeList)
