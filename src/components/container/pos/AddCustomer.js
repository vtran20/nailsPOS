import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'
import {
  searchCustomers,
  clearCustomerSearchs
} from '../../../actions/customerSearch'
import { connect } from 'react-redux'
import CustomerForm from '../forms/CustomerForm'
import { changePOSScreen } from '../../../actions'
import {
  addCustomerServiceForm,
  createNewCustomerServiceForCheckIn
  } from '../../../actions/forms'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    padding: `0 ${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
})

class AddCustomer extends React.Component {

handleSubmitCustomerForm = () => {
  //call back to parent method, this will save information to store.forms
  if (typeof this.props.onSubmit === 'function') {
    this.props.onSubmit()
  }
  //Create new customer service for for checkin and clear forms after that.
  this.props.dispatch(createNewCustomerServiceForCheckIn())

}

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.title}>
              Create New Customer
            </Typography>
            <div className={classes.demo}>
              <CustomerForm onSubmit={this.handleSubmitCustomerForm}/>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

AddCustomer.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  customersIds: state.customers.allIds,
  customers: state.customers.byId
})
export default connect(mapStateToProps)(withStyles(styles)(AddCustomer))

