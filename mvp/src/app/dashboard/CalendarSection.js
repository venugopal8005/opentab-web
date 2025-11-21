// src/components/CalendarSection.jsx
'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const Colors = {
    bgCalendar: 'bg-[#000000]', 
    bgModal: 'bg-[#1A1A2E]', 
    selectedDayBg: 'bg-[#7B59A6]', 
    accentPurple: 'bg-[#7B59A6]', 
    textDefault: 'text-white',
    textMuted: 'text-[#8A8A9E]',
    border: 'border-[#2A2A3E]',
    inputBg: 'bg-[#000000]', 
    bgOverlay: 'bg-black/80',
    cancelButtonBg: 'bg-[#2A2A3E]',
    doneButtonBg: 'bg-[#7B59A6]',
    eventBg: 'bg-[#7B59A6]', 
    addEventBg: 'bg-[#7B59A6]',
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getSortableTime = (timeString) => {
    if (!timeString || timeString.length < 4) return 0;
    const [hourStr, minuteStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    return (hour * 100) + minute;
};

const getInitialDateString = (day, month, year) => {
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    const monthStr = String(monthIndex).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
};

const getEndTime = (startTime) => {
    const [hourStr, minuteStr] = startTime.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);   
    hour = (hour + 1) % 24;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const EventItem = ({ children, time, date }) => (
    <div className={`flex justify-between items-center text-sm ${Colors.textDefault} font-medium ${Colors.eventBg} rounded-md p-1.5`}>
        <span className="text-xs">{children}</span>
        <span className={`font-semibold text-xs bg-black/30 px-1.5 py-0.5 rounded`}>{date} - {time}</span>
    </div>
);

function EventModal({ isOpen, onClose, onSave, selectedDay, currentMonth }) {
    const todayDateString = getInitialDateString(selectedDay, currentMonth.month, currentMonth.year);
    const defaultStartTime = "19:00";
    const [title, setTitle] = useState("Unnamed event");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState(todayDateString); 
    const [startTime, setStartTime] = useState(defaultStartTime); 
    const [endDate, setEndDate] = useState(todayDateString);
    const [endTime, setEndTime] = useState(getEndTime(defaultStartTime));
    
    useEffect(() => {
        const newDateString = getInitialDateString(selectedDay, currentMonth.month, currentMonth.year);
        setStartDate(newDateString);
        setEndDate(newDateString);
    }, [selectedDay, currentMonth, isOpen]);
    
    useEffect(() => {
        setEndTime(getEndTime(startTime));
    }, [startTime]);

    if (!isOpen) return null;

    const staticEvent = { category: "Personal" };

    const handleDone = () => {
        const dayNumber = new Date(startDate).getDate(); 
        const newEvent = {
            text: title,
            location: location,
            startDate: startDate,
            startTime: startTime, 
            endDate: endDate,
            endTime: endTime,
            time: startTime,
            date: dayNumber,
            month: currentMonth.month,
        };
        onSave(newEvent);
        setTitle("Unnamed event");
        setLocation("");
        setStartTime(defaultStartTime);
        setEndTime(getEndTime(defaultStartTime));
        onClose();
    };

    const ModalHeader = ({ onClose, onDone }) => (
        <div className={`flex items-center justify-between p-3 ${Colors.border} border-b`}>
            <button onClick={onClose} className={`text-sm font-medium ${Colors.textDefault} px-3 py-1 rounded-md ${Colors.cancelButtonBg} hover:opacity-80 transition-colors`}>
                Cancel
            </button>
            <div className={`text-sm font-semibold ${Colors.textDefault}`}>
                <span style={{ background: Colors.accentPurple.replace('bg-', '#') }} className="inline-block h-2 w-2 rounded-full mr-2"></span>
                {staticEvent.category}
            </div>
            <button onClick={onDone} className={`text-sm font-medium ${Colors.textDefault} px-3 py-1 rounded-md ${Colors.doneButtonBg} hover:opacity-90 transition-colors`}>
                Done
            </button>
        </div>
    );

    const InputField = ({ label, value, onChange, placeholder, isLarge, icon }) => (
        <div className="flex items-center">
            <span className={`font-medium ${Colors.textMuted} w-16 ${isLarge ? 'text-lg' : 'text-sm'}`}>{label}</span>
            <div className={`flex items-center flex-1 justify-between px-3 py-2 rounded-md ${Colors.inputBg}`}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`flex-1 ${isLarge ? 'text-lg' : 'text-sm'} bg-transparent outline-none ${Colors.textDefault} placeholder:${Colors.textMuted}`}
                />
                {icon && <span className={`text-base ${Colors.textMuted}`}>{icon}</span>}
            </div>
        </div>
    );

    const TitleLocationSection = () => (
        <div className={`p-4 space-y-4 ${Colors.border} border-b`}>
            <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} isLarge />
            <InputField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add location" icon="📍" />
        </div>
    );

    const DateTimePicker = ({ label, dateValue, onDateChange, timeValue, onTimeChange }) => (
        <div className={`flex justify-between items-center py-2`}>
            <span className={`text-sm ${Colors.textMuted}`}>{label}</span>
            <div className="flex items-center space-x-4">
                <input type="date" value={dateValue} onChange={onDateChange} className={`text-sm ${Colors.textDefault} bg-transparent outline-none border-b border-gray-700 focus:border-white transition-colors p-1 rounded-md ${Colors.inputBg}`} />
                <input type="time" value={timeValue} onChange={onTimeChange} className={`text-sm ${Colors.textDefault} bg-transparent outline-none border-b border-gray-700 focus:border-white transition-colors p-1 rounded-md ${Colors.inputBg}`} />
            </div>
        </div>
    );

    const ScheduleSection = () => (
        <div className="p-4 space-y-2">
            <h3 className={`text-sm font-semibold ${Colors.textMuted} mb-2`}>Schedule</h3>
            <div className="flex justify-between items-center py-2">
                <span className={`text-sm ${Colors.textMuted}`}>All Day</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={false} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#404040] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B59A6]"></div>
                </label>
            </div>
            <DateTimePicker label="Starts" dateValue={startDate} onDateChange={(e) => setStartDate(e.target.value)} timeValue={startTime} onTimeChange={(e) => setStartTime(e.target.value)} />
            <DateTimePicker label="Ends" dateValue={endDate} onDateChange={(e) => setEndDate(e.target.value)} timeValue={endTime} onTimeChange={(e) => setEndTime(e.target.value)} />
            <div className={`flex justify-between items-center py-2`}>
                <span className={`text-sm ${Colors.textMuted}`}>Repeat</span>
                <div className={`flex items-center px-3 py-1 rounded-md ${Colors.inputBg}`}>
                    <span className={`text-sm ${Colors.textDefault} mr-2`}>No Repeat</span>
                    <span className={`text-sm ${Colors.textMuted}`}>▼</span>
                </div>
            </div>
        </div>
    );

    const RemindersNotesSection = () => (
        <div className={`p-4 space-y-4 ${Colors.border} border-t`}>
            <h3 className={`text-sm font-semibold ${Colors.textMuted}`}>Reminders</h3>
            <button className={`w-full py-2 rounded-md text-sm ${Colors.accentPurple} ${Colors.textDefault} border ${Colors.border.replace('border-', 'border-')} hover:opacity-90`}>
                Add a Reminder...
            </button>
            <h3 className={`text-sm font-semibold ${Colors.textMuted}`}>Notes</h3>
            <textarea rows="3" placeholder="Add notes..." className={`w-full p-2 rounded-md ${Colors.inputBg} ${Colors.textDefault} placeholder:${Colors.textMuted} text-sm resize-none outline-none`}></textarea>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${Colors.bgOverlay} backdrop-blur-sm transition-opacity`}>
            <div className={`w-[450px] rounded-xl overflow-hidden shadow-2xl ${Colors.bgModal}`}>
                <ModalHeader onClose={onClose} onDone={handleDone} />
                <TitleLocationSection />
                <ScheduleSection />
                <RemindersNotesSection />
            </div>
        </div>
    );
}

export default function CalendarSection() {
    const [activeView, setActiveView] = useState('Day');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(9);
    const [userEvents, setUserEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState({ month: 'September', year: 2025 });

    const goToPreviousMonth = () => {
        let monthIndex = monthNames.indexOf(currentMonth.month);
        let year = currentMonth.year;
        monthIndex -= 1;
        if (monthIndex < 0) {
            monthIndex = 11;
            year -= 1;
        }
        setCurrentMonth({ month: monthNames[monthIndex], year });
    };

    const goToNextMonth = () => {
        let monthIndex = monthNames.indexOf(currentMonth.month);
        let year = currentMonth.year;
        monthIndex += 1;
        if (monthIndex > 11) {
            monthIndex = 0;
            year += 1;
        }
        setCurrentMonth({ month: monthNames[monthIndex], year });
    };

    const daysInMonth = useMemo(() => {
        const monthIndex = monthNames.indexOf(currentMonth.month);
        return new Date(currentMonth.year, monthIndex + 1, 0).getDate();
    }, [currentMonth]);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendarDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    useEffect(() => {
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [daysInMonth, selectedDay]);

    const handleAddEvent = useCallback((newEvent) => {
        setUserEvents(prevEvents => [
            ...prevEvents, 
            {
                ...newEvent,
                sorted: getSortableTime(newEvent.startTime), 
                viewTags: ['Day', 'Week', 'Month'], 
            }
        ]);
    }, []);

    const eventsToDisplay = useMemo(() => {
        return userEvents
            .filter(event => {
                if (!event.viewTags.includes(activeView)) return false;
                if (activeView === 'Day') return event.date === selectedDay; 
                return true;
            }) 
            .sort((a, b) => {
                // For Day view: sort by time only
                if (activeView === 'Day') {
                    return a.sorted - b.sorted;
                }
                // For Week/Month views: sort by day first, then by time
                return a.date - b.date || a.sorted - b.sorted;
            });
    }, [activeView, userEvents, selectedDay]);

    const handleDayClick = (date) => {
        setSelectedDay(date);
        setActiveView('Day');
    };

    const EventListSection = () => {
        const scrollbarHide = 'scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';
        
        return (
            <>
                <div className={`text-xs ${Colors.textDefault} font-semibold uppercase mb-1`}>
                    {activeView === 'Day' && `${currentMonth.month.toUpperCase().slice(0, 3)} ${selectedDay}`}
                    {activeView === 'Week' && `WEEK OF ${selectedDay} ${currentMonth.month.toUpperCase().slice(0, 3)}`}
                    {activeView === 'Month' && `${currentMonth.month.toUpperCase()} ${currentMonth.year}`}
                </div>
                
                <div className={`space-y-1 overflow-y-auto min-h-[78px] max-h-[78px] pr-2 ${scrollbarHide}`}> 
                    {eventsToDisplay.map((event, index) => (
                        <EventItem key={index} time={event.startTime} date={event.date}>
                            {event.text}
                        </EventItem>
                    ))}
                    {eventsToDisplay.length === 0 && (
                        <div className="h-[78px] flex items-center justify-center">
                            <p className={`${Colors.textMuted} text-sm text-center`}>
                                No events found
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="mt-1">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full py-2 rounded-lg ${Colors.addEventBg} ${Colors.textDefault} text-xs font-medium hover:opacity-90 transition-opacity`}
                    >
                        Add New Event...
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className={`w-[380px] p-4 ${Colors.bgCalendar} rounded-lg shadow-2xl`}>
                <div className='flex items-center justify-between text-white text-base font-semibold mb-2 px-1'>
                    <span className={`cursor-pointer text-xl text-[#6A96ED]`} onClick={goToPreviousMonth}>◀</span>
                    <div className="flex space-x-1">
                        <span className="font-light">{currentMonth.month}</span>
                        <span className="font-light">{currentMonth.year}</span>
                    </div>
                    <span className={`cursor-pointer text-xl text-[#6A96ED]`} onClick={goToNextMonth}>▶</span>
                </div>
                <div className='grid grid-cols-7 text-center text-sm gap-1 mb-2'>
                    {dayLabels.map(day => (<div key={day} className={`font-normal text-white`}>{day}</div>))}
                </div>
                <div className='grid grid-cols-7 text-sm gap-1'>
                    {calendarDays.map(date => {
                        const isSelectedDay = date === selectedDay;
                        const dayClasses = `h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors font-medium ${isSelectedDay ? Colors.selectedDayBg : 'text-white hover:bg-[#1A1A2E]'}`;
                        return (
                            <div key={date} className="flex justify-center items-center">
                                <div className={dayClasses} onClick={() => handleDayClick(date)}>
                                    {date}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between items-center space-x-2 my-2">
                    {['Day', 'Week', 'Month'].map(view => (
                        <button key={view} className={`flex-1 px-4 py-1 rounded-md font-semibold text-sm text-center cursor-pointer transition-colors`} onClick={() => setActiveView(view)} style={activeView === view ? { background: Colors.accentPurple.replace('bg-', '#'), color: '#fff' } : { background: '#181828', color: '#fff' }}>
                            {view}
                        </button>
                    ))}
                </div>
                <EventListSection />
            </div>
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddEvent} selectedDay={selectedDay} currentMonth={currentMonth} />
        </>
    );
}
