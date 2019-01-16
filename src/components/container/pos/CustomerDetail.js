import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Grid, Typography, Button } from '@material-ui/core'

import SvgIcon from '@material-ui/core/SvgIcon'

import ServiceTables from './ServiceTables'
import ServiceCostSummary from './ServiceCostSummary'
import { connect } from 'react-redux'
import { updateCustomerDB } from '../../../actions/customers'
import { handleOpenDialog } from '../../../actions'
import { handlePayment } from '../../../actions/payments'

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

class CustomerDetail extends React.Component {

  handleStartCustomerService = customerId => {
    this.props.dispatch(updateCustomerDB({id:customerId, status: 'IN_PROGRESS'}))
  }
  handlePayment = (screen) => {
    this.props.dispatch(handlePayment(screen))
  }
  handleOpenAddServicesDialog = (dialog) => {
    this.props.dispatch(handleOpenDialog(dialog))
  }

  handleOpenAddEmployeesDialog = (dialog) => {
    this.props.dispatch(handleOpenDialog(dialog))
  }

  renderCustomerDetailButtons() {
    const { classes } = this.props

    if (this.props.customerId && this.props.customers[this.props.customerId]) {
      const customer = this.props.customers[this.props.customerId]
      switch (customer.status) {
        case 'SCHEDULED':
          return (
                <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                onClick={() => this.handleStartCustomerService(this.props.customerId)}
              >
                <SvgIcon>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </SvgIcon>
                Check In
              </Button>
            )
        case 'IN_PROGRESS':
        case 'WAITING':
          return (
            <div>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.button}
                onClick={() =>
                    this.handleOpenAddServicesDialog({
                      openAddServiceDialog: true
                    })
                  }
              >
                <SvgIcon>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/>
                </SvgIcon>
                Services
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.button}
                onClick={() =>
                    this.handleOpenAddEmployeesDialog({
                      openAddEmployeeDialog: true
                    })
                  }
              >
                <SvgIcon>
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/>
                </SvgIcon>
                Employees
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                onClick={() => this.handlePayment({screen: 'PAYMENT_CUSTOMER', customerId: this.props.customerId})}
              >
                <SvgIcon>
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </SvgIcon>
                Pay
              </Button>
            </div>
            )
        case 'COMPLETED':
          return ''
        default:
          return ''
      }
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        {this.props.customerId && this.props.customers[this.props.customerId]? (
          <div>
            <Grid container spacing={8}>
              <Grid item xs={7} sm container>
                <Grid item xs={6} container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography gutterBottom variant="h6">
                      Customer
                    </Typography>
                    <Typography color="textSecondary">
                      {this.props.customers[this.props.customerId].firstName +
                        ' ' +
                        this.props.customers[this.props.customerId].lastName}
                    </Typography>
                    <Typography color="textSecondary">
                      {this.props.customers[this.props.customerId].phone}
                    </Typography>
                    <Typography color="textSecondary">
                      {this.props.customers[this.props.customerId].email}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={6} container>
                  <ServiceCostSummary />
                </Grid>
              </Grid>
              <Grid item xs={5} container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                  {this.renderCustomerDetailButtons()}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />
            <Typography component="div" className={classes.chartContainer}>
              {/*<SimpleLineChart />*/}
            </Typography>
            <Typography gutterBottom variant="h6">
              Services
            </Typography>
            <div className={classes.tableContainer}>{<ServiceTables />}</div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

CustomerDetail.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  customers: state.customers.byId,
  customerId: state.posScreen.customerId,
  customerServices: state.customerServices.byId
})

export default connect(mapStateToProps)(withStyles(styles)(CustomerDetail))
