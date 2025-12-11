import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  const { sessions, isLoadingSessions } = useAppContext();

  if (isLoadingSessions) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-16">
        <span className="text-teal-600 font-semibold tracking-wide uppercase text-sm">Health & Wellness</span>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Find Your Specialist
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
          Book appointments with top doctors instantly. Skip the waiting room by securing your queue token online.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No appointments available.</p>
          <Link to="/admin" className="mt-2 inline-block text-teal-600 hover:text-teal-700 font-medium">
            Admin: Schedule a doctor &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const bookedCount = session.bookings.reduce((acc, booking) => acc + booking.tokenIds.length, 0);
            const availableTokens = session.maxPatients - bookedCount;
            const isFull = availableTokens === 0;

            return (
              <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {session.specialty}
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-gray-900 font-bold text-lg">${session.consultationFee}</span>
                       <span className="text-gray-400 text-xs">Consultation</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      👨‍⚕️
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                        {session.doctorName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4 text-sm">
                       <span className={`flex items-center ${isFull ? 'text-red-500' : 'text-emerald-600'}`}>
                         <span className={`h-2 w-2 rounded-full mr-2 ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                         {isFull ? 'Fully Booked' : `${availableTokens} slots available`}
                       </span>
                    </div>

                    <Link to={`/booking/${session.id}`} className="block">
                      <Button className={`w-full ${isFull ? 'opacity-50' : ''}`} disabled={isFull} variant={isFull ? 'secondary' : 'primary'}>
                        {isFull ? 'Waitlist Full' : 'Book Appointment'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
