import React from 'react'
import { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { AddIcon } from '@material-ui/icons'
import Background from '../../assets/img/photographer.jpg'
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import CustomerForm from './forms/CustomerForm'
import ServicesDialog from './checkin/ServicesDialog'
import FindYourAccount from './checkin/FindYourAccount'
import ScheduledAppointment from './checkin/ScheduledAppointment'
import SelectStoreDialog from '../common/SelectStoreDialog'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class DashboardCheckIn extends React.Component {
  state = {
    isNewCustomerDialog: false,
    createNewCustomerDialog: false,
    addCustomerServiceDialog: false,
    selectServicesDialog: false,
    thankyouCheckInDialog: false,

    registeredDialog: false,
    scheduleApptListDialog: false,
    findYourAccountDialog: false
  }

  //For check in screen
  handleClickCheckIn = () => {
    this.setState({ ...this.state, isNewCustomerDialog: true })
  }

  handleCloseCheckIn = () => {
    this.setState({ ...this.state, isNewCustomerDialog: false })
  }

  //For click Create New Customer
  handleClickCreateNewCustomer = () => {
    this.setState({
      ...this.state,
      createNewCustomerDialog: true,
      isNewCustomerDialog: false,
      scheduleApptListDialog: false,
      findYourAccountDialog: false
    })
  }

  handleRegistered = () => {
    this.setState({
      ...this.state,
      registeredDialog: true,
      isNewCustomerDialog: false
    })
  }

  handleCloseCreateNewCustomer = () => {
    this.setState({ ...this.state, createNewCustomerDialog: false })
  }

  handleSubmitCreateNewCustomer = () => {
    this.setState({
      ...this.state,
      selectServicesDialog: true,
      addCustomerServiceDialog: false,
      createNewCustomerDialog: false,
      isNewCustomerDialog: false
    })
  }

  /*For customer services dialog */
  handleCloseServices = () => {
    this.setState({ ...this.state, selectServicesDialog: false })
  }

  handleSelectServices = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleSubmitServices = () => {
    this.setState({
      ...this.state,
      thankyouCheckInDialog: true,
      selectServicesDialog: false,
      addCustomerServiceDialog: false,
      createNewCustomerDialog: false,
      isNewCustomerDialog: false
    })
  }

  handleSkipServices = () => {
    this.setState({
      ...this.state,
      thankyouCheckInDialog: true,
      selectServicesDialog: false,
      addCustomerServiceDialog: false,
      createNewCustomerDialog: false,
      isNewCustomerDialog: false
    })
  }
  //For thank you dialog
  handleCloseThankYou = () => {
    this.setState({ ...this.state, thankyouCheckInDialog: false })
  }

  //For Registered Dialog
  handleCloseRegistered = () => {
    this.setState({ ...this.state, registeredDialog: false })
  }

  handleScheduledAppointment = () => {
    this.setState({
      ...this.state,
      scheduleApptListDialog: true,
      registeredDialog: false
    })
  }
  handleCloseAppointment = () => {
    this.setState({
      ...this.state,
      scheduleApptListDialog: false,
      registeredDialog: false
    })
  }
  handleFoundAppointment = () => {
    this.setState({
      ...this.state,
      thankyouCheckInDialog: true,
      selectServicesDialog: false,
      scheduleApptListDialog: false
    })
  }

  handleClickFindYourAccount = () => {
    this.setState({
      ...this.state,
      findYourAccountDialog: true,
      registeredDialog: false,
      scheduleApptListDialog: false
    })
  }
  //handle Close Find Your Account
  handleCloseFindYourAccount = () => {
    this.setState({ ...this.state, findYourAccountDialog: false })
  }

  handleFoundCustomer = () => {
    this.setState({
      ...this.state,
      selectServicesDialog: true,
      findYourAccountDialog: false
    })
  }

  render() {
    const { classes } = this.props
    const { fullScreen } = this.props
    const background = {
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      overflow: 'hidden'
    }
    return (
      <Fragment>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ ...background, minHeight: '100vh' }}
        >
          <Grid item xs={3}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={this.handleClickCheckIn}
              style={{
                maxWidth: '200px',
                maxHeight: '50px',
                minWidth: '150px',
                minHeight: '50px'
              }}
            >
              Check In
            </Button>
            {/*Select store if need*/}

            {this.props.fetching ? '' : <SelectStore />}

            {/*Are you new customer dialog */}
            <Dialog
              fullScreen={fullScreen}
              open={this.state.isNewCustomerDialog}
              onClose={this.handleCloseCheckIn}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {'Are you a new customer?'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleClickCreateNewCustomer}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  New Customer
                </Button>
                <Button
                  onClick={this.handleRegistered}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Registered
                </Button>
              </DialogActions>
            </Dialog>
            {/* This dialog for creating a new customer */}
            <Dialog
              open={this.state.createNewCustomerDialog}
              onClose={this.handleCloseCreateNewCustomer}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>Create a New Customer</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please fill out the form below.
                </DialogContentText>
                <CustomerForm onSubmit={this.handleSubmitCreateNewCustomer} />
              </DialogContent>
            </Dialog>

            {/* This dialog for customer select services*/}
            <ServicesDialog
              open={this.state.selectServicesDialog}
              onClose={this.handleCloseServices}
              fullScreen={fullScreen}
              onSubmitServices={this.handleSubmitServices}
              onSkipServices={this.handleSkipServices}
            />
            {/* This dialog at the end of checkin*/}
            <Dialog
              fullScreen={fullScreen}
              open={this.state.thankyouCheckInDialog}
              onClose={this.handleCloseThankYou}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent>
                <DialogContentText>
                  Thank you and have a great day.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCloseThankYou}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* This dialog when customer click Registered */}
            <Dialog
              fullScreen={fullScreen}
              open={this.state.registeredDialog}
              onClose={this.handleCloseRegistered}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {'Did you scheduled apointment?'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText />
              </DialogContent>
              <DialogActions>
                {' '}
                <Button
                  onClick={this.handleClickFindYourAccount}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Find Your Account
                </Button>
                <Button
                  onClick={this.handleScheduledAppointment}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Scheduled Appointment
                </Button>
              </DialogActions>
            </Dialog>

            {/*Scheduled Appointment*/}

            <ScheduledAppointment
              open={this.state.scheduleApptListDialog}
              onClose={this.handleCloseAppointment}
              onSelectSchedule={this.handleFoundAppointment}
              fullScreen={fullScreen}
              onSelectFindYourAccount={this.handleClickFindYourAccount}
              onSelectCreateNewCustomer={this.handleClickCreateNewCustomer}
            />

            {/* This is a serarch customer form */}
            <FindYourAccount
              open={this.state.findYourAccountDialog}
              onClose={this.handleCloseFindYourAccount}
              onSelectCustomer={this.handleFoundCustomer}
              fullScreen={fullScreen}
              onSelectCreateNewCustomer={this.handleClickCreateNewCustomer}
            />
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

// DashboardCheckIn.propTypes = {
//   classes: PropTypes.object.isRequired
// }
const mapStateToProps = state => ({
  fetching: state.fetching
})

export default connect(mapStateToProps)(withStyles(styles)(DashboardCheckIn))
