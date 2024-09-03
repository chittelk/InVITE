import { getAdminToken } from "@/utils/getAdminToken";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminDropdown from "@/components/AdminDropdown";
import axios from "axios";

export default function NavBar() {
    const router = useRouter();

    const adminIdCookie = getAdminToken();
    const [adminData, setAdminData] = useState({});
    const [error, setError] = useState("");

    // Fetch the admin data as soon as the page loads
    const fetchAdminData = async () => {
        // If cookie was manually removed from browser
        if (!adminIdCookie) {
            console.error("No cookie found! Please authenticate");
            // Redirect to signin
            router.push("/admin/auth");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/details`,
                {
                    admin_id: adminIdCookie,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setAdminData(response.data);
        } catch (error) {
            // Handle errors from axios
            if (error.response) {
                // Server responded with a status other than 2xx
                setError(`${error.response.status} ${error.response.statusText}`);
            } else if (error.request) {
                // No response was received
                setError("No response received from server");
            } else {
                // Error in setting up request
                setError(`Error: ${error.message}`);
            }
            console.error("Failed to fetch admin data:", error);
            router.push("/admin/auth"); // Redirect if necessary
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    return (
        <div className="mb-[8vh]">
            <header className="bg-[color:var(--white-color)] fixed top-0 z-50 w-full shadow-md text-[color:var(--darker-secondary-color)]">
                <div className="container mx-auto flex items-center flex-col lg:flex-row justify-between p-4">
                    <div
                        onClick={() => router.push("/admin/dashboard")}
                        className="flex items-center gap-x-3 cursor-pointer"
                    >
                        <Image
                            src="/favicon_io/android-chrome-192x192.png"
                            width={500}
                            height={500}
                            alt="Logo"
                            className="h-8 w-8"
                        />
                        <h1 className="m-2 text-black font-bold text-4xl">
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
                                onClick={() => router.push("/admin/dashboard")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>Dashboard</a>
                            </li>
                            <li
                                onClick={() => router.push("/")}
                                className="mr-4 cursor-pointer"
                            >
                                <a>Home</a>
                            </li>
                            <AdminDropdown adminData={adminData} />
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
}
