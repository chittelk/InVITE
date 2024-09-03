import { setUserToken } from "@/utils/setUserToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Cookies from "universal-cookie";
import axios from "axios";

export async function getServerSideProps(context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const userId = cookies.get("user_token");
    if (!userId) {
        return {
            props: { userIdCookie: null },
        };
    }
    return {
        props: { userIdCookie: userId },
    };
}

export default function Signup({ userIdCookie }) {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [regNumber, setRegNumber] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        // If cookie found, Redirect to dashboard
        if (userIdCookie) {
            setStep(2); // Skip login steps

            setTimeout(() => {
                // Set success message
                setMessage({
                    errorMsg: "",
                    successMsg: "Redirecting you ...",
                });
            }, 500);

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/users/dashboard");
            }, 800);
        }
    }, [userIdCookie, router]);

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:5000/user/signup`,
                {
                    email: email,
                    contactNumber: contactNumber,
                }
            );
            alert("Login Successful")
            setMessage({ errorMsg: "", successMsg: response.data.msg });
            setUserToken(response.data.user_id); // set cookie when signed up
            setStep(2); // Move to success step

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push("/users/dashboard");
            }, 1500);
        } catch (error) {
            console.error(`Failed with status code ${error.response?.status || 'unknown'}`);
            const errorMsg = error.response?.data?.msg || "An error occurred. Please try again later.";
            setMessage({ errorMsg, successMsg: "" });

            // Redirecting to signin if shown "This Email ID is already registered. Try Signing In instead!"
            if (errorMsg.includes("already registered")) {
                setTimeout(() => {
                    setMessage({
                        errorMsg: "Redirecting you to SignIn ...",
                        successMsg: "",
                    });
                }, 1700);

                setTimeout(() => {
                    router.push("/users/signin");
                }, 2500);
            }
        }
    };

    return (
        <div className="m-2">
            <FiArrowLeft
                onClick={() => router.push("/")}
                size={24}
                className="cursor-pointer"
            />
            <div className="text-3xl font-bold text-center">Signup Page</div>
            <div className="max-w-3xl mx-auto mt-10">
                {message.errorMsg && (
                    <h1 className="p-3 my-2 font-medium text-red-600 bg-red-200 rounded">
                        {message.errorMsg}
                    </h1>
                )}
                {message.successMsg && (
                    <h1 className="p-3 my-2 font-medium text-green-600 bg-green-200 rounded">
                        {message.successMsg}
                    </h1>
                )}

                {/* Steps Content */}
                <div className="p-5 mt-2 bg-white rounded-lg">
                    {step === 1 && (
                        <form onSubmit={handleSignUp}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Enter your email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                className="w-full p-2 mx-2 mb-4 bg-gray-100 rounded-lg focus:outline-none"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Enter your contact number
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                value={contactNumber}
                                className="w-full p-2 mx-2 mb-4 bg-gray-100 rounded-lg focus:outline-none"
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                            >
                                Sign Up
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div>
                            <div className="flex justify-between p-4 text-sm text-green-800 border-b border-green-400 bg-green-50">
                                <div>
                                    <div className="flex items-center">
                                        <p>
                                            <span className="font-bold">
                                                Success :{"Welcome"}
                                            </span>
                                            Your account has been created!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push("/users/dashboard")}
                                className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
