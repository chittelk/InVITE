import FeaturesZigZag from "@/components/Landing_Page_partials/FeaturesZigZag";
import Header from "@/components/Landing_Page_partials/Header";
import HeroHome from "@/components/Landing_Page_partials/HeroHome";
import React from "react";
import { useEffect } from "react";


function LandingPage() {

    // run the server when a user enters the site
    const fetchAllEvents = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/getallevents`
        );
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    return (
        <div className="overflow-x-hidden">
            <div className="flex flex-col min-h-screen overflow-x-hidden ">
                <Header className="overflow-x-hidden" />
            </div>
        </div>
    );
}

export default LandingPage;
