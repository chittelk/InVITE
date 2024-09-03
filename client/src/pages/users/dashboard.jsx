import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Dashboard_Filter from '@/components/Dashboard_Filter';
import Popup_Filter from '@/components/Popup_Filter';
import UserNavBar from '@/components/UserNavBar';
import { FaUsers } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';

const UserDashboard = () => {
    const router = useRouter();
    const [allEvents, setAllEvents] = useState([]);
    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        dateRange: "",
        price: [10, 3000],
    });
    const [filteredEvents, setFilteredEvents] = useState([]);

    const fetchAllEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getallevents`);
            setAllEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events:", error.message);
        }
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            const newFilteredEvents = allEvents.filter((event) => {
                if (
                    filterOptions.keyword &&
                    !event.name.toLowerCase().includes(filterOptions.keyword.toLowerCase()) &&
                    !event.venue.toLowerCase().includes(filterOptions.keyword.toLowerCase())
                ) {
                    return false;
                }

                if (filterOptions.dateRange) {
                    const date = filterOptions.dateRange;
                    const [day, month, year] = event.date.split("/");
                    const formattedDate = `${year}-${month}-${day}`;
                    if (formattedDate < date) {
                        return false;
                    }
                }

                if (
                    event.price < filterOptions.price[0] ||
                    event.price > filterOptions.price[1]
                ) {
                    return false;
                }

                return true;
            });

            setFilteredEvents(newFilteredEvents);
        };

        applyFilters();
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
            <UserNavBar />
            <div className="flex m-auto">
                <div className="container flex mx-auto">
                    <div className="flex m-auto overflow-y-hidden gap-4 lg:gap-8 w-full h-[calc(88vh)]">
                        <div className="sticky top-0 flex-col hidden w-1/6 p-4 md:flex md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div>

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

                        <div className="container flex justify-between w-full mx-auto md:w-3/4">
                            <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
                                <h2 className="mb-4 text-lg font-medium">Events</h2>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredEvents.length === 0 ? (
                                        <p>No events yet</p>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <div
                                                onClick={() => router.push(`/event/${event.event_id}`)}
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
                                                                ? `${event.name.slice(0, 30)}...`
                                                                : event.name}
                                                        </p>
                                                        <p className="text-sm text-gray-800">{event.venue}</p>
                                                        <p className="text-sm text-gray-800">{event.date}</p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-end">
                                                        <span className="flex flex-row items-center w-full">
                                                            <FaUsers />
                                                            <span className="ml-2 text-sm">4,92</span>
                                                        </span>
                                                        <p className="mt-2 text-sm text-gray-800">
                                                            <strong className="whitespace-nowrap">£ {event.price}</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="fixed bottom-3 right-3">
                            <button
                                onClick={() => setPopupFilterOpen(true)}
                                className="md:hidden flex items-center justify-center w-[4rem] h-[4rem] text-white rounded-full bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] hover:scale-105 shadow-lg cursor-pointer transition-all ease-in-out focus:outline-none"
                                title="Filter Events"
                            >
                                <RxHamburgerMenu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
