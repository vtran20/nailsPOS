import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'
import {
  addCustomerServiceForm,
  createNewCustomerServiceForCheckIn,
  makeAppointment
} from '../../../actions/forms'

class ServicesDialog extends Component {
  state = {}
  baseState = {}

  handleSelectServices = name => event => {
    this.setState({ [name]: event.target.checked })
    this.baseState = { ...this.baseState, [name]: '' }
  }

  //////////////////////Start Self CheckIn////////////////////////
  handleSubmitServices = () => {
    //call back to parent method
    this.props.dispatch(addCustomerServiceForm(this.state))
    this.props.dispatch(createNewCustomerServiceForCheckIn())

    //reset state
    this.setState(this.baseState)

    if (typeof this.props.onSubmitServices === 'function') {
      this.props.onSubmitServices()
    }
  }

  handleSkipServices = () => {
    this.props.dispatch(createNewCustomerServiceForCheckIn())
    //reset state
    this.setState(this.baseState)
    //call back to parent method
    if (typeof this.props.onSkipServices === 'function') {
      this.props.onSkipServices()
    }
  }
  //////////////////////End Self CheckIn////////////////////////

  ///////////////////////Start for POS///////////////////////
  handleMakeAppointment = () => {
    const servicesIds = Object.keys(this.state).filter(key => this.state[key])
    this.props.dispatch(makeAppointment(servicesIds))
    this.onClose()

  }

  onClose = () => {
    //reset state
    this.setState(this.baseState)
    //TODO: let parent clear this form if need
    //this.props.dispatch(clearCustomerForm())

    //call back to parent method
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  // handleCloseServices = () => {
  //   //call back to parent method
  //   if (typeof this.props.onSkipServices === 'function') {
  //     this.props.onSkipServices()
  //   }
  // }
  ///////////////////////End for POS///////////////////////

  render() {
    const { fullScreen, open, page } = this.props
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Please select your services'}
        </DialogTitle>
        <DialogContent>
          <FormGroup row>
            {this.props.servicesIds.map(serviceId => {
              let service = this.props.services[serviceId]
              return (
                <FormControlLabel
                  key={serviceId}
                  control={
                    <Checkbox
                      checked={this.state.serviceId}
                      onChange={this.handleSelectServices(serviceId)}
                      value={`${serviceId}`}
                    />
                  }
                  label={service.name}
                />
              )
            })}
          </FormGroup>
        </DialogContent>
        {page === 'appointment'
          ? (
        <DialogActions>
              <Button
                onClick={() => this.handleMakeAppointment()}
                variant="contained"
                color="primary"
              >
                Make Appointment
              </Button>
              <Button
                onClick={() => this.onClose()}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
        </DialogActions>
            )
          : (
        <DialogActions>
              <Button
                onClick={() => this.handleSubmitServices()}
                variant="contained"
                color="primary"
              >
                Save Services
              </Button>
              <Button
                onClick={() => this.handleSkipServices()}
                variant="contained"
                color="secondary"
              >
                Skip
              </Button>
        </DialogActions>
            )
        }
      </Dialog>
    )
  }
}
const mapStateToProps = state => ({
  servicesIds: state.services.allIds,
  services: state.services.byId,
  customerForm: state.forms.customerForm,
  customerServices: state.customerServices.byId
})
export default connect(mapStateToProps)(ServicesDialog)
