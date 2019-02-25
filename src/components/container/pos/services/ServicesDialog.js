import React, { Component, Fragment  } from 'react'
import { Field, reduxForm } from 'redux-form'

import {
  Button,
  Dialog,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  TextField,
  InputAdornment,
  MenuItem
} from '@material-ui/core'

import { Edit, Delete, Add } from '@material-ui/icons'

import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles'
import {editService, editServiceClear, createService, updatingService, deleteService} from '../../../../actions/services'
import { connect } from 'react-redux'
import { getServices, getServiceGroups } from '../../../../selectors'
import { cents2Fixed2, dollars2Cents, renderSelectField, renderTextField, renderPriceTextField, getServicesByGroup } from '../../../../utils'
import { updatePOSScreen } from '../../../../actions'


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
    margin: `0 ${theme.spacing.unit}px 0 0`
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
    margin: `${theme.spacing.unit * 2}px 0 0`
  },
  paper: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
    padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    height: 550,
    overflowY: 'auto'

  },
  appBar: {
    position: 'relative',
  },
  subList: {
    margin: `0 0 0 ${theme.spacing.unit * 3}px`
  },
  flex: {
    flex: 1,
  },
  dialogBody: {
    padding: `0 ${theme.spacing.unit * 3}px`
  }
})
const validate = values => {
  const errors = {}
  const requiredFields = [
    'name',
    'price',
    'minutes',
    'groupId',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  // if (!values.email) {
  //   errors.email = 'Required'
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }

  if (values.minutes) {
    if (isNaN(Number(values.minutes))) {
      errors.minutes = 'Must be a number'
    } else if (Number(values.minutes) < 0) {
      errors.minutes = 'Sorry, minutes must be greater than zero'
    } else if (Number(values.minutes)%15 !== 0) {
      errors.minutes = 'Sorry, minutes need to round up interval time 15 minutes. Ex: 15, 30, 45, 60'
    }
  }

  if (values.price) {
    if (isNaN(Number(values.price))) {
      errors.price = 'Must be a number'
    } else if (Number(values.price) < 0) {
      errors.price = 'Sorry, the price must be greater than zero'
    }
  }

  return errors
}

class ServicesDialog extends Component {

  // handleChange = name => ({ target: { value } }) => {
  // }
  
  handleSubmit = (values) => {
    if (this.props.initialValues.id) {
      const data = {...this.props.formData, price: dollars2Cents(this.props.formData.price), id: this.props.initialValues.id}
      const oldGroupId = this.props.initialValues.groupId
      this.props.dispatch(updatingService(data, oldGroupId))
    } else {
      const data = {...this.props.formData, price: dollars2Cents(this.props.formData.price)}
      this.props.dispatch(createService(data))
    }
  }

  onClose = () => {
    //call back to parent method
    this.props.dispatch(updatePOSScreen({ servicesDialog: false}))
  }

  onSelect = () => {
    //call back to parent method
  }

  onSelectEdit = (service) => {
    this.props.dispatch(editService(service))
  }

  onDelete = (serviceId) => {
    this.props.dispatch(deleteService(serviceId))
  }

  onAddnew = () => {
    this.props.dispatch(editServiceClear())
  }

  handleUpdateService = () => {
    
  }
  render() {
    const { 
      classes, open, byId, services, serviceGroups, 
      name, price, minutes, isNewService, pristine, submitting, formData, handleSubmit, reset, valid } = this.props
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
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Services
            </Typography>
            <Fab color="secondary" aria-label="Add" className={classes.fab} size="small" onClick={() => this.onAddnew()}>
              <Add />
            </Fab>
          </Toolbar>
        </AppBar>

        <div className={classes.dialogBody}>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  {
                    serviceGroups
                    ? (
                        serviceGroups.map(group => {
                          const servicesByGroup = getServicesByGroup (byId, group)
                          return (
                          <List component="ul" key={group.id}>
                            <ListItem button onClick={() => this.onSelect(group.id)}>
                              <ListItemText primary={group.name} />
                            {/*
                              <ListItemSecondaryAction>
                                <IconButton onClick={() => this.onSelectEdit(group)}>
                                  <Edit />
                                </IconButton>
                                <IconButton onClick={() => this.onDelete(group.id)}>
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            */}
                            </ListItem>
                            {
                              servicesByGroup && servicesByGroup.length > 0
                              ? (
                                <List component="ul" key={group.id} className={classes.subList}>
                                  {servicesByGroup.map(service => (
                                    <ListItem key={service.id} button onClick={() => this.onSelect(service.id)}>
                                      <ListItemText primary={service.name} />
                                      <ListItemSecondaryAction>
                                        <IconButton onClick={() => this.onSelectEdit(service)}>
                                          <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => this.onDelete(service.id)}>
                                          <Delete />
                                        </IconButton>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                  ))}
                                </List>
                                )
                              : null
                            }
                          </List>
                        )}
                        )
                      ) 
                    : null
                  }
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                      <Typography variant="h6" className={classes.title}>
                        {isNewService? 'New Service' : 'Update Service'}
                      </Typography>
                        <form onSubmit={handleSubmit(val => this.handleSubmit(val))}>
                        <div>
                          <Field 
                          name="name" 
                          component={renderTextField}
                          label="Name"
                          />
                        </div>
                        <div>
                          <Field 
                          name="price" 
                          component={renderPriceTextField}
                          label="Price"
                          />
                        </div>
                        <div>
                          <Field 
                          name="minutes" 
                          component={renderTextField}
                          label="Minutes"
                          />
                        </div>
                        <div>
                          <Field
                            name="groupId"
                            component={renderSelectField}
                            label="Service Group"
                          >
                            <MenuItem value="">----</MenuItem>
                            {
                              serviceGroups && serviceGroups.map (group =>(
                                <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                                )
                              )
                            }
                          </Field>
                        </div>

                          <br />
                            {isNewService
                              ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                  type="submit"
                                  disabled={!valid || pristine || submitting}
                                >
                                  Add
                                </Button>
                                ) 
                              : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                  type="submit"
                                  disabled={!valid || pristine || submitting}
                                >
                                  Update
                                </Button>
                                )
                            }
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  className={classes.button}
                                  type="button"
                                  disabled={pristine || submitting} onClick={reset}
                                >
                                  Reset
                                </Button>

                        </form>
                </Paper>
              </Grid>
            </Grid>
        </div>
      </Dialog>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  byId: state.services.byId,
  services: getServices(state),
  serviceGroups: getServiceGroups(state),
  isNewService : state.services.edit.id? false : true,
  name: state.services.edit.name,
  price: state.services.edit.price,
  minutes: state.services.edit.minutes,
  initialValues: state.services.edit? {...state.services.edit, price: state.services.edit.price
                                                                      ? cents2Fixed2(state.services.edit.price)
                                                                      : null
                                      } 
                                    : null,
  formData : state.form.serviceForm && state.form.serviceForm.values? state.form.serviceForm.values : {},
  serviceForm : state.form.serviceForm
})

// Decorate with redux-form
ServicesDialog = reduxForm({
  form: 'serviceForm',
  enableReinitialize : true,
  validate
})(ServicesDialog)

export default connect(mapStateToProps)(withStyles(styles)(ServicesDialog))
