import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Grid, Typography } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import { connect } from 'react-redux'
import { updateTipPay } from '../../../actions/payments'
import { cents2Dollars, dollars2Cents, cents2Fixed2 } from '../../../utils'
import { getCurrentCustomer } from '../../../selectors'

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
  FormControl: {
    // margin: theme.spacing.unit,
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  input: {
    // margin: theme.spacing.unit,
     marginLeft: 20,
    // marginRight: theme.spacing.unit,
    width: 70,
    height: 40,
  },
  tipLabel: {
    //margin: theme.spacing.unit,
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    height: 35,
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class ServiceCostSummary extends React.Component {

  state = {}

  handleTipPayUpdate = ({ target: { value } }) => {
    this.props.dispatch(updateTipPay({tipPrice : dollars2Cents(this.state.tipPriceState)}))
    this.setState({edit: false, tipPriceState: 0})   
    if (typeof this.props.onBlur === 'function') {      
      this.props.onBlur()
    }
  }

  handleTipPayChange = (e) => {
    this.setState({tipPriceState: e.target.value});
  }

  handleOnFocus = (e) => {
    e.target.select()
    this.setState({edit: true, tipPriceState: cents2Fixed2(this.props.currentCheckout.tipPrice)}) 
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus()
    }
  }

  render() {
    const { classes, page, customer, currentCheckout } = this.props
    return (
      <div>
        {customer? (
          <Grid item xs={12} 
            container
            alignItems="flex-end"
          >
            <Grid item xs={6}>
              <Typography align="right" variant="body2">
                Services:
              </Typography>
              <Typography align="right" variant="body2">
                Tax:
              </Typography>
              <Typography align="right" variant="body2" className={classes.tipLabel}>
                Tip:
              </Typography>
              <Divider />
              <Typography align="right" variant="subtitle1">
                Total:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right" variant="body2">
                {cents2Dollars(currentCheckout.servicePrice)}
              </Typography>
              <Typography align="right" variant="body2">
                $0
              </Typography>
              {page === 'payment' && customer
              ?
              <FormControl className={classes.input}>
                <Input
                  className={classes.margin}
                  id="adornment-amount"
                  onFocus={this.handleOnFocus}
                  value = {this.state.edit? this.state.tipPriceState :cents2Fixed2(currentCheckout.tipPrice)}
                  onChange={this.handleTipPayChange}
                  onBlur={this.handleTipPayUpdate}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
              : 
              <Typography align="right" variant="body2" className={classes.tipLabel}>
                {cents2Dollars(currentCheckout.tipPrice)}
              </Typography>
              }
              <Divider />
              <Typography align="right" variant="subtitle1">
                {cents2Dollars(currentCheckout.totalPrice)}
              </Typography>
            </Grid>
          </Grid>         
        ) : (
          ''
        )}
      </div>
    )
  }
}

ServiceCostSummary.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  customer: getCurrentCustomer(state),
  currentCheckout : state.payments.currentCheckout
})

export default connect(mapStateToProps)(withStyles(styles)(ServiceCostSummary))
