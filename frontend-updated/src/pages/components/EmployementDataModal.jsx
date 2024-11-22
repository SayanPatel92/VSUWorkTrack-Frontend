import React, { useState, useEffect } from "react";
import axios from "axios";
// If using a local image, uncomment the line below and ensure the path is correct
// import backgroundImage from '../path-to-your-image.jpg';

const EmploymentData = () => {
  const [employmentList, setEmploymentList] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [error, setError] = useState(null);

  // Fetch employment details
  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/student-info/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmploymentList(response.data.employmentHistory); // Assuming response.data contains employment details
      } catch (error) {
        console.error("Error fetching employment details:", error);
        setError(
          error.response?.data?.message || "Failed to fetch employment details"
        );
      }
    };

    fetchEmploymentDetails();
  }, []);

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
              aria-hidden="true"
              focusable="false"
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
              aria-hidden="true"
              focusable="false"
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
              aria-hidden="true"
              focusable="false"
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

  // Handle form submission (add or update employment details)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/student-info/employment`;

      const method = "post";

      // Prepare data to send
      const employmentData = { ...selectedEmployment };
      if (employmentData.isPresent) {
        delete employmentData.endDate; // Remove endDate if present
      }

      const response = await axios[method](url, employmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh employment list
        setEmploymentList((prevList) =>
          selectedEmployment._id
            ? prevList.map((item) =>
                item._id === selectedEmployment._id
                  ? response.data.result
                  : item
              )
            : [...prevList, response.data.result]
        );
        setSelectedEmployment(null); // Close modal
      } else {
        setError(response.data.message || "Error saving employment details");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to save employment details"
      );
    }
  };

  // Open modal for adding or editing employment
  const openModal = (employment = null) => {
    if (employment) {
      setSelectedEmployment({
        ...employment,
        isPresent: employment.isPresent || false, // Ensure isPresent is set
      });
    } else {
      setSelectedEmployment({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        isInternship: false,
        isPresent: false, // Initialize isPresent
      });
    }
  };

  // Handle modal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Close modal
  const closeModal = () => {
    setSelectedEmployment(null);
    setError(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      // If using a local image, use style attribute as shown below
      // style={{ backgroundImage: `url(${backgroundImage})` }}
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-8 relative">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Employment <span className="text-indigo-600">History</span>
        </h2>

        {/* Add Employment Button aligned to the right */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Add Employment
          </button>
        </div>

        {/* List of employment details */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {employmentList.map((employment) => {
              const statusStyles = getStatusStyles(employment.approvalStatus);
              return (
                <div
                  key={employment._id}
                  className="border p-6 rounded-lg shadow bg-white"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${statusStyles.bg}`}
                  >
                    {statusStyles.icon}
                    <h3 className={`${statusStyles.text} text-sm font-normal`}>
                      {employment.approvalStatus.toUpperCase()}
                    </h3>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">
                    {employment.company}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Position:</strong> {employment.position}
                  </p>
                  <p className="text-gray-700">
                    <strong>Start Date:</strong>{" "}
                    {new Date(employment.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>End Date:</strong>{" "}
                    {employment.isPresent
                      ? "Present"
                      : employment.endDate
                      ? new Date(employment.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Description:</strong> {employment.description}
                  </p>
                  <p className="text-gray-700">
                    <strong>Internship:</strong> {employment.isInternship ? 'Yes' : 'No'}
                  </p>
                  <button
                    onClick={() => openModal(employment)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
            {employmentList.length === 0 && (
              <p className="text-center text-gray-500">
                No employment history available.
              </p>
            )}
          </div>
        </div>

        {/* Modal for adding or editing employment details */}
        {selectedEmployment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4 sm:mx-auto">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-6 text-center">
                {selectedEmployment._id ? "Edit" : "Add"} Employment{" "}
                <span className="text-indigo-600">Details</span>
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={selectedEmployment.company}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:border-indigo-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={selectedEmployment.position}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:border-indigo-600 rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={selectedEmployment.startDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 focus:border-indigo-600 rounded-lg"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={selectedEmployment.endDate}
                        onChange={handleChange}
                        required={!selectedEmployment.isPresent} // Make required based on isPresent
                        disabled={selectedEmployment.isPresent} // Disable if isPresent is true
                        className={`w-full p-3 border ${
                          selectedEmployment.isPresent
                            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                            : "border-gray-300 focus:border-indigo-600"
                        } rounded-lg`}
                      />
                    </div>
                  </div>
                  {/* Present Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPresent"
                      checked={selectedEmployment.isPresent}
                      onChange={(e) =>
                        setSelectedEmployment((prev) => ({
                          ...prev,
                          isPresent: e.target.checked,
                          endDate: e.target.checked ? "" : prev.endDate, // Clear endDate if present is checked
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-gray-700">
                      Present (Current Job)
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={selectedEmployment.description}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:border-indigo-600 rounded-lg"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isInternship"
                      checked={selectedEmployment.isInternship}
                      onChange={(e) =>
                        setSelectedEmployment((prev) => ({
                          ...prev,
                          isInternship: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-gray-700">
                      Internship
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
              {error && (
                <div className="mt-4 text-red-600">
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmploymentData;
