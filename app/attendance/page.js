"use client";
import { useState, useEffect } from 'react';

const AttendancePage = () => {
    const [attendanceCode, setAttendanceCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState('');
    const [activeMeeting, setActiveMeeting] = useState(null);
    const [fetchingMeeting, setFetchingMeeting] = useState(true);

    // Fetch active meeting when component mounts
    useEffect(() => {
        const fetchActiveMeeting = async () => {
            try {
                setFetchingMeeting(true);
                const response = await fetch('/api/meeting/active');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch active meeting');
                }
                
                const data = await response.json();
                setActiveMeeting(data.meeting || null);
            } catch (error) {
                console.error('Error fetching active meeting:', error);
                setErr('Error fetching active meeting. Please try again later.');
            } finally {
                setFetchingMeeting(false);
            }
        };

        fetchActiveMeeting();
    }, []);

    useEffect(() => {
        // Clear success message after 3 seconds
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const submitAttendance = async (e) => {
        e.preventDefault();
        
        // Validate the attendance code
        if (!attendanceCode) {
            setErr('Please enter your attendance code');
            return;
        }
        
        if (!activeMeeting) {
            setErr('No active meeting found');
            return;
        }
        
        setLoading(true);
        setErr('');
        
        try {
            const response = await fetch('/api/member/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    attendanceCode,
                    meetingId: activeMeeting._id
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            // Reset form and show success message
            setAttendanceCode('');
            setSuccess(true);
            
        } catch (error) {
            console.error('Error marking attendance:', error);
            setErr(error.message || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <form className="p-5 bg-white flex flex-col items-start gap-5 rounded-lg border-2 border-[#323232] shadow-[4px_4px_#323232] font-dongle w-full">
                <p className="font-dela-gothic-one text-[#323232] font-bold text-xl mb-4">
                    Mark Your Attendance
                </p>

                {fetchingMeeting ? (
                    <div className="w-full flex justify-center py-4">
                        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : activeMeeting ? (
                    <>
                        <div className="w-full text-center mb-2">
                            <h2 className="text-xl font-bold text-[#323232]">Current Meeting:</h2>
                            <p className="text-lg text-gray-600">{activeMeeting.title}</p>
                        </div>
                        
                        <div className="flex flex-col gap-5 w-full">
                            {/* Attendance Code Input */}
                            <input 
                                type="text" 
                                value={attendanceCode}
                                onChange={(e) => setAttendanceCode(e.target.value)}
                                placeholder="Enter Attendance Code..." 
                                className="w-full h-14 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-xl font-semibold text-[#323232] px-3 outline-none text-center"
                                maxLength={4}
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            onClick={submitAttendance}
                            disabled={loading}
                            className="w-full h-12 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-base font-semibold text-[#323232] flex items-center justify-center gap-2 hover:bg-[#212121] hover:text-white transition-all duration-250 relative overflow-hidden group disabled:opacity-70"
                        >
                            {loading ? "Processing..." : "Submit Attendance"}
                            {loading ? (
                                <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 17 5-5-5-5"></path>
                                    <path d="m13 17 5-5-5-5"></path>
                                </svg>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="w-full text-center py-6">
                        <p className="text-lg text-gray-600">No active meeting sessions currently available.</p>
                        <p className="mt-2 text-gray-500">Please check back later!</p>
                    </div>
                )}

                {/* Error Message */}
                {err && (
                    <div className='bg-rose-600 w-full p-4 text-white rounded-xl'>
                        {err}
                    </div>
                )}

                {/* Success Toast */}
                {success && (
                    <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-6 right-6 z-50" role="alert">
                        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="sr-only">Check icon</span>
                        </div>
                        <div className="ms-3 text-sm font-normal">Attendance marked successfully!</div>
                    </div>
                )}
            </form>
            
            {/* Additional info about attendance - only show when there's an active meeting */}
            {activeMeeting && (
                <div className="mt-8 text-center text-gray-600 font-dongle text-lg">
                    <p>Enter the 4-character attendance code provided to you when you joined the club.</p>
                    <p className="mt-2">This will mark your attendance for the current meeting.</p>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
