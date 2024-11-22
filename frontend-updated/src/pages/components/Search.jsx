import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Swal from 'sweetalert2'; // Import SweetAlert2

// Helper function to convert image URL to Base64
const getImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

// Modal Component to Display Student Information
const Modal = ({ isOpen, onClose, student, onDeleteJob }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative transform transition-transform duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Student Information</h2>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>V Number:</strong> {student.vNumber}</p>
                    <p><strong>Degree:</strong> {student.degree}</p>
                    <p><strong>Major:</strong> {student.major}</p>
                    <p><strong>Graduation Year:</strong> {student.graduationYear}</p>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-500">Employment History</h3>
                    {student.employmentHistory && student.employmentHistory.length > 0 ? (
                        student.employmentHistory.map((job, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm relative">
                                <p><strong>Company:</strong> {job.company}</p>
                                <p><strong>Position:</strong> {job.position}</p>
                                <p><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}</p>
                                <p><strong>Description:</strong> {job.description}</p>
                                <p><strong>Internship:</strong> {job.isInternship ? 'Yes' : 'No'}</p>
                                <p>
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${job.approvalStatus.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {job.approvalStatus.toUpperCase()}
                                    </span>
                                </p>
                                {/* Delete Button */}
                                <button
                                    onClick={() => onDeleteJob(job._id)}
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                    title="Delete this employment entry"
                                >
                                    &#10005;
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No employment history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// MemberRow Component with "View" and "Download PDF" Buttons
const MemberRow = ({ student, onView, onDownloadPDF }) => (
    <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.vNumber}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.major}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.degree}</td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
            <div className="flex items-center justify-center space-x-2">
                <button
                    className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => onView(student)}
                >
                    View
                </button>
                <button
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => onDownloadPDF(student)}
                >
                    PDF
                </button>
            </div>
        </td>
    </tr>
);

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("name");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [universityLogoBase64, setUniversityLogoBase64] = useState("");

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const logoBase64 = await getImageAsBase64('https://upload.wikimedia.org/wikipedia/en/c/c8/VSU_seal.png');
                setUniversityLogoBase64(logoBase64);
            } catch (error) {
                console.error("Error fetching logo:", error);
            }
        };
        fetchLogo();
    }, []);

    const openModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const refresh_token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:3000/faculty/students-filter', {
                params: {
                    query: searchTerm,
                    filter: filter
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refresh_token}`
                }
            });

            setResults(response.data);
            setCurrentPage(1);
        } catch (err) {
            console.error("Search error:", err);
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Create PDF function
    const createPDF = async (student) => {
        try {
            const refresh_token = localStorage.getItem("token");
            const studentId = student.id || student._id;

            if (!studentId) {
                console.error("Student ID is undefined.");
                alert("Cannot download PDF. Student ID is missing.");
                return;
            }

            const response = await axios.get(`http://localhost:3000/faculty/students/${studentId}/download`, {
                headers: {
                    Authorization: `Bearer ${refresh_token}`,
                },
            });

            const employmentHistory = response.data.employmentHistory || [];
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;

            // University Header Section
            const padding = { x: 20, y: 10 };
            let yPos = 50;
            if (universityLogoBase64) {
                pdf.addImage(universityLogoBase64, 'PNG', padding.x, 10, 30, 30);
            }
            pdf.setFontSize(18);
            pdf.setTextColor(40, 116, 240);
            pdf.text("Virginia State University", pageWidth / 2, 25, { align: "center" });

            // Title for Student Information
            pdf.setFontSize(16);
            pdf.text("Student Information", pageWidth / 2, 45, { align: "center" });

            // Personal Details Section
            yPos += 10;
            pdf.setFillColor(230, 240, 250);
            pdf.rect(padding.x, yPos, pageWidth - 2 * padding.x, 10, "F");
            pdf.setFontSize(14);
            pdf.setTextColor(75, 85, 99);
            pdf.setFont("helvetica", "bold");
            pdf.text("Personal Details", padding.x, yPos + 7);

            yPos += 15;
            const lineHeight = 10;

            const studentData = [
                { label: "Name", value: student.name },
                { label: "V Number", value: student.vNumber },
                { label: "Major", value: student.major },
                { label: "Degree", value: student.degree },
            ];

            const checkPageOverflow = () => {
                if (yPos + lineHeight > pageHeight - 20) {
                    pdf.addPage();
                    yPos = 20;
                }
            };

            // Print Student Data
            studentData.forEach((item) => {
                pdf.setFont("helvetica", "bold");
                pdf.text(`${item.label}:`, padding.x, yPos);
                pdf.setFont("helvetica", "normal");
                pdf.text(item.value, 70, yPos);

                yPos += lineHeight;
                checkPageOverflow();
            });

            // Employment History Section Header
            yPos += 10;
            checkPageOverflow();
            pdf.setFont("helvetica", "bold");
            pdf.setFillColor(230, 240, 250);
            pdf.rect(padding.x, yPos - 5, pageWidth - 2 * padding.x, 10, "F");
            pdf.text("Employment History", padding.x, yPos);
            yPos += 10;

            // Print Employment Data
            employmentHistory.forEach((job, index) => {
                yPos += 5;
                pdf.setFont("helvetica", "bold");
                pdf.setFillColor(230, 240, 250);
                pdf.rect(padding.x, yPos - 5, pageWidth - 2 * padding.x, 10, "F");
                pdf.text(`Job #${index + 1}`, padding.x, yPos + 2);

                yPos += 10;
                checkPageOverflow();

                const jobData = [
                    { label: "Company", value: job.company },
                    { label: "Position", value: job.position },
                    { label: "Start Date", value: new Date(job.startDate).toLocaleDateString() },
                    { label: "End Date", value: job.endDate ? new Date(job.endDate).toLocaleDateString() : "Present" },
                    { label: "Description", value: job.description },
                    { label: "Internship", value: job.isInternship ? "Yes" : "No" },
                    { label: "Status", value: job.approvalStatus },
                ];

                jobData.forEach((item) => {
                    pdf.setFont("helvetica", "bold");
                    pdf.text(`${item.label}:`, padding.x, yPos);
                    pdf.setFont("helvetica", "normal");

                    if (item.label === "Description") {
                        const wrappedText = pdf.splitTextToSize(item.value, pageWidth - 80);
                        wrappedText.forEach(line => {
                            pdf.text(line, 70, yPos);
                            yPos += lineHeight;
                            checkPageOverflow();
                        });
                    } else {
                        pdf.text(item.value, 70, yPos);
                        yPos += lineHeight;
                        checkPageOverflow();
                    }
                });

                yPos += 10;
                checkPageOverflow();
            });

            // Save PDF
            pdf.save(`${student.name}_info.pdf`);
        } catch (error) {
            console.error("Error creating PDF:", error);
            alert(`Failed to create PDF. Error: ${error.message}`);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Function to handle deletion of a job
    const handleDeleteJob = async (jobId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this employment entry?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                if (!selectedStudent || !selectedStudent._id) {
                    throw new Error("Selected student is invalid.");
                }

                // Send delete request to the backend
                await axios.delete(`http://localhost:3000/faculty/students/${selectedStudent._id}/employment/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Update the selectedStudent's employmentHistory in state
                setSelectedStudent((prevStudent) => ({
                    ...prevStudent,
                    employmentHistory: prevStudent.employmentHistory.filter((job) => job._id !== jobId),
                }));

                // Optionally, update the results list if necessary
                setResults((prevResults) =>
                    prevResults.map((student) =>
                        student._id === selectedStudent._id
                            ? {
                                  ...student,
                                  employmentHistory: student.employmentHistory.filter((job) => job._id !== jobId),
                              }
                            : student
                    )
                );

                // Provide user feedback
                Swal.fire(
                    'Deleted!',
                    'Employment entry has been deleted.',
                    'success'
                );
            } catch (err) {
                console.error("Error deleting employment entry:", err);
                Swal.fire(
                    'Error!',
                    err.response?.data?.message || "Failed to delete employment entry.",
                    'error'
                );
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Team Members</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                    {results.length} {results.length === 1 ? "user" : "users"}
                </span>
            </div>

            {/* Filter and Search Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="name">Name</option>
                    <option value="vNumber">V Number</option>
                    <option value="degree">Department</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="w-1/3 py-1.5 px-3 border border-gray-200 rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            {/* Search Results Table */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">V Number</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Major</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-red-500">{error}</td>
                                </tr>
                            ) : paginatedResults.length > 0 ? (
                                paginatedResults.map((student, index) => (
                                    <MemberRow
                                        key={student._id} // Use unique key if available
                                        student={student}
                                        onView={openModal}
                                        onDownloadPDF={createPDF}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">No results found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {results.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : ""}`}
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : ""}`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                student={selectedStudent}
                onDeleteJob={handleDeleteJob}
            />
        </div>
    );
};

export default Search;
