import React, { useState } from "react";

import { useNavigate } from 'react-router-dom';
const SignUpPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [name, setName] = useState(''); // State for password input
    const [error, setError] = useState(null); // State for password input
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // API call logic
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role: "Student" }), // Send email and password in request body
        });

        // Handle response (assuming JSON format)
        const data = await response.json();
        if (response.status !== 200) {
            // Handle errors (e.g., display error message to user)
            console.error('Login failed:', data);
            setError(data.message)
        }
        else {
            navigate('/login'); // Redirect to the root path
        }

    };





    return (




        <div class="page-section-login">

            <div className="login-signup-container">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">




                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Your Company"
                            height="100"
                            width="80"
                            src="https://upload.wikimedia.org/wikipedia/en/c/c8/VSU_seal.png"
                            className="mx-auto"
                        />
                        <h3 className="mt-4 text-center text-xl sm:text-2xl font-bold text-indigo-700">
                            VSUWorkTrack
                        </h3>

                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign Up with new account
                        </h2>
                    </div>

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">


                        <div class="flex items-center justify-between mt-4">
                            <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

                            <a href="signup" class="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">Signup
                                with email</a>

                            <span class="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
                        </div>
                    </div>



                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    onClick={(e) => { handleSubmit(e) }}
                                    className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-4 text-xl font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign up
                                </button>

                            </div>
                        </div>

                        <p className="mt-10 text-center text-lg text-gray-500">
                            Already have an account?{' '}
                            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
                {error ?
                    <div class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-white-800">
                        <div class="flex items-center justify-center w-12 bg-red-500">
                            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                            </svg>
                        </div>

                        <div class="px-4 py-2 -mx-3">
                            <div class="mx-3">
                                <span class="font-semibold text-emerald-500 dark:text-red-400">Failed</span>
                                <p class="text-sm text-gray-600 dark:text-black-200">{error}</p>
                            </div>
                        </div>
                    </div> : <></>


                }
            </div>
        </div>
    )
}


export default SignUpPage;