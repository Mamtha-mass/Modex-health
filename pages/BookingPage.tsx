import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MockApi } from '../services/mockDb';
import { DoctorSession, Booking } from '../types';
import { Button } from '../components/Button';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshSessions } = useAppContext();
  
  const [session, setSession] = useState<DoctorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Booking | null>(null);

  // Poll for updates every 5 seconds to simulate live data
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchSession = async () => {
      if (!id) return;
      try {
        const data = await MockApi.getSessionById(id);
        if (data) {
          setSession(data);
        } else {
          setError("Session not found");
        }
      } catch (err) {
        setError("Failed to load session details");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    interval = setInterval(fetchSession, 5000); 

    return () => clearInterval(interval);
  }, [id]);

  const bookedTokenIds = useMemo(() => {
    if (!session) return new Set();
    const ids = new Set<string>();
    session.bookings.forEach(booking => {
      booking.tokenIds.forEach(tokenId => ids.add(tokenId));
    });
    return ids;
  }, [session]);

  const handleTokenClick = (tokenId: string) => {
    if (bookedTokenIds.has(tokenId)) return;
    
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(prev => prev.filter(id => id !== tokenId));
    } else {
      // In medical context, usually 1 patient books 1 slot, but we allow family booking (e.g. 2)
      if (selectedTokens.length >= 3) {
        alert("You can book max 3 tokens at once.");
        return;
      }
      setSelectedTokens(prev => [...prev, tokenId]);
    }
  };

  const handleBooking = async () => {
    if (!session || selectedTokens.length === 0) return;
    
    setProcessing(true);
    setError(null);

    try {
      const result = await MockApi.bookTokens(session.id, selectedTokens, user.id);
      
      if (result.success && result.booking) {
        setSuccess(result.booking);
        setSelectedTokens([]);
        await refreshSessions(); 
        const updatedSession = await MockApi.getSessionById(session.id);
        if (updatedSession) setSession(updatedSession);
      } else {
        setError(result.error || "Booking failed due to concurrent update.");
        const updatedSession = await MockApi.getSessionById(session.id);
        if (updatedSession) setSession(updatedSession);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return <div className="text-center mt-20 text-xl">Session not found. <Button onClick={() => navigate('/')}>Return to Directory</Button></div>;
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-10 shadow-lg border border-teal-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-6">
            <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You are queued for <span className="font-semibold text-teal-700">{session.doctorName}</span>. 
            <br/>Your queue token numbers are:
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {success.tokenIds.map(id => (
              <span key={id} className="bg-teal-600 text-white text-2xl font-bold h-16 w-16 flex items-center justify-center rounded-xl shadow-md">
                {id}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400 mb-8">
            Booking Ref: #{success.id}
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
            <Button onClick={() => { setSuccess(null); navigate('/'); }}>Book Another</Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate tokens (1 to maxPatients)
  const tokens = Array.from({ length: session.maxPatients }, (_, i) => {
    const tokenId = (i + 1).toString();
    return { id: tokenId, isBooked: bookedTokenIds.has(tokenId) };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        
        {/* Doctor Info Card */}
        <div className="lg:col-span-4 mb-8 lg:mb-0">
          <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center text-2xl border border-teal-100">
                👨‍⚕️
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{session.doctorName}</h2>
                <span className="text-sm font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{session.specialty}</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center text-gray-600">
                 <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div className="border-t border-gray-100 py-4 bg-gray-50 -mx-6 px-6 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Fee per patient</span>
                <span className="font-semibold text-gray-900">${session.consultationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-teal-700">
                <span>Total Due</span>
                <span>${(selectedTokens.length * session.consultationFee).toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {error}
              </div>
            )}

            <Button 
              className="w-full py-3 text-lg shadow-md hover:shadow-lg transition-shadow" 
              onClick={handleBooking} 
              disabled={selectedTokens.length === 0 || processing}
              isLoading={processing}
            >
              {processing ? 'Confirming...' : 'Secure Appointment'}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-3">
              No payment required for demo.
            </p>
          </div>
        </div>

        {/* Token Layout */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              Select Your Queue Position
              <span className="ml-3 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Lower numbers are seen earlier
              </span>
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {tokens.map((token) => {
                const isSelected = selectedTokens.includes(token.id);
                let btnClass = "relative h-14 w-full rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 ";
                
                if (token.isBooked) {
                  btnClass += "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200";
                } else if (isSelected) {
                  btnClass += "bg-teal-600 text-white shadow-lg ring-2 ring-offset-2 ring-teal-500 transform -translate-y-1";
                } else {
                  btnClass += "bg-white border-2 border-teal-100 text-teal-600 hover:border-teal-400 hover:bg-teal-50 cursor-pointer";
                }

                return (
                  <button
                    key={token.id}
                    onClick={() => handleTokenClick(token.id)}
                    disabled={token.isBooked}
                    className={btnClass}
                  >
                    {token.id}
                    {isSelected && (
                       <span className="absolute -top-2 -right-2 h-5 w-5 bg-teal-800 rounded-full flex items-center justify-center">
                         <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                         </svg>
                       </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 border-t border-gray-100 pt-6">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-teal-100 rounded-lg bg-white mr-3"></div>
                  <span className="text-sm font-medium text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-teal-600 rounded-lg mr-3 shadow-md"></div>
                  <span className="text-sm font-medium text-gray-600">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg mr-3 border border-gray-200"></div>
                  <span className="text-sm font-medium text-gray-600">Already Taken</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};