"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminAuthModal from '@/app/components/AdminAuthModal';
import Cookies from 'js-cookie';

const MeetingsForm = () => {
    // Add authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // State for new meeting creation
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    
    // State for existing meeting selection and updates
    const [existingMeetings, setExistingMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState('');
    
    // State for image uploads
    const [thumbnail, setThumbnail] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [fetchingMeetings, setFetchingMeetings] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState('');
    
    // Activation state
    const [activationMode, setActivationMode] = useState(false);
    const [isTogglingMeeting, setIsTogglingMeeting] = useState({});
    const [activationSuccess, setActivationSuccess] = useState('');

    // Function to handle meeting selection from dropdown
    const handleMeetingSelect = async (e) => {
        const id = e.target.value;
        setSelectedMeeting(id);
        
        // Clear previous thumbnails/gallery
        setThumbnailPreview('');
        setGalleryPreviews([]);
        setThumbnail(null);
        setGallery([]);
        
        // If no meeting selected, return
        if (!id) return;
    };

    // Function to handle thumbnail file selection
    const handleThumbnailChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
            
            // Create URL for preview
            const reader = new FileReader();
            reader.onload = function(fileEvent) {
                setThumbnailPreview(fileEvent.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Function to handle gallery files selection
    const handleGalleryChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setGallery(Array.from(e.target.files));
            
            // Create URLs for previews
            const previews = [];
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(fileEvent) {
                    previews.push(fileEvent.target.result);
                    if (previews.length === e.target.files.length) {
                        setGalleryPreviews([...previews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Function to submit the form (create new meeting or update existing)
    const submitForm = async (e) => {
        e.preventDefault();
        
        if (selectedMeeting) {
            // Update existing meeting with images
            await updateExistingMeeting();
        } else {
            // Create new meeting
            await createNewMeeting();
        }
    };

    // Create a new meeting with just title and description
    const createNewMeeting = async () => {
        // Validate required fields
        if (!title || !desc) {
            setErr('Title and description are required!');
            return;
        }
        
        setLoading(true);
        setErr('');
        
        try {
            const response = await fetch('/api/meeting/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    desc,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            // Reset form fields
            setTitle('');
            setDesc('');
            
            // Refresh meetings list to include the new meeting
            const meetingsResponse = await fetch('/api/meeting', { cache: 'no-store' });
            const meetingsData = await meetingsResponse.json();
            setExistingMeetings(meetingsData || []);
            
            setSuccess(true);
            
        } catch (error) {
            console.error('Error creating meeting:', error);
            setErr(error.message || 'Failed to create meeting');
        } finally {
            setLoading(false);
        }
    };

    // Update an existing meeting with images
    const updateExistingMeeting = async () => {
        console.log("=== UPDATE MEETING START ===");
        console.log("Selected Meeting:", selectedMeeting);
        console.log("Thumbnail:", thumbnail);
        console.log("Gallery length:", gallery.length);
        
        if (!selectedMeeting) {
            setErr('Please select a meeting to update');
            return;
        }
                 
        if (!thumbnail && gallery.length === 0) {
            setErr('Please select at least one image to upload');
            return;
        }
                 
        setLoading(true);
        setErr('');
                 
        try {
            // Create FormData to handle file uploads
            const formData = new FormData();
            formData.append('meetingId', selectedMeeting);
                         
            // Only append thumbnail if it exists
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
                console.log("Thumbnail appended:", thumbnail.name, thumbnail.size);
            }
                         
            // Only append gallery images if they exist
            if (gallery.length > 0) {
                gallery.forEach((file, index) => {
                    formData.append('gallery', file);
                    console.log(`Gallery[${index}] appended:`, file.name, file.size);
                });
            }
            
            console.log("FormData prepared, sending request to /api/meeting/update");
            console.log(thumbnail)
            
            const response = await fetch('/api/meeting/update', {
                method: 'POST',
                body: formData,
            });
            
            console.log("Response received:");
            console.log("Status:", response.status);
            console.log("OK:", response.ok);
                         
            const data = await response.json();
            console.log("Response data:", data);
                         
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
                         
            // Reset form fields
            setSelectedMeeting('');
            setThumbnail(null);
            setGallery([]);
            setThumbnailPreview('');
            setGalleryPreviews([]);
                         
            setSuccess(true);
            console.log("=== UPDATE MEETING SUCCESS ===");
                     
        } catch (error) {
            console.error('=== UPDATE MEETING ERROR ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            setErr(error.message || 'Failed to update meeting');
        } finally {
            setLoading(false);
        }
    };

    // Toggle meeting active status
    const toggleMeetingActive = async (meetingId) => {
        try {
            setIsTogglingMeeting(prev => ({ ...prev, [meetingId]: true }));
            
            const response = await fetch('/api/meeting/toggle-active', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle meeting status');
            }
            
            // Update meetings in state
            setExistingMeetings(existingMeetings.map(meeting => 
                meeting._id === meetingId 
                    ? { ...meeting, active: !meeting.active } 
                    : meeting.active && data.meeting.active && meeting._id !== meetingId
                        ? { ...meeting, active: false } 
                        : meeting
            ));
            
            setActivationSuccess(data.message);
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setActivationSuccess('');
            }, 3000);
            
        } catch (error) {
            console.error('Error toggling meeting status:', error);
            toast.error('Failed to toggle meeting status');
        } finally {
            setIsTogglingMeeting(prev => ({ ...prev, [meetingId]: false }));
        }
    };

    // Function to send certificates for a meeting
    const sendCertificates = async (meetingId) => {
        try {
            const response = await fetch(`/api/meeting/certificates/${meetingId}`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send certificates');
            }
            
            // Update the local state to reflect the change
            setExistingMeetings(existingMeetings.map(meeting => 
                meeting._id === meetingId 
                    ? { ...meeting, certificates: true } 
                    : meeting
            ));
            
            // Show success message
            toast.success('Certificates sent successfully!');
        } catch (error) {
            console.error('Error sending certificates:', error);
            toast.error(error.message || 'Failed to send certificates');
        }
    };

    // Add authentication check
    useEffect(() => {
        const checkAuth = () => {
            const isAuth = Cookies.get('adminAuthenticated');
            const authExpiry = localStorage.getItem('adminAuthExpires');
            
            // Check if auth exists and hasn't expired
            if (isAuth === 'true' && authExpiry && new Date().getTime() < parseInt(authExpiry)) {
                setIsAuthenticated(true);
            } else {
                // Clear expired auth data
                Cookies.remove('adminAuthenticated');
                localStorage.removeItem('adminAuthExpires');
                setShowAuthModal(true);
            }
            
            setIsAuthChecking(false);
        };

        checkAuth();
    }, []);

    // Handle successful authentication
    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
    };

    // Fetch existing meetings
    useEffect(() => {
        const fetchMeetings = async () => {
            if (isAuthenticated) {
                try {
                    setFetchingMeetings(true);
                    const response = await fetch('/api/meeting', { cache: 'no-store' });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch meetings');
                    }
                    
                    const data = await response.json();
                    setExistingMeetings(data);
                } catch (error) {
                    console.error('Error fetching meetings:', error);
                    toast.error('Failed to fetch meetings');
                } finally {
                    setFetchingMeetings(false);
                }
            }
        };
        
        fetchMeetings();
    }, [isAuthenticated]);

    // Show loading spinner while checking authentication
    if (isAuthChecking) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <>
            {/* Show auth modal if not authenticated */}
            {showAuthModal && <AdminAuthModal onSuccess={handleAuthSuccess} />}

            {/* Only show content if authenticated */}
            {isAuthenticated && (
                <div className="p-6">
                    <form className="p-5 bg-white flex flex-col items-start gap-5 rounded-lg border-2 border-[#323232] shadow-[4px_4px_#323232] font-dongle w-full">
                        <h2 className="font-dela-gothic-one text-[#323232] font-bold text-xl mb-4">
                            Manage Meetings
                        </h2>

                        {/* Option to select existing meeting or create new one */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold text-[#323232]">
                                Choose an action:
                            </label>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id="create-new" 
                                        checked={!selectedMeeting && !activationMode} 
                                        onChange={() => {
                                            setSelectedMeeting('');
                                            setActivationMode(false);
                                        }}
                                        className="mr-2" 
                                    />
                                    <label htmlFor="create-new">Create New Meeting</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id="update-existing" 
                                        checked={!!selectedMeeting && !activationMode} 
                                        onChange={() => {
                                            setSelectedMeeting(existingMeetings[0]?._id || '');
                                            setActivationMode(false);
                                        }}
                                        className="mr-2" 
                                        disabled={existingMeetings.length === 0}
                                    />
                                    <label htmlFor="update-existing">Update Existing Meeting</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id="activate-meetings" 
                                        checked={activationMode} 
                                        onChange={() => {
                                            setSelectedMeeting('');
                                            setActivationMode(true);
                                        }}
                                        className="mr-2" 
                                        disabled={existingMeetings.length === 0}
                                    />
                                    <label htmlFor="activate-meetings">Activate/Deactivate Meetings</label>
                                </div>
                            </div>
                        </div>

                        {/* Create New Meeting Form */}
                        {!selectedMeeting && !activationMode && (
                            <div className="flex flex-col gap-5 w-full">
                                <h3 className="font-bold text-[#323232] text-lg">Create New Meeting</h3>
                                
                                {/* Title Input */}
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Meeting Title" 
                                    className="w-full h-10 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-base font-semibold text-[#323232] px-3 outline-none"
                                />

                                {/* Description Textarea */}
                                <textarea 
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder="Meeting Description"
                                    className="w-full h-32 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-base font-semibold text-[#323232] p-3 outline-none resize-none"
                                />
                                
                                <p className="text-gray-500 italic">
                                    After creating the meeting, you can select it from the dropdown to add images.
                                </p>
                            </div>
                        )}

                        {/* Update Existing Meeting Form */}
                        {selectedMeeting && !activationMode && (
                            <div className="flex flex-col gap-5 w-full">
                                <h3 className="font-bold text-[#323232] text-lg">Update Existing Meeting</h3>
                                
                                {/* Meeting Selection Dropdown */}
                                <div className="w-full">
                                    <label className="block mb-2 font-bold text-[#323232]">
                                        Select Meeting:
                                    </label>
                                    <select 
                                        value={selectedMeeting}
                                        onChange={handleMeetingSelect}
                                        className="w-full h-10 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-base font-semibold text-[#323232] px-3 outline-none"
                                    >
                                        <option value="">-- Select a meeting --</option>
                                        {existingMeetings.map(meeting => (
                                            <option key={meeting._id} value={meeting._id}>
                                                {meeting.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Thumbnail Image Upload */}
                                <div className="w-full">
                                    <h3 className="font-bold text-[#323232] text-base mb-2">Thumbnail Image</h3>
                                    <div className="flex flex-col gap-3 w-full">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="w-full file:mr-4 file:py-2 pb-4 file:px-4 file:rounded-md file:border-2 file:border-[#323232] file:bg-white file:shadow-[4px_4px_#323232] file:text-base file:font-semibold file:text-[#323232] hover:file:bg-gray-50"
                                        />
                                        {thumbnailPreview && (
                                            <div className="w-full relative">
                                                <img 
                                                    src={thumbnailPreview} 
                                                    alt="Thumbnail preview" 
                                                    className="w-full h-64 object-cover rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery Images Upload */}
                                <div className="w-full">
                                    <h3 className="font-bold text-[#323232] text-base mb-2">Gallery Images</h3>
                                    <div className="flex flex-col gap-3 w-full">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="w-full file:mr-4 pb-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-[#323232] file:bg-white file:shadow-[4px_4px_#323232] file:text-base file:font-semibold file:text-[#323232] hover:file:bg-gray-50"
                                        />
                                        {galleryPreviews.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                                                {galleryPreviews.map((preview, index) => (
                                                    <div key={index} className="aspect-square relative">
                                                        <img 
                                                            src={preview} 
                                                            alt={`Gallery preview ${index + 1}`} 
                                                            className="w-full h-full object-cover rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232]"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Activate/Deactivate Meetings */}
                        {activationMode && (
                            <div className="flex flex-col gap-5 w-full">
                                <h3 className="font-bold text-[#323232] text-lg">Activate/Deactivate Meetings</h3>
                                
                                {fetchingMeetings ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                ) : existingMeetings.length === 0 ? (
                                    <p className="text-gray-500 py-8 text-center">No meetings found. Create a meeting first.</p>
                                ) : (
                                    <div className="overflow-x-auto w-full">
                                        <table className="min-w-full border-2 border-[#323232]">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left border-b-2 border-[#323232]">Meeting Title</th>
                                                    <th className="px-4 py-2 text-left border-b-2 border-[#323232]">Status</th>
                                                    <th className="px-4 py-2 text-left border-b-2 border-[#323232]">Participants</th>
                                                    <th className="px-4 py-2 text-left border-b-2 border-[#323232]">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {existingMeetings.map(meeting => (
                                                    <tr key={meeting._id} className="border-b border-gray-200">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                {meeting.thumbnail && (
                                                                    <img 
                                                                        src={meeting.thumbnail} 
                                                                        alt={meeting.title}
                                                                        className="w-10 h-10 rounded object-cover" 
                                                                    />
                                                                )}
                                                                <span className="font-bold">{meeting.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                                meeting.active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {meeting.active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {typeof meeting.membersParticipated === 'number' 
                                                                ? meeting.membersParticipated 
                                                                : meeting.membersParticipated?.length || 0} members
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => toggleMeetingActive(meeting._id)}
                                                                disabled={isTogglingMeeting[meeting._id]}
                                                                className={`px-4 py-2 rounded-lg text-white ${
                                                                    meeting.active
                                                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                                                        : 'bg-green-500 hover:bg-green-600'
                                                                } disabled:opacity-50 flex items-center gap-2`}
                                                            >
                                                                {isTogglingMeeting[meeting._id] ? (
                                                                    <>
                                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {meeting.active ? 'Deactivate' : 'Activate'}
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <p className="text-sm text-gray-500 mt-4">
                                            Note: Only one meeting can be active at a time. Activating a meeting will automatically deactivate any other active meetings.
                                        </p>
                                    </div>
                                )}
                                
                                {/* Success message for activation/deactivation */}
                                {activationSuccess && (
                                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                                        <p>{activationSuccess}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button - only show for create/update modes */}
                        {!activationMode && (
                            <button 
                                onClick={submitForm}
                                disabled={loading || (!selectedMeeting && (!title || !desc)) || (selectedMeeting && !thumbnail && gallery.length === 0)}
                                className="w-full h-12 rounded-md border-2 border-[#323232] bg-white shadow-[4px_4px_#323232] text-base font-semibold text-[#323232] flex items-center justify-center gap-2 hover:bg-[#212121] hover:text-white transition-all duration-250 relative overflow-hidden group disabled:opacity-70"
                            >
                                {loading ? "Processing..." : (selectedMeeting ? "Update Meeting" : "Create Meeting")}
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
                                <div className="ms-3 text-sm font-normal">
                                    {selectedMeeting ? "Meeting updated successfully." : "Meeting created successfully."}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default MeetingsForm;
