import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import LockIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {TextMaskCustom, renderTextField, renderPhoneTextField, renderCheckbox} from '../utils'
import Messages from '../components/container/common/Messages'
import {login, clearGlobalError} from '../actions'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200,
  },
  margin: {
    margin: theme.spacing.unit,
  },
})

const validate = values => {
  const errors = {}
  const requiredFields = [
    'userName',
    'password',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  if (values.userName) {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.userName)) {
      errors.userName = 'Invalid email address'
    }
  }

  return errors
}

class SignIn extends Component {
  handleSubmit = (values) => {
    this.props.dispatch(clearGlobalError())
    this.props.dispatch(login(values))
    return
  }

  render () {
  
  const { classes, fetching, errors, values, pristine, submitting, formData, handleSubmit, reset, valid } = this.props

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {
          fetching
          ? <CircularProgress disableShrink />
          : ''
        }
        {errors && errors.map((error, index) => 
          <Messages
              key={index}
              onClose={this.handleCloseError}
              variant="error"
              className={classes.margin}
              message={error}
              excludeAction="true"
            />
        )}

        <form className={classes.form} onSubmit={handleSubmit(val => this.handleSubmit(val))}>
          <FormControl margin="normal" required fullWidth>
              <Field 
              name="userName" 
              component={renderTextField}
              label="Email"
              />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
              <Field 
              name="password" 
              type="password" 
              component={renderTextField}
              label="Password"
              />
          </FormControl>
          <Field name="rememberMe" component={renderCheckbox} label="Remember me" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={pristine || submitting}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  )    
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
}

// Decorate with redux-form
SignIn = reduxForm({
  form: 'loginForm',
  enableReinitialize : true,
  validate
})(SignIn)

const mapStateToProps = state => ({
  fetching : state.customers.fetching,
  errors: state.errors
})

export default connect(mapStateToProps)(withStyles(styles)(SignIn))