import { getAdminToken } from "@/utils/getAdminToken";
import AdminNavBar from "@/components/AdminNavBar";
import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";

function UserDashboard() {
    const router = useRouter();
    const adminIdCookie = getAdminToken();
    
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        dateRange: "",
        price: [10, 3000],
    });
    const [originalEvents, setOriginalEvents] = useState([]);
    const [error, setError] = useState("");

    // Fetch all events from API
    const fetchAllEvents = async () => {
        if (!adminIdCookie) {
            console.error("No admin cookie found!");
            router.push("/admin/auth");
            return;
        }

        
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/details`,
                { admin_id: adminIdCookie },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Fetched events:", response.data.eventCreated);

            setAllEvents(response.data.eventCreated || []);
            setOriginalEvents(response.data.eventCreated || []);
        } catch (error) {
            if (error.response) {
                // Server responded with an error status
                setError(`${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                // No response was received
                setError("No response received from server");
            } else {
                // Error setting up the request
                setError(`Error: ${error.message}`);
            }
            console.error("Failed to fetch events:", error);
            router.push("/admin/auth"); // Redirect if necessary
        }
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    // Update filteredEvents state whenever allEvents or filterOptions change
    useEffect(() => {
        // Ensure allEvents is an array and filterOptions is defined
        if (Array.isArray(allEvents)) {
            const newFilteredEvents = allEvents.filter((event) => {
                // Ensure event object has the necessary properties
                if (!event.name || !event.date || event.price === undefined) {
                    return false; // Exclude events with missing data
                }
    
                // Check if keyword filter matches
                if (
                    filterOptions.keyword &&
                    filterOptions.keyword.toLowerCase() &&
                    !event.name.toLowerCase().includes(filterOptions.keyword.toLowerCase()) &&
                    !event.venue.toLowerCase().includes(filterOptions.keyword.toLowerCase())
                ) {
                    return false;
                }
    
                // Check if date range filter matches
                if (filterOptions.dateRange) {
                    const date = filterOptions.dateRange;
                    // Ensure event.date is in the expected format
                    const dateParts = event.date.split("/");
                    if (dateParts.length === 3) {
                        // Rearrange the array elements to get yyyy-mm-dd format
                        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                        if (formattedDate < date) {
                            return false;
                        }
                    }
                }
    
                // Check if price filter matches
                if (
                    event.price < filterOptions.price[0] ||
                    event.price > filterOptions.price[1]
                ) {
                    return false;
                }
    
                return true;
            });
    
            setFilteredEvents(newFilteredEvents);
        } else {
            // Handle case where allEvents is not an array
            console.warn("Expected allEvents to be an array, but it is not.");
            setFilteredEvents([]);
        }
    }, [allEvents, filterOptions]);
    

    const handleFilterClear = () => {
        setFilterOptions({
            keyword: "",
            dateRange: "",
            price: [10, 3000],
        });
        setFilteredEvents(allEvents);
        setPopupFilterOpen(false);
    };

    return (
        <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
            <AdminNavBar />
            <div className="flex m-auto">
                <div className="container flex mx-auto">
                    <div className="flex m-auto gap-4 lg:gap-8 overflow-y-hidden w-full h-[calc(88vh)]">
                        {/* Render the regular filter for medium screens and above */}
                        <div className="sticky top-0 flex-col hidden w-1/6 p-4 md:flex md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div>
                        {/* Render the popup filter for small screens */}
                        {popupFilterOpen && (
                            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 md:hidden">
                                <div className="w-5/6 p-4 bg-white rounded-lg">
                                    <Popup_Filter
                                        filterOptions={filterOptions}
                                        setFilterOptions={setFilterOptions}
                                        handleFilterClear={handleFilterClear}
                                        handleClose={() => setPopupFilterOpen(false)}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Render the main content of the dashboard */}
                        <div className="container flex justify-between w-full mx-auto md:w-3/4">
                            <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
                                <h2 className="mb-4 text-lg font-medium">Events</h2>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents.length === 0 ? (
                                        <p>No events yet</p>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <div
                                                onClick={() => {
                                                    router.push(
                                                        `/event/${event.event_id}/adminevents`
                                                    );
                                                }}
                                                className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                                                key={event._id}
                                            >
                                                <div className="relative h-[25rem]">
                                                    {event.profile && (
                                                        <Image
                                                            fill
                                                            className="object-cover w-full h-full rounded-md"
                                                            src={event.profile}
                                                            alt=""
                                                            sizes="(min-width: 640px) 100vw, 50vw"
                                                            priority
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-row items-start justify-between mt-4">
                                                    <div className="px-2">
                                                        <p className="text-sm font-bold text-gray-800">
                                                            {event.name.length > 30
                                                                ? event.name.slice(0, 30) + "..."
                                                                : event.name}
                                                        </p>
                                                        <p className="text-sm text-gray-800">
                                                            {event.venue}
                                                        </p>
                                                        <p className="text-sm text-gray-800">
                                                            {event.date}
                                                        </p>
                                                    </div>
                                                    {/* Star component */}
                                                    <div className="flex flex-col items-center justify-end">
                                                        <span className="flex flex-row items-center w-full">
                                                            <FaUsers />
                                                            <span className="ml-2 text-sm">
                                                                4,92
                                                            </span>
                                                        </span>
                                                        <p className="mt-2 text-sm text-gray-800">
                                                            <strong className="whitespace-nowrap">
                                                                £ {event.price}
                                                            </strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Bottom buttons */}
                        <div className="fixed bottom-3 right-3">
                            {/* Button to open the popup filter */}
                            <button
                                onClick={() => setPopupFilterOpen(true)}
                                className="md:hidden flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                                title="Filter Events"
                            >
                                <RxHamburgerMenu className="w-6 h-6" />
                            </button>
                            {/* Button to open the event form */}
                            <button
                                onClick={() => router.push("/admin/eventform")}
                                className="mt-4 flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                                title="Create Events"
                            >
                                <AiOutlinePlus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
