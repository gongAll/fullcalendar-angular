import { AfterViewInit, Component, forwardRef, TemplateRef, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventClickArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  calendarOptions?: CalendarOptions;

  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  @ViewChild('someCellTemplate') someCellTemplate?: TemplateRef<any>;

  @ViewChild('someHeaderTemplate') someHeaderTemplate?: TemplateRef<any>;

  ngAfterViewInit() {
    // need for load calendar bundle first
    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [interactionPlugin, resourceTimelinePlugin],
      editable: true,
      initialView: 'resourceTimelineMonth',
      customButtons: {
        myCustomButton: {
          text: 'toggle resources and events!',
          click: () => {
            this.toggleResourcesEvents();
          },
        },
      },
      headerToolbar: {
        left: 'prev,next today myCustomButton',
        center: 'title',
        right: '',
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this),
      resourceAreaColumns: [
        {
          cellContent: this.someCellTemplate,
          headerContent: this.someHeaderTemplate,
        },
      ],
    };
  }

  handleDateClick(arg: DateClickArg) {
    console.log(arg);
  }

  handleEventClick(arg: EventClickArg) {
    console.log(arg);
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  toggleResourcesEvents() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1).toString().padStart(2, '0');

    const add = this.fullcalendar?.getApi().getResources().length === 0;

    if (add) {
      this.fullcalendar?.getApi().addResource({
        title: 'Updated Event',
        id: '1',
      });
      this.fullcalendar?.getApi().addResource({
        title: 'Updated Event 2',
        id: '2',
      });

      this.fullcalendar?.getApi().addEvent({
        title: 'Updated Event',
        start: yearMonth + '-08',
        end: yearMonth + '-10',
        resourceId: '1',
      });

      this.fullcalendar?.getApi().addEvent({
        title: 'Updated Event 2',
        start: yearMonth + '-18',
        end: yearMonth + '-20',
        resourceId: '2',
      });
    } else {
      this.fullcalendar?.getApi().getResources().forEach(resource => resource.remove());
      this.fullcalendar?.getApi().removeAllEvents();
    }
  }
}
