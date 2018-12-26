import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContent,
  DialogContentText
} from '@material-ui/core'
import { initialData } from '../../actions'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  flex: {
    flex: 1
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class SelectStore extends Component {
  state = {
    selectedStore: true
  }
  handleChange = event => {
    this.props.dispatch(initialData(event.target.value))
  }

  render() {
    const { classes, fullScreen } = this.props
    return (
      <Dialog
        fullScreen={fullScreen}
        open={!this.props.currentStoreId}
        //onClose={this.handleCloseCheckIn}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Please select store'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-store">Select Store</InputLabel>
              <Select onChange={this.handleChange}>
                <MenuItem value="">
                  <em>Select Store</em>
                </MenuItem>
                {this.props.allIds.map(sId => (
                  <MenuItem key={sId} value={sId}>
                    {this.props.stores[sId].name +
                      ' - ' +
                      this.props.stores[sId].address_1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions />
      </Dialog>
    )
  }
}
//  export default withStyles(styles)(SelectStore)
const mapStateToProps = state => ({
  allIds: state.stores.allIds,
  stores: state.stores.byId,
  currentStoreId: state.stores.currentStoreId
})

export default connect(mapStateToProps)(withStyles(styles)(SelectStore))
