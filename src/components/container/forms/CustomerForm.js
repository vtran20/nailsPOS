import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Paper } from '@material-ui/core'
import { updateCustomer } from '../../../actions/customers'
import { addCustomerForm } from '../../../actions/forms'
import { Field, reduxForm } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import {required, TextMaskCustom, renderTextField, renderPhoneTextField} from '../../../utils'

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
    // 'phone'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  const phoneNumber = values.phone? values.phone.replace(/\D+/g, '') : undefined
  if (phoneNumber) {
    if (!/^(0|[1-9][0-9]{9})$/i.test(phoneNumber)) {
      errors.phone = 'Invalid phone number, must be 10 digits'
    }
  }

  if (values.email) {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
  }

  return errors
}

let CustomerForm = (props) => {

  const { dispatch, classes, page, pristine, submitting, handleSubmit, reset, valid, phone, email, onSubmit, onSelectCustomer } = props
    const handleSubmitForm = (values) => {
      dispatch(addCustomerForm({...values, phone: values.phone? values.phone.replace(/\D+/g, '') : undefined}))
      console.log(page)
      if (page === 'posCheckIn') {
        //call back to parent method
        if (typeof onSubmit === 'function') {
          console.log('onSubmit:'+ typeof onSubmit)
          onSubmit()
        }
      } else if (page === 'appointment') {
        //call back to parent method and move to select appointment time
        if (typeof onSelectCustomer === 'function') {
          console.log('onSelectCustomer:'+ typeof onSelectCustomer)
          onSelectCustomer()
        }
      }
      return
  }

  return (
      <form onSubmit={handleSubmit(handleSubmitForm)}>
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
              validate={phone? required : undefined}
          />
        </div>
        <div>
          <Field
              name="email"
              component={renderTextField}
              label="Email"
              validate={email? required : undefined}
          />
        </div>
        <br />
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
            disabled={!valid || pristine || submitting}
        >
          Add
        </Button>
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
  )
}
const mapStateToProps = state => ({
  allIds: state.customers.allIds,
  customers: state.customers.byId,
  formData : state.form.customerForm && state.form.customerForm.values? state.form.customerForm.values : {},
})

// Decorate with redux-form
CustomerForm = reduxForm({
  form: 'customerForm',
  enableReinitialize : true,
  validate
})(CustomerForm)

export default connect(mapStateToProps)(withStyles(styles)(CustomerForm))
