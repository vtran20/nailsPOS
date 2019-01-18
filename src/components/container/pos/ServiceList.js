import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import { connect } from 'react-redux'
import { addServiceToCustomer } from '../../../actions/services'
import { getServices } from '../../../selectors'


class ServiceList extends Component {
  handleAddServiceToCustomer = serviceId => {
    //add service to this current customer.
    this.props.dispatch(addServiceToCustomer(serviceId))
  }

  render() {
    const {services} = this.props
    return (
      <div>
        <ListSubheader>Services</ListSubheader>
        {services.map(service => {
          return (
            <ListItem button key={service.id} onClick={() => this.handleAddServiceToCustomer(service.id)}>
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
  services: getServices(state)
})
export default connect(mapStateToProps)(ServiceList)
