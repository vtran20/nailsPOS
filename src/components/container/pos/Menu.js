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
  Tooltip
} from '@material-ui/core'
import ScheduleAppointment from './ScheduleAppointment'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddCustomer from './AddCustomer'
import SearchCustomer from './SearchCustomer'



const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing.unit * 3,
    // overflowX: 'auto'
  },
  button: {
    margin: `${theme.spacing.unit}px 0`
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

  render() {

    const { 
      classes, 
      open,
      onViewSchedule
    } = this.props

    return (
      <div className={classes.root}>
      <Dialog
        open={open}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Menus'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
    <Grid container spacing={24}>
      <Grid
        item
        xs={6}
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
          <SvgIcon>
            <path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </SvgIcon>
          Appointment
        </Button>
        </Tooltip>  
      </Grid>
      <Grid
        item
        xs={6}
        // className={'flex-col-scroll'}
        // style={{ backgroundColor: 'lightblue' }}
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
          <SvgIcon>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </SvgIcon>
          AAAAAAAAAAAAAAAA
        </Button>
        </Tooltip>  
      </Grid>
    </Grid>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClose()} variant="contained" color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}
export default withStyles(styles)(Menu)
