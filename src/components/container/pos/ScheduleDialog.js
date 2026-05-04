import React from 'react';
import { Dialog, DialogTitle, IconButton, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ScheduleAppointment from './ScheduleAppointment';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { clearCustomerForm } from '../../../actions/forms';
import { clearCustomerSearchs } from '../../../actions/customerSearch';

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
});

const ScheduleDialog = ({ classes, open, dispatch, onCloseScheduleDialog, onOpenSelectCustomerDialog }) => {
  const onClose = () => {
    dispatch(clearCustomerForm());
    dispatch(clearCustomerSearchs());

    // call back to parent method
    if (typeof onCloseScheduleDialog === 'function') {
      onCloseScheduleDialog();
    }
  };

  const handleOpenSelectCustomerDialog = () => {
    // call back to parent method
    if (typeof onOpenSelectCustomerDialog === 'function') {
      onOpenSelectCustomerDialog();
    }
  };

  return (
      <div>
        <Dialog fullScreen open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">
            <Toolbar>
              <IconButton color="inherit" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Schedule Appointments
              </Typography>
            </Toolbar>
          </DialogTitle>
          <div className={classes.dialogBody}>
            <ScheduleAppointment onOpenSelectCustomerDialog={handleOpenSelectCustomerDialog}/>
          </div>
        </Dialog>
      </div>
  );
};

export default connect()(withStyles(styles)(ScheduleDialog));
