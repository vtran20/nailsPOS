import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { addEmployeeToCustomer } from '../../../actions/employees'
import { getEmployees } from '../../../selectors'

class EmployeeList extends Component {
  handleAddEmployeeToCustomer = employeeId => {
    //add employee to all customerService that this current customer has.
    this.props.dispatch(addEmployeeToCustomer(employeeId))
  }
  render() {
    const {employees} = this.props
    return (
      <div>
        <ListSubheader>Employees</ListSubheader>
        {employees.map(employee => {
          return (
            <ListItem
              button
              key={employee.id}
              onClick={() => this.handleAddEmployeeToCustomer(employee.id)}
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
  employees: getEmployees (state)
})
export default connect(mapStateToProps)(EmployeeList)
