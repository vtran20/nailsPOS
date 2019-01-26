import React, { Component } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormGroup,
  Grid,
  Paper,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import ScheduleAppointment from './ScheduleAppointment'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import SearchCustomer from './SearchCustomer'
import { connect } from 'react-redux'
import { updatePOSScreen } from '../../../actions'



const styles = theme => ({
  // root: {
  //   // width: '100%',
  //   // marginTop: theme.spacing.unit * 3,
  //   // overflowX: 'auto'
  // },
  button: {
    margin: `${theme.spacing.unit}px 0`,
    // padding: `0 0 0 ${theme.spacing.unit}px`
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
  title: {
    margin: `${theme.spacing.unit * 4}px 100px ${theme.spacing.unit * 2}px`
  },
  svgIcon : {
    marginRight: `${theme.spacing.unit}px`
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  dialogBody: {
    padding: `0 ${theme.spacing.unit * 3}px`
  }
})

class Menu extends Component {
  
  onClose = () => {
    if (typeof this.props.closeMenu === 'function') {
      this.props.closeMenu()
    }
  }
  
  handleViewSchedule = () => {
    if (typeof this.props.onViewSchedule === 'function') {
      this.props.onViewSchedule()
    }
    this.onClose()
  }

  handleNewServices = () => {
    this.props.dispatch(updatePOSScreen({ servicesDialog: true}))
    this.onClose()
  }

  handleNewEmployees = () => {
    this.props.dispatch(updatePOSScreen({ employeesDialog: true}))
    this.onClose()
  }

  handleOpenSelectStore = () => {
    this.props.dispatch(updatePOSScreen({ selectStoreDialog: true}))
    this.onClose()
  }

  render() {

    const { 
      classes, 
      open,
      onViewSchedule
    } = this.props
    
    return (
      <div className={classes.root}>
      <Dialog
        fullScreen
        open={open}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Toolbar>
            <IconButton color="inherit" onClick={this.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Menu
            </Typography>
          </Toolbar>
        </DialogTitle>
        <div className={classes.dialogBody}>
          <Grid container spacing={24}>
            <Grid
              item
              xs={3}
              // className={'flex-col-scroll'}
              // style={{ backgroundColor: 'pink' }}
            >
            <Tooltip disableFocusListener title="View Appointments">
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.button}
                onClick={() =>
                  this.handleViewSchedule()
                }
              >
                <SvgIcon className={classes.svgIcon}>
                  <path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </SvgIcon>
                Appointment
              </Button>
              </Tooltip>  
            </Grid>
            <Grid
              item
              xs={3}
              // className={'flex-col-scroll'}
              // style={{ backgroundColor: 'lightblue' }}
            >
            <Tooltip disableFocusListener title="Add Services">
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.button}
                onClick={() =>
                  this.handleNewServices()
                }
              >
                <SvgIcon className={classes.svgIcon}>
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/><path d="M0 0h24v24H0z" fill="none"/>
                </SvgIcon>
                Services
              </Button>
              </Tooltip>  
            </Grid>
            <Grid
              item
              xs={3}
              // className={'flex-col-scroll'}
              // style={{ backgroundColor: 'lightblue' }}
            >
            <Tooltip disableFocusListener title="Add Employees">
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.button}
                onClick={() =>
                  this.handleNewEmployees()
                }
              >
                <SvgIcon className={classes.svgIcon}>
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/><path d="M0 0h24v24H0z" fill="none"/>
                </SvgIcon>
                Employees
              </Button>
              </Tooltip>  
            </Grid>
            <Grid
              item
              xs={3}
              // className={'flex-col-scroll'}
              // style={{ backgroundColor: 'lightblue' }}
            >
            </Grid>
            <Grid
              item
              xs={3}
              // className={'flex-col-scroll'}
              // style={{ backgroundColor: 'lightblue' }}
            >
            <Tooltip disableFocusListener title="Select Store">
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className={classes.button}
                onClick={() =>
                  this.handleOpenSelectStore()
                }
              >
                <SvgIcon className={classes.svgIcon}>
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/><path d="M0 0h24v24H0z" fill="none"/>
                </SvgIcon>
                Select Store
              </Button>
              </Tooltip>  
            </Grid>
          </Grid>
        </div>
      </Dialog>
      </div>
    )
  }
}
export default connect()(withStyles(styles)(Menu))
