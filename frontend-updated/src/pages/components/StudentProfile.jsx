import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDataDisplay = () => {
    const [student, setStudent] = useState(null);
    const [employmentHistory, setEmploymentHistory] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch student data and employment history from the API
        const fetchStudentData = async () => {
            try {
                const refresh_token = localStorage.getItem("token"); // Example - replace with your token retrieval method
                const response = await axios.get(
                    "http://localhost:3000/student-info/profile",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${refresh_token}`, // Include Bearer token in headers
                        },
                    }
                );
                const data = response.data;
                if (response.status !== 200) {
                    console.error(response.message)
                }
                else if (response.data.message === 'No profile Found') {
                    navigate('input-modal')
                }
                else {
                    setStudent(data.profile);
                    setEmploymentHistory(data.employmentHistory);
                }

                // Set the fetched data in state
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStudentData();
    }, [navigate]);

    if (error) {
        return <p className="text-indigo-500">Error: {error}</p>;
    }

    if (!student) {
        return <p>Loading...</p>;
    }

    // Helper function to get status styles based on approvalStatus
    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return {
                    bg: "bg-yellow-100",
                    text: "text-yellow-700",
                    icon: (
                        <svg
                            className="w-4 h-4 fill-current text-yellow-500 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 0C4.485 0 0 4.485 0 10s4.485 10 10 10 10-4.485 10-10S15.515 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z" />
                        </svg>
                    ),
                };
            case "approved":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    icon: (
                        <svg
                            className="w-4 h-4 fill-current text-green-500 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm-1 15l-5-5 1.414-1.414L9 12.172l7.586-7.586L18 6l-9 9z" />
                        </svg>
                    ),
                };
            case "declined":
                return {
                    bg: "bg-red-100",
                    text: "text-red-700",
                    icon: (
                        <svg
                            className="w-4 h-4 fill-current text-red-500 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" />
                        </svg>
                    ),
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    icon: null,
                };
        }
    };

    return (
        <div className="min-h-screen flex px-6 py-6 bg-gray-50">
            <div className="mx-auto my-auto px-6 py-6 bg-white rounded-lg shadow-lg w-5/6">
                {/* Scrollable Section */}
                <div className="sticky top-0 max-h-[85vh] overflow-y-auto px-4 py-4 bg-white rounded-lg shadow-md">
                    {/* Student Information */}
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-rose-700 mb-4">Student Information</h2>
                        <div className="space-y-3">
                            <p className="text-lg text-gray-800 tracking-wide"><strong>Name:</strong> {student.name}</p>
                            <p className="text-lg text-gray-800 tracking-wide"><strong>V Number:</strong> {student.vNumber}</p>
                            <p className="text-lg text-gray-800 tracking-wide"><strong>Degree:</strong> {student.degree}</p>
                            <p className="text-lg text-gray-800 tracking-wide"><strong>Major:</strong> {student.major}</p>
                            <p className="text-lg text-gray-800 tracking-wide"><strong>Graduation Year:</strong> {student.graduationYear}</p>
                        </div>
                    </div>

                    {/* Employment History */}
                    <div className="bg-white py-6 px-4 shadow-md">
                        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Employment History</h2>
                        {employmentHistory.length > 0 ? (
                            employmentHistory.map((job, index) => {
                                const statusStyles = getStatusStyles(job.approvalStatus);
                                return (
                                    <div key={index} className="mb-6">
                                        {/* Status Badge */}
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${statusStyles.bg}`}>
                                            {statusStyles.icon}
                                            <h2 className={`${statusStyles.text} text-md font-normal`}>
                                                {job.approvalStatus.toUpperCase()}
                                            </h2>
                                        </div>
                                        {/* Job Details */}
                                        <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-violet-50 shadow-sm">
                                            <p className="text-xl text-indigo-600 mb-2"><strong>Company:</strong> {job.company}</p>
                                            <p className="text-lg text-gray-800 tracking-wide py-1"><strong>Position:</strong> {job.position}</p>
                                            <p className="text-lg text-gray-800 tracking-wide py-1"><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
                                            <p className="text-lg text-gray-800 tracking-wide py-1"><strong>End Date:</strong> {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}</p>
                                            <p className="text-lg text-gray-800 tracking-wide py-1"><strong>Description:</strong> {job.description}</p>
                                            <p className="text-lg text-gray-800 tracking-wide py-1"><strong>Internship:</strong> {job.isInternship ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-lg text-gray-800">No employment history available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDataDisplay;
