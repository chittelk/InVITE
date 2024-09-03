import { setAdminToken } from "@/utils/setAdminToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Cookies from "universal-cookie";

export async function getServerSideProps(context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const adminId = cookies.get("admin_token");
    if (!adminId) {
        return {
            props: { adminIdCookie: null },
        };
    }
    return {
        props: { adminIdCookie: adminId },
    };
}

export default function signin({ adminIdCookie }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
    const router = useRouter();

    useEffect(() => {
        console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
        if (adminIdCookie) {
            setStep(2); // Skip auth steps

            setTimeout(() => {
                setMessage({
                    errorMsg: "",
                    successMsg: "Redirecting you ...",
                });
            }, 500);

            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 800);
        }
    }, [adminIdCookie, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/auth`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Login Successful")
                setMessage({ errorMsg: "", successMsg: data.msg });
                setAdminToken(data.admin_token);
            } else {
                setMessage({ errorMsg: data.msg, successMsg: "" });
            }
    
            router.push("/admin/dashboard");
    
        } catch (error) {
            console.error("Fetch error:", error);
            setMessage({
                errorMsg: "An error occurred. Please try again later.",
                successMsg: "",
            });
            router.push("/admin/dashboard");
        }
    };
    
    return (
        <div className="m-2">
            <FiArrowLeft
                onClick={() => router.push("/")}
                size={24}
                className="cursor-pointer"
            />
            <div className="text-3xl font-bold text-center">
                Admin Authentication Page
            </div>

            <div className="max-w-3xl mx-auto mt-10">
                <div className="flex items-center justify-center">
                    <div className={`w-full h-24 lg:h-fit ${step === 1 ? `font-medium` : ``}`}>
                        <div
                            className={`h-full border-2 rounded-l-lg px-5 py-2 ${
                                step >= 1
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                            }`}
                        >
                            <div>01</div>
                            Verify Credentials
                        </div>
                    </div>

                    <div className={`w-full h-24 lg:h-fit ${step === 2 ? `font-medium` : ``}`}>
                        <div
                            className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${
                                step >= 2
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                            }`}
                        >
                            <div>02</div>
                            Go to Dashboard!
                        </div>
                    </div>
                </div>

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

                <div className="p-5 mt-2 bg-white rounded-lg">
                    {
                        step === 1 && (
                            <form onSubmit={handleSubmit}>
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
                                    Enter your Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    className="w-full p-2 mx-2 mb-4 bg-gray-100 rounded-lg focus:outline-none"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <p className="mt-6 text-sm text-gray-700">
                                    *You have the option to designate yourself
                                    as an admin for testing purposes by
                                    following this{" "}
                                    <a
                                        href="https://invite-developers.vercel.app/"
                                        target="_blank"
                                        className="text-[color:var(--darker-secondary-color)]"
                                    >
                                        link.
                                    </a>
                                </p>

                                <button
                                    type="submit"
                                    className="btn text-white bg-[color:var(--darker-secondary-color)] hover:bg-[color:var(--secondary-color)] w-full mt-4 mb-4 sm:w-auto sm:mb-0"
                                >
                                    Verify
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail("invite.testing@gmail.com");
                                        setPassword("invite123");
                                    }}
                                    className="w-full mt-4 text-white bg-gray-700 btn hover:bg-gray-800 sm:w-auto sm:ml-4"
                                >
                                    Use Test Credentials
                                </button>
                            </form>
                        )
                    }
                    {
                        step === 2 && (
                            <div>
                                <div className="flex justify-between p-4 text-sm text-green-800 border-b border-green-400 bg-green-50">
                                    <div>
                                        <div className="flex items-center">
                                            <p>
                                                <span className="font-bold">
                                                    Hey there!{" "}
                                                </span>
                                                Welcome back, you're
                                                successfully signed in!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        router.push("/admin/dashboard")
                                    }
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)] transition ease-in-out"
                                >
                                    Go to your dashboard
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
