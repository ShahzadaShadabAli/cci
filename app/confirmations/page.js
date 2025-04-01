"use client"

import {TeamCard} from '@/components/TeamCard'
import React, { useEffect, useState } from 'react'
import AdminAuthModal from '@/app/components/AdminAuthModal'
import Cookies from 'js-cookie';

const page = () => {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    // Original state
    const [confirmations, setConfirmations] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(null)

    // Check authentication on load
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

    const fetchConfirmations = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/confirmation/get", {method: "GET"})
            const data = await response.json()
            setConfirmations(data)
        } catch (error) {
            console.log(error)
        } finally { 
            setIsLoading(false)
        }
    }

    // Only fetch confirmations after authentication is successful
    useEffect(() => {
        if (isAuthenticated) {
            fetchConfirmations()
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(false), 5000)
        }
    }, [success])
  
    const onClickAction = async (card) => {
        try {
            const response = await fetch("/api/member/new", {
                method: 'POST', 
                body: JSON.stringify({
                    name: card.name,
                    stage: card.stage, 
                    avatar: card.avatar,
                    email: card.email,
                })
            })
            const res2 = await fetch(`/api/confirmation/${card._id}`, {method: "DELETE"})
            setSuccess("Member Added Successfully")
            fetchConfirmations()
            return true; // Return success to complete the process
        } catch (error) {
            console.log(error)
            return false; // Return failure to complete the process
        }
    }

    const toDelete = async (card) => {
        try {
            const res2 = await fetch(`/api/confirmation/${card._id}`, {method: "DELETE"})
            setSuccess("Confirmation Removed Successfully")
            fetchConfirmations()
            return true; // Return success to complete the process
        } catch (error) {
            console.log(error)
            return false; // Return failure to complete the process
        }
    }

    // Show loading spinner while checking authentication
    if (isAuthChecking) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Show the auth modal if not authenticated */}
            {showAuthModal && <AdminAuthModal onSuccess={handleAuthSuccess} />}

            {/* Only show content if authenticated */}
            {isAuthenticated && (
                <>
                    {isLoading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {confirmations && (
                        <TeamCard 
                            cards={confirmations} 
                            isLoading={isLoading} 
                            onClickAction={onClickAction} 
                            toDelete={toDelete} 
                            confirmation={true}
                        />
                    )}
                    
                    {confirmations && confirmations.length == 0 && (
                        <h1 className='font-dongle text-center'>No Confirmations To Show ¯\_(ツ)_/¯</h1>
                    )}
                    
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
                </>
            )}
        </div>
    )
}

export default page
