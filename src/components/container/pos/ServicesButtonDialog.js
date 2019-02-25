import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormGroup,
  Toolbar,
  IconButton,
  Typography,
  AppBar,
  Tabs,
  Tab,TabContainer
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { removePOSDialog } from '../../../actions'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import { cents2Dollars } from '../../../utils'
import { addServiceToCustomer } from '../../../actions/services'
import { getServiceIdsOfCustomer, getServices, getServicesByGroup, getServiceGroups } from '../../../selectors'


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
  },
  dialogBody: {
    padding: `0 ${theme.spacing.unit * 3}px`
  },
  appBar: {
      position: 'relative',
  },
})


class ServicesButtonDialog extends Component {

  state = {
    value: 0
  }

  handleAddServiceToCustomer = serviceId => {
    //add service to this current customer.
    this.props.dispatch(addServiceToCustomer(serviceId))
  }

  onClose = () => {
    this.props.dispatch(removePOSDialog('openAddServiceDialog'))

    //call back to parent method
    // if (typeof this.props.onClose === 'function') {
    //   this.props.onClose()
    // }
  }

  handleChange = (event, newValue) => {
    this.setState({value: newValue})

  }

  render() {
    const { classes, services, selectedServiceIds, serviceGroups, byId } = this.props

    return (
      <Dialog
        fullScreen
        open={this.props.openAddServiceDialog}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <AppBar position="relative">
          <Toolbar>
            <IconButton color="inherit" onClick={this.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Select Services
            </Typography>
          </Toolbar>
            <Tabs value={this.state.value} onChange={this.handleChange}>
            { serviceGroups
              && serviceGroups.map((group, index) => {
                const servicesByGroup = getServicesByGroup (byId, group)
                const groupId = group.id
                return <Tab key={index} value={index} label={group.name} />
              })
            }
            </Tabs>
          </AppBar>
        </DialogTitle>
        <div className={classes.dialogBody}>
          { serviceGroups
            && serviceGroups.map((group, index) => {
              const servicesByGroup = getServicesByGroup (byId, group)
              const groupId = group.id
              return this.state.value === index 
              && 
              <div key={index}>
                {servicesByGroup && servicesByGroup.map(service => 
                  (
                    <Button
                      key={service.id}
                      variant={selectedServiceIds.find(x => x === service.id)? 'outlined' : 'contained'}
                      color="secondary"
                      size="small"
                      className={classes.button}
                      onClick={() =>
                          this.handleAddServiceToCustomer(service.id)
                        }
                    >
                    <SvgIcon>
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/>
                    </SvgIcon>
                      {service.name + ' - ' + cents2Dollars(service.price)}
                    </Button>
                  )
                )}
              </div>
            })
          }
        </div>
      </Dialog>
    )
  }
}
const mapStateToProps = state => ({
  byId: state.services.byId,
  services: getServices(state),
  serviceGroups: getServiceGroups(state),  
  selectedServiceIds : getServiceIdsOfCustomer(state),
  openAddServiceDialog : (state.posScreen && state.posScreen.openAddServiceDialog)? true : false
})

export default connect(mapStateToProps)(withStyles(styles)(ServicesButtonDialog))