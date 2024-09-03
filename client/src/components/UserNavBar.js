import UserDropdown from "@/components/UserDropdown";
import { getUserToken } from "@/utils/getUserToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function NavBar() {
    const router = useRouter();
    const userIdCookie = getUserToken();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userIdCookie) {
                    console.error("No cookie found! Please sign in");
                    router.push("/users/signin");
                    return;
                }

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/details`,
                    { user_token: userIdCookie },
                    { headers: { "Content-Type": "application/json" } }
                );

                setUserData(response.data);
            } catch (error) {
                if (error.response) {
                    console.error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else {
                    console.error("Error:", error.message);
                }
            }
        };

        fetchUserData();
    }, [router, userIdCookie]);

    return (
        <div className="mb-[8vh]">
            <header className="bg-[color:var(--white-color)] fixed top-0 z-50 w-full shadow-md text-[color:var(--darker-secondary-color)]">
                <div className="container flex flex-col items-center justify-between p-4 mx-auto lg:flex-row">
                    <div
                        onClick={() => router.push("/users/dashboard")}
                        className="flex items-center cursor-pointer gap-x-3"
                    >
                        <Image
                            src="/favicon_io/android-chrome-192x192.png"
                            width={500}
                            height={500}
                            alt="Logo"
                            className="w-8 h-8"
                        />
                        <h1 className="m-2 text-4xl font-bold text-black">
                            {"<In"}
                            <span className="text-[color:var(--darker-secondary-color)]">
                                VIT
                            </span>
                            {"e />"}
                        </h1>
                    </div>
                    <nav className="text-sm">
                        <ul className="flex items-center">
                            <li
                                onClick={() => router.push("/users/dashboard")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>Dashboard</a>
                            </li>
                            {/* <li
                                onClick={() => router.push("/users/past_events")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>Past Events</a>
                            </li>
                            <li
                                onClick={() => router.push("/")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>About us</a>
                            </li> */}
                            <UserDropdown userData={userData} />
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
}
