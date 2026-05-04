import React, {Component} from 'react'
import {AppBar, Dialog, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles'
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
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    dialogBody: {
        padding: `0 ${theme.spacing.unit * 3}px`
    },
    // title: {
    //   margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`
    // }

})

class CustomerSearchDialog extends Component {

    onClose = () => {
        //call back to parent method
        if (typeof this.props.onCloseCustomerSearchDialog === 'function') {
            this.props.onCloseCustomerSearchDialog()
        }
    }

    handleSelectCustomer = () => {
        console.log("handleSelectCustomer")
        this.onClose()
        if (typeof this.props.onOpenScheduleDialog === 'function') {
            this.props.onOpenScheduleDialog()
        }
        // this.props.dispatch (updateCustomerForm({startDate: start, endDate: end, employeeId: slotId}))
        //this.setState({selectServicesDialog: true})
    }

    render() {
        const {classes, open} = this.props
        return (
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.onClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.onClose} aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Schedule Appointments
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <div className={classes.dialogBody}>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <Paper className={classes.paper}>
                                    <SearchCustomer className={classes.title} page='appointment'
                                                    onSelectCustomer={this.handleSelectCustomer}/>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.paper}>
                                    <AddCustomer className={classes.title} page='appointment'
                                                 onSelectCustomer={this.handleSelectCustomer} phone='required'/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(CustomerSearchDialog)
// const mapStateToProps = state => ({
//   byId: state.services.byId,
//   services: getServices(state),
//   serviceGroups: getServiceGroups(state),
//   selectedServiceIds : getServiceIdsOfCustomer(state),
//   customerForm: state.forms.customerForm
// })
// export default connect(mapStateToProps)(withStyles(styles)(CustomerSearchDialog))
