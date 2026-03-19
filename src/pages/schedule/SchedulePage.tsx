import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // <--- New Plugin for Week/Day view
import interactionPlugin from '@fullcalendar/interaction';

// TypeScript Interface
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
}

const SchedulePage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
   
  ]);

  const handleDateSelect = (selectInfo: any) => {
    let title = prompt('Meeting ka title likhein:');
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); 

    if (title) {
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: '#3b82f6'
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meeting Scheduling</h1>
        <p className="text-sm text-gray-500">Manage your availability for Milestone 2</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 nexus-calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // <--- Updated Buttons
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          height="70vh" // <--- Fixed height taake week view collapse na ho
          slotMinTime="08:00:00" // Business hours start
          slotMaxTime="20:00:00" // Business hours end
          allDaySlot={false}
          eventColor="#3b82f6"
          /* Custom CSS to fix the "White" look */
          contentHeight="auto"
        />
      </div>

      {/* Manual CSS fix for Week View Grid */}
      <style>{`
        .fc .fc-timegrid-slot {
          height: 3em !important; 
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid #e5e7eb !important;
        }
        .fc .fc-col-header-cell-cushion {
          padding: 8px 0;
          color: #374151;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;