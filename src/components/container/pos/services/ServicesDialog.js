import React, { Component } from 'react'
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
  InputAdornment
} from '@material-ui/core'

import { Edit, Delete, Add } from '@material-ui/icons'

import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles'
import {editService, editServiceClear, createService, updatingService, deleteService} from '../../../../actions/services'
import { connect } from 'react-redux'
import { getServices } from '../../../../selectors'
import { cents2Fixed2, dollars2Cents } from '../../../../utils'
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
    'minutes'
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

const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    // placeholder={label}
    variant="outlined"
    margin="normal"
    error={touched && invalid}
    helperText={touched && error}
    fullWidth
    InputLabelProps={{
      shrink: true,
    }}    
    {...input}
    {...custom}
  />
)

const renderPriceTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    // placeholder={label}
    variant="outlined"
    margin="normal"
    error={touched && invalid}
    helperText={touched && error}
    fullWidth
    InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}    
    {...input}
    {...custom}
  />
)


const renderInput = field =>   // Define stateless component to render input and errors
  <div>
    <input {...field.input} type={field.type}/> 
    {field.meta.touched &&
     field.meta.error &&
     <span className="error">{field.meta.error}</span>}
  </div>

class ServicesDialog extends Component {

  // handleChange = name => ({ target: { value } }) => {
  // }
  
  handleSubmit = (values) => {
    if (this.props.initialValues.id) {
      const data = {...this.props.formData, price: dollars2Cents(this.props.formData.price), id: this.props.initialValues.id}
      this.props.dispatch(updatingService(data))
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
    const { classes, open, services, name, price, minutes, isNewService, pristine, submitting, formData, handleSubmit, reset, valid } = this.props
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
                    services ? (
                      <List component="ul">
                        {services.map(service => (
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
                    ) : null
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
  services: getServices(state),
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
