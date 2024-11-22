import React, { useState } from "react";
import axios from "axios";

const InputModal = () => {
    // State to manage form inputs
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        vNumber: '',
        degree: '',
        major: '',
        graduationYear: ''
    });

    console.log(formData);
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const refresh_token = localStorage.getItem("token");
            const response = await axios.post(
                'http://localhost:3000/student-info/profile',
                formData, // Pass formData directly as the second argument
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refresh_token}` // Include Bearer token in headers
                    }
                }
            );
            if (response.status === 201) {
                // Handle successful response
                const data = response;
                console.log("Successfully created Data");
                // Reset the form or close the modal as needed
            } else {
                // Handle error response
                setError(response.data.message)
                console.error('Error:', response);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred")
            console.error('Error:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-cover bg-center flex items-center justify-center" >
            <div className="bg-white rounded-lg shadow-lg p-7 w-full max-w-3xl mx-5 sm:mx-auto">

                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-3xl font-semibold text-black">User <span className="text-indigo-600">Information</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xl">
                        <div>
                            <label className="block text-gray-700 py-1">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="John Smith" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-300 focus:border-indigo-600 outline-none text-lg rounded-lg" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 py-1">V Number</label>
                            <input 
                                type="text" 
                                name="vNumber" 
                                placeholder="V1234567" 
                                value={formData.vNumber} 
                                onChange={handleChange} 
                                className="w-full p-2 border focus:border-indigo-600 outline-none text-lg rounded-lg" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 py-1">Degree</label>
                            <select
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className="w-full p-2 border focus:border-indigo-600 outline-none text-lg rounded-lg"
                                required
                            >
                                <option value="" disabled>Select Degree</option>
                                <option value="Bachelor of Arts">Bachelor of Arts</option>
                                <option value="Bachelor of Science">Bachelor of Science</option>
                                <option value="Bachelor of Commerce">Bachelor of Commerce</option>
                                <option value="Master of Arts">Master of Arts</option>
                                <option value="Master of Science">Master of Science</option>
                                <option value="Master of Commerce">Master of Commerce</option>
                                <option value="Doctorate">Doctorate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 py-1">Major</label>
                            <input 
                                type="text" 
                                name="major" 
                                placeholder="Major" 
                                value={formData.major} 
                                onChange={handleChange} 
                                className="w-full p-2 border focus:border-indigo-600 outline-none text-lg rounded-lg" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 py-1">Graduation Year</label>
                            <input 
                                type="number" 
                                name="graduationYear" 
                                placeholder="2023" 
                                value={formData.graduationYear} 
                                onChange={handleChange} 
                                className="w-full p-2 border focus:border-indigo-600 text-lg outline-none rounded-lg" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-600">Save</button>
                    </div>
                </form>

                {error && (
                    <div className="w-full text-red-700 bg-white-500 border border-red-300 mt-10">
                        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                            <div className="flex">
                                <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current">
                                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z">
                                    </path>
                                </svg>

                                <p className="mx-3">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputModal;
