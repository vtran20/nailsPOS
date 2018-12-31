import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Grid, Typography, Button } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import SvgIcon from '@material-ui/core/SvgIcon'

import ServiceTables from './ServiceTables'
import { connect } from 'react-redux'
import { updateCustomerDB } from '../../../actions/customers'
import { cents2Dollars, getServiceCost } from '../../../utils'
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

  render() {
    const { classes } = this.props
    return (
      <div>
        {this.props.customerId && this.props.customers[this.props.customerId]? (
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography align="right" variant="body2">
                Services:
              </Typography>
              <Typography align="right" variant="body2">
                Tax:
              </Typography>
              <Typography align="right" variant="body2">
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
              <Typography align="right" variant="body2">
                $0
              </Typography>
              <Divider />
              <Typography align="right" variant="subtitle1">
                {cents2Dollars(this.props.servicePrices)}
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
  servicePrices : getServiceCost (state.customers.byId[state.posScreen.customerId], state.customerServices.byId, state.employeeServices.byId)
})

export default connect(mapStateToProps)(withStyles(styles)(ServiceCostSummary))
