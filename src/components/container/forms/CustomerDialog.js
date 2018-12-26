import React, { Component, Fragment } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import CustomerForm from './CustomerForm'
import { connect } from 'react-redux'

class CreateDialog extends Component {
  state = {
    open: false
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleFormSubmit = () => {
    this.handleToggle()
  }

  render() {
    const { open } = this.state

    return (
      <Fragment>
        <Button
          variant="fab"
          onClick={this.handleToggle}
          color="secondary"
          mini
        >
          <Add />
        </Button>

        <Dialog open={open} onClose={this.handleToggle} fullWidth maxWidth="xs">
          <DialogTitle>Create a New Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form below.
            </DialogContentText>
            <CustomerForm onSubmit={this.handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

export default CreateDialog
