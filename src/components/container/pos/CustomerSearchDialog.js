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
  Paper
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddCustomer from './AddCustomer'
import SearchCustomer from './SearchCustomer'



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
  }
})

class CustomerSearchDialog extends Component {
  
  onClose = () => {
    //call back to parent method
     if (typeof this.props.onCloseCustomerSearchDialog === 'function') {
       this.props.onCloseCustomerSearchDialog()
     }
  }

  handleSelectCustomer = () => {
    this.onClose()
     if (typeof this.props.onOpenScheduleDialog === 'function') {
       this.props.onOpenScheduleDialog()
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
          {'Schedule Appointments'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <SearchCustomer className={classes.title} page='appointment' onSelectCustomer={this.handleSelectCustomer}/>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <AddCustomer className={classes.title} page='appointment' onSelectCustomer={this.handleSelectCustomer}/>
                  </Paper>
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
export default withStyles(styles)(CustomerSearchDialog)
