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
  Checkbox,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,TabContainer
} from '@material-ui/core'
import { Edit, Delete, Add } from '@material-ui/icons'
import CloseIcon from '@material-ui/icons/Close';
import {
  addCustomerServiceForm,
  createNewCustomerServiceForCheckIn,
  makeAppointment
} from '../../../actions/forms'
import { getServiceIdsOfCustomer, getServices, getServicesByGroup, getServiceGroups } from '../../../selectors'
import SvgIcon from '@material-ui/core/SvgIcon'
import { cents2Dollars } from '../../../utils'
import { withStyles } from '@material-ui/core/styles'

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

class ServicesDialog extends Component {
  state = {
    value: 0
  }
  baseState = {value: 0}

  handleSelectServices = name => event => {
    this.setState({ [name]: event.target.checked })
    this.baseState = { ...this.baseState, [name]: '' }
  }

  handleChange = (event, newValue) => {
    this.setState({value: newValue})

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
    const { classes, fullScreen, open, page, services, selectedServiceIds, serviceGroups, byId } = this.props
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
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
            <FormGroup row key={groupId}>
            {servicesByGroup && servicesByGroup.map(service => {
              return (
                <FormControlLabel
                  key={service.id}
                  control={
                    <Checkbox
                      checked={this.state.serviceId}
                      onChange={this.handleSelectServices(service.id)}
                      value={`${service.id}`}
                    />
                  }
                  label={service.name}
                />
              )
            })}
          </FormGroup>
            })
          }
        </div>
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
  byId: state.services.byId,
  services: getServices(state),
  serviceGroups: getServiceGroups(state),  
  selectedServiceIds : getServiceIdsOfCustomer(state),
  customerForm: state.forms.customerForm
})
export default connect(mapStateToProps)(withStyles(styles)(ServicesDialog))
