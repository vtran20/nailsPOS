import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import {
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  SvgIcon,
  CircularProgress
  } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { selectCustomer, reloadData } from '../../../actions'
import { getCustomers, getCurrentCustomer } from '../../../selectors'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  flex: {
    flexGrow: 1
  }
})
class CustomerList extends Component {
  handleClick = data => {
    this.props.dispatch(selectCustomer(data))
  }
  onReload = () => {
    this.props.dispatch(reloadData()) 
  }
  render() {
    const { classes, status, title, currentCustomer, customers, fetching } = this.props
    return (
      <div>
          {
            title === 'Customers' && fetching
            ? <CircularProgress disableShrink />
            : ''
          }
        <ListSubheader>
          <ListItemText primary={title} />
          {
            title === 'Customers'
            ? (
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.onReload()}>
                  <SvgIcon>
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/><path d="M0 0h24v24H0z" fill="none"/>
                  </SvgIcon>
                </IconButton>
              </ListItemSecondaryAction>
              )
            :''
          }
        </ListSubheader>
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
  customers: getCustomers(state),
  fetching: state.customers.fetching
})
export default connect(mapStateToProps)(withStyles(styles)(CustomerList))
