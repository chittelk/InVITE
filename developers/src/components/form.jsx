import { useState } from "react";
import axios from "axios";

function Form() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(""); // Clear previous message
        console.log("hi",name, email, password);

        try {
            const response = await axios.post(
                `http://localhost:5000/setAdmin`,
                {
                    name: name,
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setMessage("Success: New admin credentials added!");
            } else {
                setMessage(`Error: ${response.data.msg || 'An error occurred'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.msg || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <center>
                <fieldset>
                    <legend>Admin Registration</legend>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Enter your Email Address: </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="xyz@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="name">Enter your Name: </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Admin name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="password">Enter Password: </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br />
                        <span className="status">
                            {message && <span>{message}</span>}
                        </span>
                        <br />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </fieldset>
            </center>
        </div>
    );
}

export default Form;
