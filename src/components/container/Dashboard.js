import React from 'react'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import MaskedInput from 'react-text-mask'
import { withStyles } from '@material-ui/core/styles'
import PhoneAutosuggest from '../common/PhoneAutosuggest'
import EmailAutosuggest from '../common/EmailAutosuggest'

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit
  }
})

function TextMaskCustom(props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
}

class Dashboard extends React.Component {
  state = {
    textmask: '(   )    -    '
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }
  searchCustomer = () => {}
  render() {
    const { classes } = this.props
    const { textmask } = this.state

    return (
      <Fragment>
        <form autoComplete="off">
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                component="h1"
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Customer Check In
              </Typography>

              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <FormControl className={classes.formControl}>
                      <PhoneAutosuggest />
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl className={classes.formControl}>
                      <EmailAutosuggest />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.searchCustomer()}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </form>
      </Fragment>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Dashboard)
