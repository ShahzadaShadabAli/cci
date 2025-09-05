"use client"
import { TeamCard } from '@/components/TeamCard'
import React, {useState, useEffect} from 'react'
import { useAdminAuth } from '../utils/adminAuth'
import AdminAuthModal from '../components/AdminAuthModal'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

const page = () => {
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({ open: false, member: null })
    const [success, setSuccess] = useState("")
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false)
    const [pointsSuccess, setPointsSuccess] = useState("")
    const [isDeletingMember, setIsDeletingMember] = useState(false)
    const { isAuthenticated, isLoading: authLoading, handleAuthSuccess } = useAdminAuth()
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    
    // Meetings state
    const [meetings, setMeetings] = useState([])
    const [meetingsTabActive, setMeetingsTabActive] = useState(false)
    const [isTogglingMeeting, setIsTogglingMeeting] = useState({})
    const [meetingSuccess, setMeetingSuccess] = useState("")

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true)
            const response = await fetch('/api/member', { cache: 'no-store' })
            const data = await response.json()
            setMembers(data)
            setIsLoading(false)
            console.log(data)
        }
        fetchMembers()
    }, [])

    // Fetch meetings
    useEffect(() => {
        const fetchMeetings = async () => {
            if (meetingsTabActive && isAuthenticated) {
                try {
                    const response = await fetch('/api/meeting', { cache: 'no-store' })
                    const data = await response.json()
                    setMeetings(data)
                } catch (error) {
                    console.error('Error fetching meetings:', error)
                }
            }
        }
        
        fetchMeetings()
    }, [meetingsTabActive, isAuthenticated])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [success])

    useEffect(() => {
        if (meetingSuccess) {
            const timer = setTimeout(() => setMeetingSuccess(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [meetingSuccess])

    const onClickAction = async (card, points) => {
        if (points <= 0) {
            // Don't make API call if points are 0 or negative
            return;
        }
        
        try {
            setIsUpdatingPoints(true);
            
            const response = await fetch('/api/member/addPoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: card._id,
                    points: points
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add points');
            }
            
            const data = await response.json();
            
            // Update the member in the local state
            setMembers(members.map(member => 
                member._id === card._id 
                    ? {...member, Points: data.member.Points, Rank: data.member.Rank} 
                    : member
            ));
            
            // Show appropriate success message
            if (data.member.promoted) {
                setPointsSuccess(`Added ${points} points to ${card.name}. Promoted to ${data.member.Rank}!`);
            } else {
                setPointsSuccess(`Added ${points} points to ${card.name}`);
            }
            
            console.log(`Successfully added ${points} points to ${card.name}`);
        } catch (error) {
            console.error('Error adding points:', error);
            // You could add error handling here
        } finally {
            setIsUpdatingPoints(false);
        }
    };

    // Add this useEffect to clear the points success message after 3 seconds
    useEffect(() => {
        if (pointsSuccess) {
            const timer = setTimeout(() => setPointsSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [pointsSuccess]);

    const toDelete = (card) => {
        setDeleteModal({ open: true, member: card })
    }

    const handleDeleteConfirmation = async (confirmed) => {
        if (confirmed && deleteModal.member) {
            setIsDeletingMember(true)
            try {
                const response = await fetch(`/api/member/${deleteModal.member._id}`, {
                    method: 'DELETE',
                })
                
                if (!response.ok) {
                    throw new Error('Failed to delete member')
                }
                
                setMembers(members.filter(member => member._id !== deleteModal.member._id))
                
                setSuccess(`${deleteModal.member.name} has been removed successfully`)
                
                console.log(`Successfully removed ${deleteModal.member.name}`)
            } catch (error) {
                console.error('Error removing member:', error)
            } finally {
                setIsDeletingMember(false)
                setDeleteModal({ open: false, member: null })
            }
        } else {
            console.log(`User canceled removing ${deleteModal.member?.name}`)
            setDeleteModal({ open: false, member: null })
        }
    }

    // Check authentication on load
    useEffect(() => {
        const isAuth = Cookies.get('adminAuthenticated');
        const authExpiry = localStorage.getItem('adminAuthExpires');
        
        // Check if auth exists and hasn't expired
        if (isAuth === 'true' && authExpiry && new Date().getTime() < parseInt(authExpiry)) {
            handleAuthSuccess();
        } else {
            // Clear expired auth data
            Cookies.remove('adminAuthenticated');
            localStorage.removeItem('adminAuthExpires');
            setShowAuthModal(true);
        }
    }, [handleAuthSuccess]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsAuthenticating(true);
        
        if (password === 'Expelliarmus') {
            setError('');
            
            // Set authentication with 30-minute expiration
            const expirationTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutes
            Cookies.set('adminAuthenticated', 'true', { expires: new Date(expirationTime) });
            localStorage.setItem('adminAuthExpires', expirationTime.getTime().toString());
            
            toast.success('Authentication successful!');
            
            // Smoothly close the modal and update state
            setTimeout(() => {
                setShowAuthModal(false);
                handleAuthSuccess();
                setIsAuthenticating(false);
            }, 500);
        } else {
            setError('Incorrect password. Please try again.');
            toast.error('Authentication failed!');
            setIsAuthenticating(false);
        }
    };

    const toggleMeetingActive = async (meetingId) => {
        try {
            setIsTogglingMeeting(prev => ({ ...prev, [meetingId]: true }))
            
            const response = await fetch('/api/meeting/toggle-active', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle meeting status')
            }
            
            // Update meetings in state
            setMeetings(meetings.map(meeting => 
                meeting._id === meetingId 
                    ? { ...meeting, active: !meeting.active } 
                    : meeting.active && !meeting.active 
                        ? { ...meeting, active: false } 
                        : meeting
            ))
            
            setMeetingSuccess(data.message)
        } catch (error) {
            console.error('Error toggling meeting status:', error)
        } finally {
            setIsTogglingMeeting(prev => ({ ...prev, [meetingId]: false }))
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center min-h-screen px-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--primary]" aria-label="Loading members"></div>
                <p className="text-gray-600 font-dongle text-2xl">Loading members...</p>
            </div>
        );
    }

    return (
        <>
            {/* Authentication Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                        >
                            <h2 className="text-3xl font-dongle font-bold text-center mb-6">Admin Access</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-gray-700 text-base mb-2 font-dongle">
                                        Enter the secret password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] font-dongle"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="mt-2 text-red-500 text-sm font-dongle">{error}</p>
                                    )}
                                </div>
                                
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isAuthenticating}
                                        className={`w-full bg-[--primary] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-dongle text-xl flex items-center justify-center ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isAuthenticating ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Authenticating...
                                            </>
                                        ) : (
                                            'Access Admin Panel'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content - only visible when authenticated */}
            {isAuthenticated && (
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6 font-dongle">Admin Management</h1>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setMeetingsTabActive(false)}
                                className={`${
                                    !meetingsTabActive 
                                        ? 'border-[--primary] text-[--primary]' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium font-dongle text-xl`}
                            >
                                Members
                            </button>
                            <button
                                onClick={() => setMeetingsTabActive(true)}
                                className={`${
                                    meetingsTabActive 
                                        ? 'border-[--primary] text-[--primary]' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium font-dongle text-xl`}
                            >
                                Meetings
                            </button>
                        </nav>
                    </div>
                    
                    {/* Members Management Tab */}
                    {!meetingsTabActive && (
                        <div className="bg-white rounded-lg shadow p-6">
                            {members.length > 0 && (
                                <TeamCard 
                                    cards={members.filter(member => member.type === "Member")} 
                                    isLoading={isLoading} 
                                    onClickAction={onClickAction} 
                                    toDelete={toDelete} 
                                    memberList={true}
                                />
                            )}
                            
                            {/* Success Toast for Member Deletion */}
                            {success && (
                                <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-6 right-6 z-50" role="alert">
                                    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="sr-only">Check icon</span>
                                    </div>
                                    <div className="ms-3 text-sm font-normal">{success}</div>
                                </div>
                            )}
                            
                            {/* Success Toast for Points Update */}
                            {pointsSuccess && (
                                <div id="toast-points-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-6 right-6 z-50" role="alert">
                                    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="sr-only">Points icon</span>
                                    </div>
                                    <div className="ms-3 text-sm font-normal">{pointsSuccess}</div>
                                </div>
                            )}
                            
                            {deleteModal.open && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                                        <h3 className="text-xl font-semibold mb-4 dark:text-white">Confirm Removal</h3>
                                        <p className="mb-6 dark:text-gray-300">
                                            Are you sure you want to remove <span className="font-bold">{deleteModal.member?.name}</span> from the members list?
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleDeleteConfirmation(false)}
                                                disabled={isDeletingMember}
                                                className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${isDeletingMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteConfirmation(true)}
                                                disabled={isDeletingMember}
                                                className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center ${isDeletingMember ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {isDeletingMember ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Removing...
                                                    </>
                                                ) : (
                                                    'Remove'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Meetings Management Tab */}
                    {meetingsTabActive && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-4 font-dongle">Activate/Deactivate Meetings</h2>
                            
                            {meetings.length === 0 ? (
                                <p className="text-gray-500 font-dongle text-xl text-center py-8">
                                    No meetings found. Create meetings from the Meetings Management page.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Members Participated
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Certificates
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {meetings.map((meeting) => (
                                                <tr key={meeting._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {meeting.thumbnail && (
                                                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                                    <img className="h-10 w-10 rounded-md object-cover" src={meeting.thumbnail} alt={meeting.title} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {meeting.title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            meeting.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {meeting.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {typeof meeting.membersParticipated === 'number' 
                                                            ? meeting.membersParticipated 
                                                            : meeting.membersParticipated?.length || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {meeting.certificates ? (
                                                            <span className="text-green-500">Sent</span>
                                                        ) : (
                                                            <span className="text-gray-500">Not Sent</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => toggleMeetingActive(meeting._id)}
                                                            disabled={isTogglingMeeting[meeting._id]}
                                                            className={`px-4 py-2 rounded-md ${
                                                                meeting.active
                                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                                            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
                                                        >
                                                            {isTogglingMeeting[meeting._id] ? (
                                                                <>
                                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>{meeting.active ? 'Deactivate' : 'Activate'}</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* Success Toast for Meetings */}
                            {meetingSuccess && (
                                <div id="toast-meeting-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-6 right-6 z-50" role="alert">
                                    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        <span className="sr-only">Check icon</span>
                                    </div>
                                    <div className="ms-3 text-sm font-normal">{meetingSuccess}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default page
