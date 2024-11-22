import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios if you haven't already

const ITEMS_PER_PAGE = 6;

// Updated MemberRow2 to use vNumber instead of phone and email
const MemberRow2 = ({ name, username, major, vNumber, department, employmentHistory, onApprove, onDecline }) => {
    return (
        <tr>
            {/* Student Details */}
            <td className="px-6 py-6 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div className="inline-flex items-center gap-x-3">
                    <div className="flex items-center gap-x-2">
                        <div>
                            <h2 className="font-medium text-gray-800">{name}</h2>
                            <p className="text-sm font-normal text-gray-600">@{username}</p>
                        </div>
                    </div>
                </div>
            </td>

            {/* V Number */}
            <td className="px-4 py-4 text-sm font-medium text-left text-gray-700 whitespace-nowrap">
                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-1 bg-emerald-100/60">
                    <h2 className="text-sm font-normal text-emerald-500">{vNumber}</h2>
                </div>
            </td>

            {/* Major */}
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{major}</td>

            {/* Department */}
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{department}</td>

            {/* Employment History */}
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                {employmentHistory.map((job, index) => (
                    <div key={index} className="mb-4">
                        <p className="text-md text-indigo-600 mb-2">{job.company}</p>
                    </div>
                ))}
            </td>

            {/* Approve/Decline Actions */}
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                {employmentHistory.map((job, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <button
                            onClick={() => onApprove(job._id)}
                            className="px-4 py-2 text-xs text-white bg-cs-black-pearl rounded-full transition-colors duration-200 hover:bg-green-800"
                        >
                            <span>Approve</span>
                        </button>
                        <button
                            onClick={() => onDecline(job._id)}
                            className="px-4 py-2 text-xs text-white bg-red-600 rounded-full transition-colors duration-200 hover:bg-red-700"
                        >
                            <span>Decline</span>
                        </button>
                    </div>
                ))}
            </td>
        </tr>
    );
};

const Inbox = () => {
    const [loading, setLoading] = useState(false);
    const [, setError] = useState(null);
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/faculty/students-emp-status", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const studentData = response.data.filteredStudents;

                // Map through the student data and include vNumber instead of phone and email
                const formattedMembers = studentData.flatMap((cand) => {
                    return cand.employmentHistory.map((job) => ({
                        studentId: cand.student._id,
                        name: cand.student.name,
                        username: cand.student.vNumber, // Assuming username is now vNumber
                        major: cand.student.major,
                        vNumber: cand.student.vNumber, // Add vNumber
                        department: cand.student.degree,
                        employmentHistory: [job], // Each employment history will be unique here
                    }));
                });

                setMembers(formattedMembers);
            } catch (error) {
                console.error("Error fetching student data:", error.response ? error.response.data : error.message);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = members.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleApprove = async (employmentId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:3000/faculty/employment/${employmentId}/request-confirmation`,
                { action: "approved" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the state by filtering out the employment history entry and the member if all jobs are approved or declined
            setMembers((prevMembers) =>
                prevMembers
                    .map((member) => {
                        // Remove the approved job from the employment history
                        const updatedEmploymentHistory = member.employmentHistory.filter(
                            (job) => job._id !== employmentId
                        );

                        return {
                            ...member,
                            employmentHistory: updatedEmploymentHistory, // Update the employment history
                        };
                    })
                    .filter((member) => member.employmentHistory.length > 0) // Remove member if no employment history left
            );
        } catch (err) {
            setError(err);
            console.error("Error approving:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async (employmentId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:3000/faculty/employment/${employmentId}/request-confirmation`,
                { action: "declined" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the state by filtering out the employment history entry and the member if all jobs are approved or declined
            setMembers((prevMembers) =>
                prevMembers
                    .map((member) => {
                        // Remove the declined job from the employment history
                        const updatedEmploymentHistory = member.employmentHistory.filter(
                            (job) => job._id !== employmentId
                        );

                        return {
                            ...member,
                            employmentHistory: updatedEmploymentHistory, // Update the employment history
                        };
                    })
                    .filter((member) => member.employmentHistory.length > 0) // Remove member if no employment history left
            );
        } catch (err) {
            setError(err);
            console.error("Error declining:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="container px-12 py-12 m-auto">
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800">Team members</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">{members.length} users</span>
            </div>
            <div className="overflow-hidden mt-6 bg-white rounded-lg shadow">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left text-sm font-semibold text-gray-600 bg-gray-50">
                            <th className="px-6 py-4">Full Name</th>
                            <th className="px-4 py-4">V Number</th>
                            <th className="px-4 py-4">Major</th>
                            <th className="px-4 py-4">Department</th>
                            <th className="px-4 py-4">Company</th>
                            <th className="px-4 py-4 text-left">Action-Approve/Decline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMembers.map((member, index) => (
                            <MemberRow2
                                key={index}
                                name={member.name}
                                username={member.username}
                                major={member.major}
                                vNumber={member.vNumber}
                                department={member.department}
                                employmentHistory={member.employmentHistory}
                                onApprove={handleApprove}
                                onDecline={handleDecline}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handlePreviousPage}
                    className="px-4 py-2 text-sm text-white bg-gray-500 rounded"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    className="px-4 py-2 text-sm text-white bg-gray-500 rounded"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default Inbox;
