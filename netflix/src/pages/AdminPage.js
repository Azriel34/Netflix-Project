import React, { useState } from "react";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
    const [formType, setFormType] = useState("");
    const [formData, setFormData] = useState({});
    const [statusMessage, setStatusMessage] = useState("");


 const handleButtonClick = (type) => {
        setFormType(type);
        setFormData({});
        setStatusMessage("");
    };

    const handleInputChange = (e) => {
        const { name, value, type} = e.target;
        setFormData({
          ...formData,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const apiAddress = `http://localhost:5000/api/${formType}`;
          const header = {
            headers: { "Content-Type": "multipart/form-data" },
          };
          const data = new FormData();

          for (const key in formData) {
            data.append(key, formData[key]);
          }

          await axios.post(apiAddress, data, header);
      setStatusMessage("Successfully submitted!");
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to submit. Please try again.");
    }
  };

  const renderFields = () => {
    switch (formType) {
      case "user":
        return (
          <>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );

      case "category":
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="promoted">Promoted</label>
              <input
                type="checkbox"
                id="promoted"
                name="promoted"
                checked={formData.promoted || false}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "movie":
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Movie Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categories">Categories</label>
              <input
                type="text"
                id="categories"
                name="categories"
                placeholder="Separate with commas"
                value={formData.categories || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="video">Upload Video</label>
              <input
                type="file"
                id="video"
                name="video"
                onChange={(e) =>
                  setFormData({ ...formData, video: e.target.files[0] })
                }
              />
            </div>
          </>
        );

      default:
        return <p>Please select an option to manage.</p>;
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      <div className="buttons">
        <button onClick={() => handleButtonClick("user")}>Manage Users</button>
        <button onClick={() => handleButtonClick("category")}>
          Manage Categories
        </button>
        <button onClick={() => handleButtonClick("movie")}>Manage Movies</button>
      </div>

      {formType && (
        <div className="form-container">
          <h2>{`Manage ${formType}`}</h2>
          <form onSubmit={handleSubmit}>
            {renderFields()}
            <button type="submit">Submit</button>
          </form>
          {statusMessage && <p>{statusMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default AdminPage;