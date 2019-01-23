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
import MaskedInput from 'react-text-mask'
import { Edit, Delete, Add } from '@material-ui/icons'

import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles'
import {editEmployee, editEmployeeClear, createEmployee, updatingEmployee, deleteEmployee} from '../../../../actions/employees'
import { connect } from 'react-redux'
import { getEmployees } from '../../../../selectors'
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
    'firstName',
    'lastName',
    'phone'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  if (values.email) {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
  }

  return errors
}

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
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

const renderPhoneTextField = ({
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
    InputProps={{
      inputComponent: TextMaskCustom,
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

class EmployeesDialog extends Component {

  // handleChange = name => ({ target: { value } }) => {
  // }
  
  handleSubmit = (values) => {
    if (this.props.initialValues.id) {
      const data = {
        id: this.props.initialValues.id,
        firstName: this.props.formData.firstName,
        lastName: this.props.formData.lastName,
        phone: this.props.formData.phone,
        email: this.props.formData.email
      }
      this.props.dispatch(updatingEmployee(data))
    } else {
      const data = {...this.props.formData}
      this.props.dispatch(createEmployee(data))
    }
  }

  onClose = () => {
    //call back to parent method
    this.props.dispatch(updatePOSScreen({ employeesDialog: false}))
  }

  onSelect = () => {
    //call back to parent method
  }

  onSelectEdit = (employee) => {
    this.props.dispatch(editEmployee(employee))
  }

  onDelete = (employeeId) => {
    this.props.dispatch(deleteEmployee(employeeId))
  }

  onAddnew = () => {
    this.props.dispatch(editEmployeeClear())
  }

  handleUpdateEmployee = () => {
    
  }
  render() {
    const { classes, open, employees, name, minutes, isNewEmployee, pristine, submitting, formData, handleSubmit, reset, valid } = this.props
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
              Employees
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
                    employees ? (
                      <List component="ul">
                        {employees.map(employee => (
                          <ListItem key={employee.id} button onClick={() => this.onSelect(employee.id)}>
                            <ListItemText primary={employee.name} />
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => this.onSelectEdit(employee)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => this.onDelete(employee.id)}>
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
                        {isNewEmployee? 'New Employee' : 'Update Employee'}
                      </Typography>
                        <form onSubmit={handleSubmit(val => this.handleSubmit(val))}>
                        <div>
                          <Field 
                          name="firstName" 
                          component={renderTextField}
                          label="First Name"
                          />
                        </div>
                        <div>
                          <Field 
                          name="lastName" 
                          component={renderTextField}
                          label="Last Name"
                          />
                        </div>
                        <div>
                          <Field 
                          name="phone" 
                          component={renderPhoneTextField}
                          label="Phone"
                          />
                        </div>
                        <div>
                          <Field 
                          name="email" 
                          component={renderTextField}
                          label="Email"
                          />
                        </div>
                          <br />
                            {isNewEmployee
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
  employees: getEmployees(state),
  isNewEmployee : state.employees.edit.id? false : true,
  name: state.employees.edit.name,
  minutes: state.employees.edit.minutes,
  initialValues: state.employees.edit? {...state.employees.edit} : null,
  formData : state.form.employeeForm && state.form.employeeForm.values? state.form.employeeForm.values : {},
  employeeForm : state.form.employeeForm
})

// Decorate with redux-form
EmployeesDialog = reduxForm({
  form: 'employeeForm',
  enableReinitialize : true,
  validate
})(EmployeesDialog)

export default connect(mapStateToProps)(withStyles(styles)(EmployeesDialog))
