import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { updateCustomer } from '../../../actions/customers'
import { addCustomerForm } from '../../../actions/forms'

class CustomerForm extends Component {
  state = this.getInitState()

  getInitState() {
    const { customer } = this.props

    return customer
      ? customer
      : {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        }
  }

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value
    })

  handleCheckInNewCustomer = () => {
    if (this.props.customer) {
      this.props.dispatch(
        updateCustomer(
          this.props.customer.id,
          this.state.firstName,
          this.state.lastName,
          this.state.phone,
          this.state.email
        )
      )
    } else {
      //find if customers were scheduled appointment today or already serviced.
      const custId = this.props.allIds.filter(
        customerId =>
          this.props.customers[customerId].email === this.state.email ||
          this.props.customers[customerId].phone === this.state.phone
      )
      if (custId && custId.length > 0) {
        //this customer was scheduled appointment. Just display services and finish check in.
        this.props.dispatch(addCustomerForm(this.props.customers[custId[0]]))
      } else {
        this.props.dispatch(
          addCustomerForm({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            email: this.state.email
          })
        )
      }
    }
    //call back to parent method
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }

  handleSelectCustomerForAppointment = () => {
    this.props.dispatch(
      addCustomerForm({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        email: this.state.email,
        status: 'SCHEDULED'
      })
    )
    //call back to parent method and move to select appointment time
    if (typeof this.props.onSubmitForAppointment === 'function') {
      this.props.onSubmitForAppointment()
    }
  }

  // renderButton = (page) => {
  //   if  (page ==='appointment') {
  //       return 
  //        ( <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSelectCustomerForAppointment()}
  //         >
  //           Continue Appointment
  //         </Button>
  //         )
  //   }
  //   else if (page === 'posCheckIn') {
  //       return 
  //       (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSubmitCustomerFormForPOSCheckIn()}
  //         >
  //           Continue Appointment
  //         </Button>
  //       )
  //   }
  //   else if (page === 'selfCheckIn') {
  //       return 
  //       (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSelectCustomerForSelfCheckIn()}
  //         >
  //           Continue Appointment
  //         </Button>
  //       )
  //   }
  // }

  // renderButton = (page) => {
  //   switch (page) {
  //     case 'appointment':
  //       return 
  //       (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSelectCustomerForAppointment()}
  //         >
  //           Continue Appointment
  //         </Button>
  //       )
  //     case 'posCheckIn':
  //       return 
  //       (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSubmitCustomerFormForPOSCheckIn()}
  //         >
  //           Continue Appointment
  //         </Button>
  //       )
  //     case 'selfCheckIn':
  //       return 
  //       (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // className={classes.button}
  //           onClick={() => this.handleSelectCustomerForSelfCheckIn()}
  //         >
  //           Continue Appointment
  //         </Button>
  //       )
  //     default:
  //       return ''
  //   }
  // }

       renderButton = (page) => {
        if (page === 'appointment') {
          return (
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={() => this.handleSelectCustomerForAppointment()}
            >
              Continue Appointment
            </Button>
          )
        } else if (page === 'posCheckIn') {
          return (
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={() => this.handleSubmitCustomerFormForPOSCheckIn()}
            >
              Continue Appointment
            </Button>
          )
        } else if (page === 'selfCheckIn') {
          return (
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={() => this.handleSelectCustomerForSelfCheckIn()}
            >
              Continue Appointment
            </Button>
          )
        }
      }

  render() {
    const { firstName, lastName, phone, email } = this.state
    const { customer, page } = this.props

    return (
      <form>
        <TextField
          label="First Name"
          value={firstName}
          onChange={this.handleChange('firstName')}
          margin="normal"
          fullWidth
          autoFocus
        />

        <TextField
          label="Last Name"
          value={lastName}
          onChange={this.handleChange('lastName')}
          margin="normal"
          fullWidth
        />

        <TextField
          label="Phone"
          value={phone}
          onChange={this.handleChange('phone')}
          margin="normal"
          fullWidth
        />

        <TextField
          label="Email"
          value={email}
          onChange={this.handleChange('email')}
          margin="normal"
          fullWidth
        />
        <br />
        <br />
        {this.renderButton(page)}
      </form>
    )
  }
}
const mapStateToProps = state => ({
  allIds: state.customers.allIds,
  customers: state.customers.byId
})

export default connect(mapStateToProps)(CustomerForm)
