import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MockApi } from '../services/mockDb';
import { Navigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user, refreshSessions, sessions } = useAppContext();
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    maxPatients: 20,
    consultationFee: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.doctorName || !formData.date || !formData.time || !formData.specialty) {
        throw new Error("Please fill in all required fields.");
      }

      const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();

      await MockApi.createSession({
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        startTime,
        maxPatients: Number(formData.maxPatients),
        consultationFee: Number(formData.consultationFee)
      });

      setSuccess("Session scheduled successfully!");
      setFormData({ doctorName: '', specialty: '', date: '', time: '', maxPatients: 20, consultationFee: 50 });
      await refreshSessions();
    } catch (err: any) {
      setError(err.message || "Failed to create session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:grid md:grid-cols-3 md:gap-8">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-xl font-bold leading-6 text-gray-900">Schedule Doctor</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create a new appointment session for a doctor. Set the capacity to manage the patient queue.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow-sm ring-1 ring-gray-200 sm:rounded-xl overflow-hidden">
              <div className="px-4 py-6 bg-white space-y-6 sm:p-8">
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Doctor Name"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Strange"
                    required
                  />
                  <Input
                    label="Specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Max Queue (Tokens)"
                    name="maxPatients"
                    type="number"
                    min="1"
                    value={formData.maxPatients}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Consultation Fee ($)"
                    name="consultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                <Button type="submit" isLoading={isSubmitting}>
                  Publish Schedule
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Sessions</h3>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Specialty
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {session.doctorName}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
                            {session.specialty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.bookings.reduce((acc, b) => acc + b.tokenIds.length, 0)} / {session.maxPatients} patients
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
