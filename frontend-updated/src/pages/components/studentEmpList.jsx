// Student Emp List
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const ITEMS_PER_PAGE = 6;

const MemberRow = ({ student, imgSrc, onDownload }) => (
    <tr>
        <td className="px-6 py-6 text-sm font-medium text-gray-700 whitespace-nowrap">
            <div className="inline-flex items-center gap-x-3">
                <div className="flex items-center gap-x-2">
                    <div>
                        <h2 className="font-medium text-gray-800">{student.name}</h2>
                        <p className="text-sm font-normal text-gray-600">@{student.vNumber}</p>
                    </div>
                </div>
            </div>
        </td>
        <td className="px-4 py-4 text-sm font-medium text-left text-gray-700 whitespace-nowrap">
            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-1 bg-emerald-100/60">
                <h2 className="text-sm font-normal text-emerald-500">{student.vNumber}</h2>
            </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-500">{student.degree}</td>
        <td className="px-4 py-4 text-sm text-gray-500">{student.major}</td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
            <div className="flex items-center gap-x-2">
                <p className="px-3 py-1 text-xs text-indigo-500 text-center rounded-full bg-indigo-100/60">
                    {student.major}
                </p>
            </div>
        </td>
        <td className="px-4 py-4 text-sm text-center whitespace-nowrap">
            <button
                className="px-3 py-1 text-lg text-red-500 border border-red-500 rounded hover:bg-red-800 hover:text-white"
                onClick={() => onDownload(student)}
            >
                <span>Download</span>
            </button>
        </td>
    </tr>
);

// Helper function to convert image URL to Base64
async function getImageAsBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

// University Logo URL
const logoUrl = 'https://upload.wikimedia.org/wikipedia/en/c/c8/VSU_seal.png'; // Replace with your image URL

const StudentEmpList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [universityLogoBase64, setUniversityLogoBase64] = useState("");

    useEffect(() => {
        const fetchLogo = async () => {
            const logoBase64 = await getImageAsBase64(logoUrl);
            setUniversityLogoBase64(logoBase64);
        };

        fetchLogo();
    }, []);

    const createPDF = async (student) => {
        const refresh_token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/faculty/students/${student.id}/download`, {
            headers: {
                Authorization: `Bearer ${refresh_token}`,
            },
        }); 

        const employmentHistory = response.data.employmentHistory;
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        // Tailwind-inspired Styles
        const colors = {
            primary: [40, 116, 240],
            lightBlue: [230, 240, 250],
            textGray: [75, 85, 99],
        };
        const fonts = {
            title: 18,
            sectionHeader: 14,
            body: 12,
        };

        // University Header Section
        const padding = { x: 20, y: 10 };
        let yPos = 50;
        pdf.addImage(universityLogoBase64, 'PNG', padding.x, 10, 30, 30);
        pdf.setFontSize(fonts.title);
        pdf.setTextColor(...colors.primary);
        pdf.text("Virginia State University", pageWidth / 2, 25, { align: "center" });

        // Title for Student Information
        pdf.setFontSize(16);
        pdf.setTextColor(...colors.primary);
        pdf.text("Student Information", pageWidth / 2, 45, { align: "center" });

        // Personal Details Section
        const sectionSpacing = 10;
        yPos += sectionSpacing;
        pdf.setFillColor(...colors.lightBlue);
        pdf.rect(padding.x, yPos, pageWidth - 2 * padding.x, 10, "F");
        pdf.setFontSize(fonts.sectionHeader);
        pdf.setTextColor(...colors.textGray);
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
        const employmentData = employmentHistory.flatMap((job) => [
            { label: "Company", value: job.company },
            { label: "Position", value: job.position },
            { label: "Start-Date", value: job.startDate },
            { label: "End-Date", value: job.endDate },
            { label: "Description", value: job.description },
            { label: "Internship", value: job.isInternship ? "Yes" : "No" },
            { label: "Status", value: job.approvalStatus },
            { label:"", value:  `yPos += 2 * lineHeight` }
        ]);
        
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
        yPos += sectionSpacing;
        checkPageOverflow();
        pdf.setFont("helvetica", "bold");
        pdf.setFillColor(...colors.lightBlue);
        pdf.rect(padding.x, yPos - 5, pageWidth - 2 * padding.x, 10, "F");
        pdf.text("Employment History", padding.x, yPos);
        yPos += sectionSpacing;
        
        employmentData.forEach((item) => {
            pdf.setFont("helvetica", "bold");
            if(item.label === '') {
                yPos += 2 * lineHeight;
                pdf.setFont("helvetica", "bold");
                pdf.setFillColor(...colors.lightBlue);
                pdf.rect(padding.x, yPos - 5, pageWidth - 2 * padding.x, 10, "F");
                return;
            }
            
            if (item.label === "Description") {
                pdf.text(`${item.label}:`, padding.x, yPos);
                pdf.setFont("helvetica", "normal");

                const wrappedText = pdf.splitTextToSize(item.value, pageWidth - 80);
                wrappedText.forEach(line => {
                    pdf.text(line, 70, yPos);
                    yPos += lineHeight;
                    checkPageOverflow();
                });
            } else {
                pdf.text(`${item.label}:`, padding.x, yPos);
                pdf.setFont("helvetica", "normal");
                pdf.text(item.value, 70, yPos);
                yPos += lineHeight;
                checkPageOverflow();
            }
        
            // Add two lines of space after each employment history entry
            checkPageOverflow();
        });
        
        // Save PDF
        pdf.save(`${student.name}_info.pdf`);
    }        

    useEffect(() => {
        const fetchData = async () => {
            try {
                const refresh_token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/faculty/students", {
                    headers: {
                        Authorization: `Bearer ${refresh_token}`,
                    },
                });
                const students = response.data.map(student => ({
                    id: student._id,
                    name: student.name,
                    username: student.vNumber,
                    major: student.major || "Student",
                    vNumber: student.vNumber,
                    degree: student.degree,
                    imgSrc: "https://via.placeholder.com/150",
                }));

                setMembers(students);
            } catch (error) {
                console.error("Error fetching student data:", error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = members.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container px-12 py-12 m-auto w-max-content">
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800">Team members</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">{members.length} users</span>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">
                                            <div className="flex items-center gap-x-3">
                                                <span>Name</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">
                                            <div className="flex items-center gap-x-3">
                                                <span>V Number</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="py-3.5 px-2 text-sm font-normal text-left text-gray-500">
                                            <div className="flex items-center gap-x-3">
                                                <span>Major</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">
                                            <div className="flex items-center gap-x-3">
                                                <span>Department</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">
                                            <div className="flex items-center gap-x-3">
                                                <span>Action</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedMembers.map((member, index) => (
                                        <MemberRow key={index} student={member} onDownload={createPDF} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-white rounded-lg ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    Prev
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-white rounded-lg ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StudentEmpList;
