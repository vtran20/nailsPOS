import React, { Component } from 'react'
import { connect } from 'react-redux'
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
  config
} from 'react-big-scheduler'
import moment from 'moment'
import withDragDropContext from './withDnDContext'
import { withStyles } from '@material-ui/core/styles'
import 'react-big-scheduler/lib/css/style.css'

import { compareAppointment } from '../../../utils'
import { deleteAppointment, loadAppointment } from '../../../actions/appointments'
import { updateCustomerForm } from '../../../actions/forms'
import apptStyle from '../../../assets/css/appointment.css'
import ServicesDialog from '../checkin/ServicesDialog'
import { getEmployees, getAppointments, getHours } from '../../../selectors'


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
      dayStopTo: 22,
      nonWorkingTimeHeadColor: '', //#8B0000 : dark red
      nonWorkingTimeHeadBgColor: '',
      nonWorkingTimeBodyBgColor: '',
      startResizable: false,
      endResizable: false,
      movable: false,
      views: [{viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false},
        {viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false},],
      //hours: {'Sun':'12-18', 'Mon':'10-20', 'Tue':'11-20', 'Wed':'12-20', 'Thu':'13-20', 'Fri':'14-20','Sat':'15-21'}
    }

    //TODO: set dayStart and dayEnd
    // Idea: set hours to config, when click next, prev, select date, we set dayStartFrom and dayStopTo so that it can rebuild the appointment.
    //
    // const currentDate = moment();
    // const hoursArr = updateHours (currentDate, this.props.hours)
    // if (hoursArr && hoursArr.length >= 2) {
    //     schedulerData.config.dayStartFrom=hoursArr[0]
    //     schedulerData.config.dayStopTo=hoursArr[1]
    // }

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
    const { viewModel } = this.state
    const { appointments, customerForm } = this.props
    //console.log(viewModel)
    // let leftCustomHeader = (
    //   <div>
    //     <span style={{ fontWeight: 'bold', color: 'white' }}>
    //       Put your content here
    //     </span>
    //   </div>
    // )
    let rightCustomHeader = (
      <div>
        <span style={{ fontWeight: 'bold', color: 'white' }}>{customerForm? `Customer Appointment: ${customerForm.firstName + ' ' + customerForm.lastName }`:''}</span>
      </div>
    )
    this.state.viewModel.setEvents(appointments? appointments.sort(compareAppointment): [])

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
    this.setState({
      viewModel: schedulerData
    })
  }

  nextClick = schedulerData => {
    schedulerData.next()
    this.props.dispatch (loadAppointment(schedulerData.startDate, schedulerData.endDate))    
    this.setState({
      viewModel: schedulerData
    })
  }

  onViewChange = (schedulerData, view) => {
    console.log (view.viewType)
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    )
    this.props.dispatch (loadAppointment(schedulerData.startDate, schedulerData.endDate))    
    this.setState({
      viewModel: schedulerData
    })
  }

  onSelectDate = (schedulerData, date) => {
    this.props.dispatch (loadAppointment(date.format(DATE_FORMAT), date.format(DATE_FORMAT)))    
    schedulerData.setDate(date)
    this.setState({
      viewModel: schedulerData
    })
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
      this.props.dispatch (deleteAppointment(event.id, event.resourceId, event.customerId))
      this.setState({
        viewModel: schedulerData
      })
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
    console.log("newEvent")
    if (schedulerData.viewType === 0) {
      if (this.props.customerForm) {
        console.log("this.props.customerForm", this.props.customerForm)
        this.props.dispatch (updateCustomerForm({startDate: start, endDate: end, employeeId: slotId}))
        console.log("this.props.customerForm", this.props.customerForm)
        this.setState({selectServicesDialog: true})
        //this.props.dispatch(handleOpenDialog({openAddServiceDialog: true, page:'appointment'}))
      } else {
        console.log("initial customer form")
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
    console.log("handleCustomerSearchOpen")
        //call back to parent method
     if (typeof this.props.onOpenSelectCustomerDialog === 'function') {
       this.props.onOpenSelectCustomerDialog()
     }
  }
}

const mapStateToProps = state => ({
  resources: getEmployees(state),
  appointments: getAppointments(state),
  hours : getHours(state),
  customerForm: state.forms && state.forms.customerForm? state.forms.customerForm : null
})


// export default connect(mapStateToProps)(withStyles(styles))
 export default connect(mapStateToProps)(withStyles(styles)(withDragDropContext(ScheduleAppointment)))
