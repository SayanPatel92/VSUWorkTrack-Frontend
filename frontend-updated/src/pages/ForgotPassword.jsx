import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

    const [email, setEmail] = useState(''); // State for email input
    const [error, setError] = useState(null); // State for password input
    const [message, setMessage] = useState(null); // State for password input
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            // API call logic
            const response = await fetch('http://localhost:3000/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // Send email and password in request body
            });

            const data = await response.json();
            if (response.status !== 200) {
                // Handle errors
                console.error('Login Failed', data);
                setError(data.message);
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An unexpected error occurred.');
        }
    };





    return (




        <div class="page-section-login">

            <div className="login-signup-container">
                <div className="flex max-h-4/6 flex-1 flex-col justify-center px-6 py-6 lg:px-8">

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Your Company"
                            height="120"
                            width="120"
                            src="https://upload.wikimedia.org/wikipedia/en/c/c8/VSU_seal.png"
                            className="mx-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Forgot Password 
                        </h2>
                    </div>

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">


                        <div class="flex items-center justify-between mt-4">
                            <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

                            <a href="#" class="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">Reset You Password Here </a>

                            <span class="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
                        </div>
                    </div>



                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
                            
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                                        Enter Your Email for Verification
                                    </label>
                                   
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="current-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-3 px-2 text-gray-600 text-md tracking-wide  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-100  sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    onClick={(e) => { handleSubmit(e) }}
                                    className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-4 text-xl font-semibold leading-6 text-black shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Reset Password
                                </button>

                            </div>
                        </div>

            
                    </div>

                    {error ?
                        <div class="flex w-full max-w-sm mx-auto my-2 overflow-hidden bg-white rounded-lg shadow-md dark:bg-white-800">
                            <div class="flex items-center justify-center w-12 bg-red-500">
                                <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                                </svg>
                            </div>

                            <div class="px-4 py-1 -mx-2">
                                <div class="mx-2">
                                    <span class="font-semibold text-emerald-500 dark:text-red-400">Failed</span>
                                    <p class="text-xs text-gray-600">{error}</p>
                                </div>
                            </div>
                        </div> : <></>


                    }
                         {message ?
                        <div class="flex w-full max-w-sm mx-auto my-2 overflow-hidden bg-white rounded-lg shadow-md dark:bg-white-800">
                            <div class="flex items-center justify-center w-12 bg-green-500">
                                <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                                </svg>
                            </div>

                            <div class="px-4 py-1 -mx-2">
                                <div class="mx-2">
                                    <p class="text-xs text-gray-600">{message}</p>
                                </div>
                            </div>
                        </div> : <></>


                    }
                </div>
            </div>
        </div>
    )
}


export default ForgotPassword;