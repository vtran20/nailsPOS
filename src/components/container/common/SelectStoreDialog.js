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
  DialogContentText,
  OutlinedInput,
  Toolbar,
  IconButton,
  Typography

} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { selectStore } from '../../../actions'
import { updatePOSScreen } from '../../../actions'

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

class SelectStoreDialog extends Component {
  handleChange = event => {
    this.props.dispatch(selectStore(event.target.value))
  }
  onClose = () => {
    //call back to parent method
    this.props.dispatch(updatePOSScreen({ selectStoreDialog: false}))
  }

  render() {
    const { classes, fullScreen, open } = this.props
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        //onClose={this.handleCloseCheckIn}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Toolbar>
            <IconButton color="inherit" onClick={this.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Please select store
            </Typography>
          </Toolbar>
        </DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <Select 
            onChange={this.handleChange} 
            value={this.props.currentStoreId}
             inputProps={{
                  name: 'storeId',
                  id: 'storeId',
            }}
            >
              {this.props.allIds.map(sId => (
                <MenuItem key={sId} value={sId}>
                  {this.props.stores[sId].name +
                    ' - ' +
                    this.props.stores[sId].address_1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions />
      </Dialog>
    )
  }
}
//  export default withStyles(styles)(SelectStoreDialog)
const mapStateToProps = state => ({
  allIds: state.stores.allIds,
  stores: state.stores.byId,
  currentStoreId: state.stores.currentStoreId
})

export default connect(mapStateToProps)(withStyles(styles)(SelectStoreDialog))
