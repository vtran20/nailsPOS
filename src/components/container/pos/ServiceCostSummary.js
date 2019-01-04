import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Grid, Typography, Button } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import SvgIcon from '@material-ui/core/SvgIcon'

import ServiceTables from './ServiceTables'
import { connect } from 'react-redux'
import { updateCustomerDB } from '../../../actions/customers'
import { updateTipPay } from '../../../actions/payments'
import { cents2Dollars, getServiceCost, dollars2Cents, cents2Fixed2 } from '../../../utils'
import { changePOSScreen } from '../../../actions'


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

  handleTipPayChange = ({ target: { value } }) => {
    this.props.dispatch(updateTipPay({tipPrice : dollars2Cents(value)}))
  }

  componentDidMount() {
    console.log (this.props.currentCheckout.tipPrice)
   //this.setState({inputValue: this.props.inputValue});
}
handleChange = (e) => {
  this.setState({inputValue: e.target.value});
}

// <input value={this.state.inputValue} onChange={this.handlechange} onBlur={() => this.props.actions.updateInput(this.state.inputValue)} />

  render() {
    const { classes, page } = this.props
    console.log (this.props.currentCheckout.tipPrice)
    return (
      <div>
        {this.props.customerId && this.props.customers[this.props.customerId]? (
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
                {cents2Dollars(this.props.currentCheckout.servicePrice)}
              </Typography>
              <Typography align="right" variant="body2">
                $0
              </Typography>
              {page === 'payment' && this.props.customerId
              ?
              <FormControl className={classes.input}>
                <Input
                  className={classes.margin}
                  id="adornment-amount"
                  onFocus={e => e.target.select()}
                  // defaultValue = {cents2Fixed2(this.props.currentCheckout.tipPrice)}
                  value = {cents2Fixed2(this.props.currentCheckout.tipPrice)}
                  //onChange={this.handleTipPayChange}
                  onBlur={this.handleTipPayChange}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
              : 
              <Typography align="right" variant="body2" className={classes.tipLabel}>
                {cents2Dollars(this.props.currentCheckout.tipPrice)}
              </Typography>
              }
              <Divider />
              <Typography align="right" variant="subtitle1">
                {cents2Dollars(this.props.currentCheckout.totalPrice)}
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
  customers: state.customers.byId,
  customerId: state.posScreen.customerId,
  customerServices: state.customerServices.byId,
  employeeServices: state.employeeServices.byId,
  currentCheckout : state.payments.currentCheckout
})

export default connect(mapStateToProps)(withStyles(styles)(ServiceCostSummary))
