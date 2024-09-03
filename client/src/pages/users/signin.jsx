import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setUserToken } from "@/utils/setUserToken";

export default function signin({ userIdCookie }) {
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
    const router = useRouter();

    useEffect(() => {
        // If cookie found, Redirect to dashboard
        if (userIdCookie) {
            setStep(2); // Skip login step

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
    }, []);

    const handleVerifyEmail = async (event) => {
        event.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/signin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: contactNumber,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            alert("Login Successful")
            setMessage({ errorMsg: "", successMsg: data.msg });
            console.log(data);
            setUserToken(data.user_id); // set cookie when signed in
            setStep(2); 
        } else {
            console.error(`Failed with status code ${response.status}`);
            setMessage({ errorMsg: data.msg, successMsg: "" });
            // redirect to signup if shown "This Email ID is not registered. Try Signing Up instead!"
            setTimeout(() => {
         
                setMessage({
                    errorMsg: "Redirecting you to SignUp ...",
                    successMsg: "",
                });
            }, 1700);

            // Redirect to signup
            setTimeout(() => {
                router.push("/users/signup");
            }, 2500);
        }
    };

    return (
        <div className="m-2">

            {/* Steps Nav */}
            <div className="flex items-center justify-center">
                {/* Step 1: Verify Email */}
                <div className={`w-full h-24 lg:h-fit ${step === 1 ? 'font-medium' : ''}`}>
                    <div className={`h-full border-2 rounded-l-lg px-5 py-2 ${
                        step >= 1
                            ? 'text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]'
                            : 'border-[color:var(--darker-secondary-color)] border-dashed'
                    }`}>
                        <div>01</div>
                        Verify Email
                    </div>
                </div>

                {/* Step 2: Go to Dashboard */}
                <div className={`w-full h-24 lg:h-fit ${step === 2 ? 'font-medium' : ''}`}>
                    <div className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${
                        step >= 2
                            ? 'text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]'
                            : 'border-[color:var(--darker-secondary-color)] border-dashed'
                    }`}>
                        <div>02</div>
                        Go to Dashboard!
                    </div>
                </div>
            </div>

            {/* ... (keep the existing JSX for error and success messages) */}

            {/* Steps Content */}
            <div className="p-5 mt-2 bg-white rounded-lg">
                {step === 1 && (
                    <form onSubmit={handleVerifyEmail}>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Enter your Registered Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            className="w-full p-2 mx-2 mb-4 bg-gray-100 rounded-lg focus:outline-none"
                            onChange={(e) => setEmail(e.target.value)}
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
                            Sign In
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
                                            Hey there!{" "}
                                        </span>
                                        Welcome back, you're successfully signed in!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/users/dashboard")}
                            className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)] transition ease-in-out"
                        >
                            Go to your dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
