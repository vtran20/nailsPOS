import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import ServiceCostSummary from './ServiceCostSummary'
import ServicePayment from './ServicePayment'
import { connect } from 'react-redux'
import { changePOSScreen } from '../../../actions'
import { updateCurrentCheckout, selectCredit, completePayment } from '../../../actions/payments'
import { cents2Dollars } from '../../../utils'

const styles = theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: `${theme.spacing.unit * 3}px`
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing.unit
  },
  button: {
    textAlign: 'left'
    // justifyContent: 'flex-end',
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  }
})

class Payment extends React.Component {

  handleClickBack = (screen) => {
    this.props.dispatch(changePOSScreen(screen))
  }

  handleSelectPaymentMethod = (data) => {
    this.props.dispatch(updateCurrentCheckout(data))
  }
  
  handleCompletePayment = () => {
    this.props.dispatch(completePayment())
  }

  render() {
    const { classes, customer } = this.props
    let currentCheckout = this.props.payments[this.props.customerId]
    ? this.props.payments[this.props.customerId]
    : this.props.currentCheckout

  return (
    <div>
      <Grid container spacing={24}>
        <Grid item xs={8}>
          <Grid container item xs={12}>
            <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom>
              Customer: {customer.firstName + ' ' + customer.lastName}
            </Typography>
            </Grid>
            <Grid item xs={6}>
                <ServiceCostSummary />
            </Grid>
          </Grid>
          <div className={classes.tableContainer}>{<ServicePayment />}</div>
        </Grid>
        <Grid item xs={4}>
        <Paper className={classes.paper}>
          <Typography variant="h4" gutterBottom>
          {cents2Dollars(currentCheckout.totalPrice)}
          </Typography>
          <br/>
          <Typography variant="subtitle1" gutterBottom>
            Select Payment
          </Typography>
          <Divider className={classes.divider} />
          <Button
            color="secondary"
            size="small"
            className={classes.button}
            fullWidth
            onClick={() => this.handleSelectPaymentMethod({credit: !this.props.credit})}
            variant={this.props.credit? 'outlined' : 'text'}
          >
            <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </SvgIcon>
            Credit/Debit
          </Button>
          <br/>
          <br/>
          <Button
            color="secondary"
            size="small"
            className={classes.button}
            fullWidth
            onClick={() => this.handleSelectPaymentMethod({cash: !this.props.cash})}
            variant={this.props.cash? 'outlined' : 'text'}
          >
            <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
              <path fill="none" d="M0 0h24v24H0V0z"/><path d="M5 8h2v8H5zm7 0H9c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 6h-1v-4h1v4zm7-6h-3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 6h-1v-4h1v4z"/><path fill="none" d="M4 6h16v12H4z"/><path d="M2 4v16h20V4H2zm2 14V6h16v12H4z"/>
            </SvgIcon>
            Cash
          </Button>
          <br/>
          <br/>
          <Button
            color="secondary"
            size="small"
            className={classes.button}
            fullWidth
            onClick={() => this.handleSelectPaymentMethod({giftcard: !this.props.giftcard})}
            variant={this.props.giftcard? 'outlined' : 'text'}
          >
            <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
            </SvgIcon>
            Gift Card
          </Button>
          <br/>
          <br/>
          <Button
            color="secondary"
            size="small"
            className={classes.button}
            fullWidth
            onClick={() => this.handleSelectPaymentMethod({check: !this.props.check})}
            variant={this.props.check? 'outlined' : 'text'}
          >
            <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
              <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/><path d="M0 0h24v24H0z" fill="none"/>
            </SvgIcon>
            Check
          </Button>
          <br/>
          <br/>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className={classes.button}
            fullWidth
            onClick={() => this.handleClickBack({screen: 'CUSTOMER_DETAIL', customerId: this.props.customerId})}
          >
            <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
              <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/><path fill="none" d="M0 0h24v24H0z"/>
            </SvgIcon>
            Back
          </Button>
          <br/>
          <br/>
          {customer && customer.status === 'COMPLETED'
          ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                fullWidth
                className={classes.button}
              >
                <SvgIcon className={classNames(classes.leftIcon, classes.iconSmall)}>
                  <path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </SvgIcon>
                Completed
              </Button>
            ) 
            : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                fullWidth
                onClick={() => this.handleCompletePayment()}
              >
                <SvgIcon>
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </SvgIcon>
                Confirm
              </Button>
              )}
          <br/>
          <br/>
        </Paper>
        </Grid>
      </Grid>
    </div>
  )}
}

Payment.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  customerId: state.posScreen.customerId,
  customer : state.customers.byId[state.posScreen.customerId],
  credit: state.payments.currentCheckout.credit,
  cash: state.payments.currentCheckout.cash,
  check: state.payments.currentCheckout.check,
  giftcard: state.payments.currentCheckout.giftcard,
  payments: state.payments.byId,
  currentCheckout: state.payments.currentCheckout
})

export default connect(mapStateToProps)(withStyles(styles)(Payment))

