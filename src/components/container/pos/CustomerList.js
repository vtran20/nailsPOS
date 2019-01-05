import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { selectCustomer } from '../../../actions'

class CustomerList extends Component {
  handleClick = data => {
    console.log(data)
    this.props.dispatch(selectCustomer(data))
  }
  render() {

    const { status, title } = this.props
    
    return (
      <div>
        <ListSubheader>{title}</ListSubheader>
        {/*if we don't pass status: return all customer except SCHEDULED and COMPLETED. If we pass status, only return customer for that status */}
        {this.props.customersIds
          .filter(cId => {
            return status
              ? this.props.customers[cId].status === status
                ? true
                : false
              : this.props.customers[cId].status !== 'SCHEDULED' &&
                this.props.customers[cId].status !== 'COMPLETED'
              ? true
              : false
          })
          .map(customerId => {
            const customer = this.props.customers[customerId]
            return (
              <ListItem
                button
                key={customerId}
                onClick={() =>
                  this.handleClick({
                    screen: customer.status === 'COMPLETED' ? 'PAYMENT_CUSTOMER' : 'CUSTOMER_DETAIL',
                    customerId: customerId
                  })
                }
                selected={customerId === this.props.currentCustomerId ? true : false}
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
  customersIds: state.customers.allIds,
  customers: state.customers.byId,
  currentCustomerId: state.posScreen && state.posScreen.customerId? state.posScreen.customerId : null
})
export default connect(mapStateToProps)(CustomerList)
