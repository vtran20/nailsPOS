import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  Divider,
  IconButton,
  Badge,
  Button,
  Snackbar,
  Hidden
} from '@material-ui/core'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddIcon from '@material-ui/icons/Add'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import CustomerDetail from './pos/CustomerDetail'
import AddCustomer from './pos/AddCustomer'
import SearchCustomer from './pos/SearchCustomer'
import ServiceList from './pos/ServiceList'
import EmployeeList from './pos/EmployeeList'
import CustomerList from './pos/CustomerList'
import ServicesButtonDialog from './pos/ServicesButtonDialog'
import EmployeesButtonDialog from './pos/EmployeesButtonDialog'
import ScheduleDialog from './pos/ScheduleDialog'
import ServicesDialog from './pos/services/ServicesDialog'
import EmployeesDialog from './pos/employees/EmployeesDialog'
import Payment from './pos/Payment'
import Menu from './pos/Menu'
import CustomerSearchDialog from './pos/CustomerSearchDialog'
import { selectAddCustomer, clearGlobalError, clearGlobalMessage, updatePOSScreen} from '../../actions'
import Messages from './common/Messages'
import { clearCustomerSearchs } from '../../actions/customerSearch'
import { getStore } from '../../selectors'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    //paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% )`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    height: 600,
    overflowY: 'auto'

  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '94vh',
    overflow: 'auto'
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
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

class DashboardPOS extends React.Component {
 
  handleAddCustomer = (data) => {
    this.props.dispatch(selectAddCustomer(data))
  }

  handleScheduleOpen = () => {
    this.props.dispatch(updatePOSScreen({ scheduleOpenDialog: true}))
  }

  handleScheduleClose = () => {
    this.props.dispatch(updatePOSScreen({ scheduleOpenDialog: false}))
  }

  handleCustomerSearchOpen = () => {
    this.props.dispatch(updatePOSScreen({ customerSearchDialog: true }))
  }

  handleCustomerSearchDialogClose = () => {
    this.props.dispatch(updatePOSScreen({ customerSearchDialog: false }))
    // Clear customer search result if any
    this.props.dispatch(clearCustomerSearchs())   
  }

  handleMenuOpen = () => {
    this.props.dispatch(updatePOSScreen({ menuOpenDialog: true }))
  }

  handleMenuClose = () => {
    this.props.dispatch(updatePOSScreen({ menuOpenDialog: false }))
  }

  handleCloseError = (event, reason) => {
    this.props.dispatch(clearGlobalError())
  }
  handleCloseMessage = (event, reason) => {
    this.props.dispatch(clearGlobalMessage())
  }

  renderSwitch(param) {
    switch (param) {
      case 'CUSTOMER_DETAIL':
        return (<CustomerDetail />)
      case 'ADD_CUSTOMER':
        return (<AddCustomer/>)
      case 'SEARCH_CUSTOMER':
        return (<SearchCustomer/>)
      case 'PAYMENT_CUSTOMER':
        return (<Payment />)
      default:
        return ''
    }
  }
  render() {
    const { classes, screen, customerId, store, errors, messages, scheduleOpenDialog, menuOpenDialog, customerSearchDialog, servicesDialog, employeesDialog } = this.props
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Menu 
        open={menuOpenDialog} 
        closeMenu={this.handleMenuClose}
        onViewSchedule={this.handleScheduleOpen}
        />
        <ServicesButtonDialog customerId={customerId}/>
        <EmployeesButtonDialog customerId={customerId}/>
        <ScheduleDialog open={scheduleOpenDialog} onCloseScheduleDialog={this.handleScheduleClose} onOpenSelectCustomerDialog={this.handleCustomerSearchOpen}/>
        <CustomerSearchDialog open={customerSearchDialog} onCloseCustomerSearchDialog={this.handleCustomerSearchDialogClose} onOpenScheduleDialog={this.handleScheduleOpen}/>
        <ServicesDialog open={servicesDialog}/>
        <EmployeesDialog open={employeesDialog}/>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, classes.appBarShift)}
        >
          <Toolbar
            disableGutters={!false}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Other functions"
              onClick={this.handleMenuOpen}
              className={classNames(classes.menuButton)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {store? store.name : ''}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className={classes.button}
              onClick={() =>
                  this.handleAddCustomer({
                    screen: 'SEARCH_CUSTOMER'
                  })
                }
            >
            <SvgIcon>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </SvgIcon>
              Customer
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className={classes.button}
              onClick={() =>
                  this.handleAddCustomer({
                    screen: 'ADD_CUSTOMER'
                  })
                }
            >
              <AddIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Customer
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className={classes.button}
              onClick={() => this.handleCustomerSearchOpen()}
            >
              <AddIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Appointment
            </Button>
            {
              /*
            <IconButton color="inherit">
              <Badge badgeContent={6} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
              */
            }
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
          open={true}
        >
          <div className={classes.appBarSpacer} />
          <Divider />
          <List>{<CustomerList title="Customers" />}</List>
          <Divider />
          <List>{<CustomerList title="Scheduled" status="SCHEDULED" />}</List>
          <Divider />
          <List>{<CustomerList title="Completed" status="COMPLETED" />}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {screen? this.renderSwitch(screen) : ''}

          {/*Error messages*/}
            {errors.map((error, index) => 
              <Snackbar
                  key={index}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  open={true}
                  onClose={this.handleCloseError}
                  // autoHideDuration={6000}
                >
                  <Messages
                      onClose={this.handleCloseError}
                      variant="error"
                      message={error}
                    />
              </Snackbar>
            )}

            {/*message*/}
            {messages.map((message, index) => 
              <Snackbar
                  key={index}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  open={true}
                  onClose={this.handleCloseMessage}
                  autoHideDuration={6000}
               >
                  <Messages
                      onClose={this.handleCloseMessage}
                      variant="success"
                      message={message}
                    />
              </Snackbar>
            )}
        </main>

{/*
        <Hidden mdDown>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper
            )
          }}
          open={true}
        >
          <div className={classes.appBarSpacer} />

          <Divider />
          <List>{<ServiceList />}</List>
          <Divider />
          <List>{<EmployeeList />}</List>
        </Drawer>
        </Hidden>
*/}
      </div>
    )
  }
}

DashboardPOS.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  screen: state.posScreen && state.posScreen.screen? state.posScreen.screen : null,
  customerId : state.posScreen && state.posScreen.customerId? state.posScreen.customerId : 0,
  scheduleOpenDialog : state.posScreen && state.posScreen.scheduleOpenDialog? state.posScreen.scheduleOpenDialog : false,
  menuOpenDialog : state.posScreen && state.posScreen.menuOpenDialog? state.posScreen.menuOpenDialog : false,
  customerSearchDialog : state.posScreen && state.posScreen.customerSearchDialog? state.posScreen.customerSearchDialog : false,
  servicesDialog : state.posScreen && state.posScreen.servicesDialog? state.posScreen.servicesDialog : false,
  employeesDialog : state.posScreen && state.posScreen.employeesDialog? state.posScreen.employeesDialog : false,
  store: getStore(state),
  errors: state.errors,
  messages: state.messages
})

export default connect(mapStateToProps)(withStyles(styles)(DashboardPOS))
