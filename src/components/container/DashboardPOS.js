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
  Button
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
import Payment from './pos/Payment'
import { selectAddCustomer } from '../../actions'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
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
    })
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
    height: '100vh',
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
  state = {
    open: true
  }

 
  handleAddCustomer = (data) => {
    this.props.dispatch(selectAddCustomer(data))
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
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
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, classes.appBarShift)}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <IconButton
              color="inherit"
              aria-label="Other functions"
              onClick={this.handleDrawerOpen}
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
              {this.props.store? this.props.store.name : ''}
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
            >
              <AddIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              Appointment
            </Button>
            <IconButton color="inherit">
              <Badge badgeContent={6} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          <div className={classes.appBarSpacer} />
          <Divider />
          <List>{<CustomerList title="Customers" />}</List>
          <Divider />
          <List>{<CustomerList title="Scheduled" status="SCHEDULED" />}</List>
          <Divider />
          <List>{<CustomerList title="Completed" status="COMPLETED" />}</List>
          <Divider />
          <List>{/*<CustomerAppointmentList />*/}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {this.props.screen? this.renderSwitch(this.props.screen.screen) : ''}
        </main>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          <div className={classes.appBarSpacer} />

          <Divider />
          <List>{<ServiceList />}</List>
          <Divider />
          <List>{<EmployeeList />}</List>
        </Drawer>
      </div>
    )
  }
}

DashboardPOS.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  screen: state.posScreen,
  store: state.stores.byId[state.stores.currentStoreId]
})

export default connect(mapStateToProps)(withStyles(styles)(DashboardPOS))
