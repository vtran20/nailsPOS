import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { selectCustomer } from '../../../actions'
import { getCustomers, getCurrentCustomer } from '../../../selectors'

class CustomerList extends Component {
  handleClick = data => {
    this.props.dispatch(selectCustomer(data))
  }
  render() {
    const { status, title, currentCustomer, customers } = this.props
    return (
      <div>
        <ListSubheader>{title}</ListSubheader>
        {/*if we don't pass status: return all customer except SCHEDULED and COMPLETED. If we pass status, only return customer for that status */}
        {customers
          .filter(customer => {
            return status
              ? customer.status === status 
                ? true
                : false
              : customer.status !== 'SCHEDULED' && 
                customer.status !== 'COMPLETED' 
              ? true
              : false
          })
          .map(customer => {
            return (
              <ListItem
                button
                key={customer.id}
                onClick={() =>
                  this.handleClick({
                    screen: customer.status === 'COMPLETED' ? 'PAYMENT_CUSTOMER' : 'CUSTOMER_DETAIL',
                    customerId: customer.id
                  })
                }
                selected={currentCustomer
                  ? currentCustomer.id === customer.id ? true : false 
                  : false}
              >
                <Avatar>
                  <ImageIcon />
                </Avatar>
                <ListItemText
                  primary={customer.firstName + ' ' + customer.lastName}
                />
              </ListItem>
            )
          })}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  currentCustomer: getCurrentCustomer(state),
  customers: getCustomers(state)
})
export default connect(mapStateToProps)(CustomerList)
