import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
  config,
  DemoData
} from 'react-big-scheduler'
import moment from 'moment'
import withDragDropContext from './withDnDContext'
import { withStyles } from '@material-ui/core/styles'
import 'react-big-scheduler/lib/css/style.css'

import { getEmployeesArray, getAppointmentsArray, compareAppointment } from '../../../utils'
import { createAppointment, deleteAppointment, loadAppointment } from '../../../actions/appointments'
import { updateCustomerForm } from '../../../actions/forms'
import apptStyle from '../../../assets/css/appointment.css'
import CircularProgress from '@material-ui/core/CircularProgress'
import { handleOpenDialog } from '../../../actions'
import ServicesDialog from '../checkin/ServicesDialog'


const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
})

class ScheduleAppointment extends Component {
  constructor(props) {
    super(props)

    const newConfig = {
      ...config,
      schedulerWidth: 1200,
      minuteStep: 15,
      resourceName: 'Employee',
      checkConflict: true,
      schedulerMaxHeight: 400,
      eventItemHeight: 28,
      eventItemLineHeight: 30,
      dayStartFrom:8,
      dayStopTo: 17,
      nonWorkingTimeHeadColor: '',
      nonWorkingTimeHeadBgColor: '',
      nonWorkingTimeBodyBgColor: '',
      startResizable: false,
      endResizable: false,
      movable: false,
      views: [{viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false},
        {viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false},]
    }
    //2. create the view model, put it in the props obj
    let schedulerData = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Day,
      false,
      false,
      newConfig
    )
    //set locale moment to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
    moment.locale('en_US')
    schedulerData.setLocaleMoment(moment)
    // schedulerData.localeMoment.locale('en')

    //set resources here or later
    schedulerData.setResources(this.props.resources)
    //set events here or later,
    //the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
    const sortedAppointments = this.props.appointments.sort(compareAppointment)
    schedulerData.setEvents(sortedAppointments)

    this.state = {
      viewModel: schedulerData,
      selectServicesDialog: false
    }
  }

  render() {
    const { viewModel, schedulerData } = this.state
    const { fetching, appointments, customerForm, classes  } = this.props

    let leftCustomHeader = (
      <div>
        <span style={{ fontWeight: 'bold', color: 'white' }}>
          Put your content here
        </span>
      </div>
    )
    let rightCustomHeader = (
      <div>
        <span style={{ fontWeight: 'bold', color: 'white' }}>{customerForm? `Customer Appointment: ${customerForm.firstName + ' ' + customerForm.lastName }`:''}</span>
      </div>
    )
    this.state.viewModel.setEvents(appointments? appointments: [])

    return (
      <div>
          <ServicesDialog
            open={this.state.selectServicesDialog}
            onClose={this.handleCloseServices}
            fullScreen={true}
            onSubmitServices={this.handleSubmitServices}
            onSkipServices={this.handleSkipServices}
            page='appointment'
          />
          <Scheduler className={apptStyle}
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            viewEventClick={this.remove}
            viewEventText="Remove"
            //viewEvent2Text="Edit"
            //viewEvent2Click={this.edit}
            // updateEventStart={this.updateEventStart}
            // updateEventEnd={this.updateEventEnd}
            // moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            // leftCustomHeader={leftCustomHeader}
            rightCustomHeader={rightCustomHeader}
          />
      </div>
    )
  }

  prevClick = schedulerData => {
    schedulerData.prev()
    this.props.dispatch (loadAppointment(schedulerData.startDate, schedulerData.endDate))    
  }

  nextClick = schedulerData => {
    schedulerData.next()
    this.props.dispatch (loadAppointment(schedulerData.startDate, schedulerData.endDate))    
  }

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    )
    this.props.dispatch (loadAppointment(schedulerData.startDate, schedulerData.endDate))    
  }

  onSelectDate = (schedulerData, date) => {
    this.props.dispatch (loadAppointment(date.format(DATE_FORMAT), date.format(DATE_FORMAT)))    
    schedulerData.setDate(date)
  }

  eventClicked = (schedulerData, event) => {
    //alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`)
  }

  remove = (schedulerData, event) => {
    if (
      window.confirm(
        `Do you want to remove ${event.title}'s appointment?`
      )
    ) {
      let newFreshId = 0
      schedulerData.events.forEach(item => {
        if (item.id >= newFreshId) newFreshId = item.id + 1
      })
      this.props.dispatch (deleteAppointment(event.id))
    }    
  }

  edit = (schedulerData, event) => {
    // alert(
    //   `You just executed edit to event: {id: ${event.id}, title: ${
    //     event.title
    //   }}`
    // )
  }

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if (schedulerData.viewType === 0) {
      if (this.props.customerForm) {
        this.props.dispatch (updateCustomerForm({startDate: start, endDate: end, employeeId: slotId}))
        this.setState({selectServicesDialog: true})
        //this.props.dispatch(handleOpenDialog({openAddServiceDialog: true, page:'appointment'}))
      } else {
        this.handleCustomerSearchOpen()
      }
    }
  }

  updateEventStart = (schedulerData, event, newStart) => {
    if (
      window.confirm(
        `Do you want to adjust the start of the event? {eventId: ${
          event.id
        }, eventTitle: ${event.title}, newStart: ${newStart}}`
      )
    ) {
      schedulerData.updateEventStart(event, newStart)
    }
    this.setState({
      viewModel: schedulerData
    })
  }

  updateEventEnd = (schedulerData, event, newEnd) => {
    if (
      window.confirm(
        `Do you want to adjust the end of the event? {eventId: ${
          event.id
        }, eventTitle: ${event.title}, newEnd: ${newEnd}}`
      )
    ) {
      schedulerData.updateEventEnd(event, newEnd)
    }
    this.setState({
      viewModel: schedulerData
    })
  }

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    if (
      window.confirm(
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${
          event.title
        }, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
      )
    ) {
      schedulerData.moveEvent(event, slotId, slotName, start, end)
      this.setState({
        viewModel: schedulerData
      })
    }
  }

  handleCloseServices = () => {
    this.setState({selectServicesDialog:false})
  }

  handleCustomerSearchOpen = () => {
        //call back to parent method
     if (typeof this.props.onOpenSelectCustomerDialog === 'function') {
       this.props.onOpenSelectCustomerDialog()
     }
  }
}

const mapStateToProps = state => ({
  resources: getEmployeesArray(state.employees.allIds, state.employees.byId),
  appointments: getAppointmentsArray(state.appointments.allIds, state.appointments.byId),
  customerForm: state.forms && state.forms.customerForm? state.forms.customerForm : null
})


export default connect(mapStateToProps)(withStyles(styles)(withDragDropContext(ScheduleAppointment)))
