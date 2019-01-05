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
import { cents2Dollars, getServiceIdsOfCustomer } from '../../../utils'
import { addServiceToCustomer } from '../../../actions/services'


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


class ServicesButtonDialog extends Component {

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

  render() {
    const { classes, customerId } = this.props
    const selectedServiceIds = getServiceIdsOfCustomer (this.props.customers[customerId]? this.props.customers[customerId].customerServices: [], this.props.customerServices)

    return (
      <Dialog
        fullScreen
        open={this.props.openAddServiceDialog}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Please add services'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormGroup row>
              {this.props.servicesIds.map(serviceId => {
                let service = this.props.services[serviceId]
                return (
                  <Button
                    key={serviceId}
                    variant={selectedServiceIds.find(x => x === serviceId)? 'outlined' : 'contained'}
                    color="secondary"
                    size="small"
                    className={classes.button}
                    onClick={() =>
                        this.handleAddServiceToCustomer(serviceId)
                      }
                  >
                  <SvgIcon>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/>
                  </SvgIcon>
                    {service.name + ' - ' + cents2Dollars(service.price)}
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
  servicesIds: state.services.allIds,
  customers: state.customers.byId,
  services: state.services.byId,
  customerServices: state.customerServices.byId,
  openAddServiceDialog : (state.posScreen && state.posScreen.openAddServiceDialog)? true : false
})

export default connect(mapStateToProps)(withStyles(styles)(ServicesButtonDialog))