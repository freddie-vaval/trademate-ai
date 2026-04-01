'use client';

import { useState } from 'react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 14));
  const [jobs, setJobs] = useState([
    { id: 1, time: '09:00', endTime: '10:00', customer: 'John Smith', service: 'Boiler Service', address: '42 Oak Street', day: 14, color: '#3b82f6' },
    { id: 2, time: '10:30', endTime: '11:30', customer: 'Sarah Jones', service: 'Plumbing Repair', address: '15 Maple Ave', day: 14, color: '#22c55e' },
    { id: 3, time: '13:00', endTime: '14:00', customer: 'Mike Brown', service: 'Gas Safety', address: '8 Pine Road', day: 15, color: '#9333ea' },
    { id: 4, time: '14:30', endTime: '16:00', customer: 'Emma Wilson', service: 'New Radiator', address: '23 Cedar Lane', day: 16, color: '#f97316' },
    { id: 5, time: '16:30', endTime: '17:30', customer: 'David Lee', service: 'Boiler Repair', address: '67 Birch Way', day: 17, color: '#ef4444' },
  ]);

  const hours = Array.from({ length: 10 }, (_, i) => i + 8);

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const isToday = (date: Date) => {
    const today = new Date(2026, 2, 14);
    return date.toDateString() === today.toDateString();
  };

  const getJobAt = (day: number, hour: number) => {
    return jobs.find(job => job.day === day && parseInt(job.time.split(':')[0]) === hour);
  };

  const handleDragStart = (e: React.DragEvent, jobId: number) => {
    e.dataTransfer.setData('jobId', jobId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const jobId = parseInt(e.dataTransfer.getData('jobId'));
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, day } : job
    ));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <a href="/" style={{ display: 'inline-block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#2563eb' }}>← Dashboard</a>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Schedule</h1>
            <p style={{ color: '#6b7280' }}>Drag jobs to reschedule</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
              style={{ padding: '0.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              ←
            </button>
            <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>
              {weekDays[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
              style={{ padding: '0.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              →
            </button>
            <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
              + Add Job
            </button>
          </div>
        </div>

        {/* Week View */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Time</div>
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  borderLeft: '1px solid #e5e7eb',
                  backgroundColor: isToday(day) ? '#eff6ff' : 'transparent'
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{day.toLocaleDateString('en-GB', { weekday: 'short' })}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isToday(day) ? '#2563eb' : '#111827' }}>
                  {day.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div>
            {hours.map((hour) => (
              <div key={hour} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', borderRight: '1px solid #e5e7eb' }}>
                  {hour}:00
                </div>
                {weekDays.map((day, dayIndex) => {
                  const job = isToday(day) ? getJobAt(day.getDate(), hour) : null;
                  return (
                    <div 
                      key={`${hour}-${dayIndex}`} 
                      style={{ 
                        minHeight: '60px', 
                        borderLeft: '1px solid #e5e7eb', 
                        padding: '0.25rem',
                        backgroundColor: isToday(day) ? '#eff6ff' : 'transparent'
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day.getDate())}
                    >
                      {job && (
                        <div 
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          style={{ 
                            backgroundColor: job.color + '20', 
                            borderLeft: `4px solid ${job.color}`, 
                            padding: '0.5rem', 
                            borderRadius: '0.25rem', 
                            fontSize: '0.75rem',
                            cursor: 'grab'
                          }}
                        >
                          <p style={{ fontWeight: '500', color: '#111827' }}>{job.customer}</p>
                          <p style={{ color: '#6b7280' }}>{job.time} - {job.service}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Jobs List */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>This Week's Jobs</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {jobs.map((job) => (
              <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <p style={{ fontWeight: 'bold', color: '#111827' }}>{job.time}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.endTime}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '500' }}>{job.customer}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.service} • {job.address}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
                    Start
                  </button>
                  <button style={{ padding: '0.25rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Jobs This Week</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{jobs.length}</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Revenue This Week</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>£4,280</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Hours Booked</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>32h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
