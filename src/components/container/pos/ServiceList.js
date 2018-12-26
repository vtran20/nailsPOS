import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import BarChartIcon from '@material-ui/icons/BarChart'
import LayersIcon from '@material-ui/icons/Layers'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { addServiceToCustomer } from '../../../actions/services'

class ServiceList extends Component {
  handleAddServiceToCustomer = serviceId => {
    //add service to this current customer.
    this.props.dispatch(addServiceToCustomer(serviceId))
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <ListSubheader>Services</ListSubheader>
        {this.props.servicesIds.map(serviceId => {
          const service = this.props.services[serviceId]
          return (
            <ListItem button key={serviceId} onClick={() => this.handleAddServiceToCustomer(serviceId)}>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary={service.name} />
            </ListItem>
          )
        })}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  servicesIds: state.services.allIds,
  services: state.services.byId
})
export default connect(mapStateToProps)(ServiceList)
