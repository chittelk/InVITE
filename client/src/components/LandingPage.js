import FeaturesZigZag from "@/components/Landing_Page_partials/FeaturesZigZag";
import Header from "@/components/Landing_Page_partials/Header";
import HeroHome from "@/components/Landing_Page_partials/HeroHome";
import React from "react";
import { useEffect } from "react";
import { useRouter } from 'next/router';

function LandingPage() {
    const router = useRouter();

    const fetchAllEvents = async () => {
        try {
            const apiUrl = 'http://localhost:5000'; 
            console.log('API URL:', apiUrl);
    
            if (!apiUrl) {
                throw new Error('API URL is not defined');
            }
    
            const response = await fetch(`${apiUrl}/getallevents`);
            console.log('Request URL:', response.url);
    
            if (!response.ok) {
                const errorText = await response.text(); // Capture the error response text
                throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
            }
    
            const data = await response.json();
            console.log('Fetched events:', data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const handleUserLogin = () => {
        router.push('/users/signin');
    };

    const handleAdminLogin = () => {
        router.push('/admin/auth');
    };

    return (
        <div className="overflow-x-hidden">
            <div className="flex flex-col min-h-screen overflow-x-hidden">
                <Header className="overflow-x-hidden" />
                <div className="flex-grow flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-8">Welcome to Event Management</h1>
                    <div className="space-x-4">
                        <button 
                            onClick={handleUserLogin}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            User Login
                        </button>
                        <button 
                            onClick={handleAdminLogin}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Admin Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
