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
import { cents2Dollars, getServiceCost, dollars2Cents } from '../../../utils'
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

  render() {
    const { classes, page } = this.props
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
                {cents2Dollars(this.props.servicePrices)}
              </Typography>
              <Typography align="right" variant="body2">
                $0
              </Typography>
              {page === 'payment'
              ?
              <FormControl className={classes.input}>
                <Input
                  className={classes.margin}
                  id="adornment-amount"
                  onFocus={e => e.target.select()}
                  defaultValue = {0}
                  onChange={this.handleTipPayChange}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
              : 
              <Typography align="right" variant="body2" className={classes.tipLabel}>
                $0
              </Typography>
              }
              <Divider />
              <Typography align="right" variant="subtitle1">
                {cents2Dollars(this.props.totalPrice)}
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
  servicePrices : getServiceCost (state.customers.byId[state.posScreen.customerId], state.customerServices.byId, state.employeeServices.byId),
  totalPrice : (state.payments && state.payments.currentCheckout && state.payments.currentCheckout.totalPrice)? state.payments.currentCheckout.totalPrice : getServiceCost (state.customers.byId[state.posScreen.customerId], state.customerServices.byId, state.employeeServices.byId)
})

export default connect(mapStateToProps)(withStyles(styles)(ServiceCostSummary))
