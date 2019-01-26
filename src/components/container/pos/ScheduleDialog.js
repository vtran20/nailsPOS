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
import { clearCustomerForm } from '../../../actions/forms'
import { clearCustomerSearchs } from '../../../actions/customerSearch'


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
  title: {
    margin: `${theme.spacing.unit * 4}px 100px ${theme.spacing.unit * 2}px`
  },
  paper: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
    padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  dialogBody: {
    //padding: `0 ${theme.spacing.unit * 3}px`,
     color: 'white'
  }

})

class ScheduleDialog extends Component {
  
  onClose = () => {
    this.props.dispatch(clearCustomerForm())
    this.props.dispatch(clearCustomerSearchs())   

    //call back to parent method
     if (typeof this.props.onCloseScheduleDialog === 'function') {
       this.props.onCloseScheduleDialog()
     }
  }
  handleOpenSelectCustomerDialog = () => {
    //call back to parent method
     if (typeof this.props.onOpenSelectCustomerDialog === 'function') {
       this.props.onOpenSelectCustomerDialog()
     }
  }

  render() {
    const { classes, open } = this.props
    return (
      <div>
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
              Schedule Appointments
            </Typography>
          </Toolbar>
        </DialogTitle>
        <div className={classes.dialogBody}>
          <ScheduleAppointment onOpenSelectCustomerDialog={this.handleOpenSelectCustomerDialog}/>
        </div>
      </Dialog>
      </div>
    )
  }
}
export default connect()(withStyles(styles)(ScheduleDialog))
