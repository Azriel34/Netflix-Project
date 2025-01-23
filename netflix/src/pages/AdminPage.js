import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";
import { jwtDecode } from 'jwt-decode';
import './AdminPage.css';



const AdminPage = ({ token }) => {
  const [selectedEntity, setSelectedEntity] = useState("");
  const [formData, setFormData] = useState({});
  const [actionType, setActionType] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [userId, setUserId] = useState(null);

  // extract the user id from the JWT 
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // decode the jwt
        setUserId(decoded.userId); // extract the user id 
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { "user-id": userId };
      if (actionType === "create") {
        await axios.post(`/api/${selectedEntity}`, formData, { headers });
        alert(`${selectedEntity} created successfully`);
      } else if (actionType === "edit") {
        await axios.patch(`/api/${selectedEntity}/${formData.id}`, formData, { headers });
        alert(`${selectedEntity} updated successfully`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const headers = { "user-id": userId };
      await axios.delete(`/api/${selectedEntity}/${deleteId}`, { headers });
      alert(`${selectedEntity} deleted successfully`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting");
    }
  };

  const renderFormFields = () => {
    if (selectedEntity === "users") {
      return (
        <>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </>
      );
    } else if (selectedEntity === "categories") {
      return (
        <>
          <input
            type="text"
            placeholder="Category Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label>
            Promoted
            <input
              type="checkbox"
              onChange={(e) => setFormData({ ...formData, promoted: e.target.checked })}
            />
          </label>
        </>
      );
    } else if (selectedEntity === "movies") {
      return (
        <>
          <input
            type="text"
            placeholder="Movie Title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
          />
        </>
      );
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div className="button1-container">
        <button className="manage-button" onClick={() => setSelectedEntity("users")}>Manage Users</button>
        <button className="manage-button" onClick={() => setSelectedEntity("categories")}>Manage Categories</button>
        <button className="manage-button" onClick={() => setSelectedEntity("movies")}>Manage Movies</button>
      </div>

      {selectedEntity && (
       <div> <h2>Manage {selectedEntity}</h2> 
        <div className="button2-container">
          <button onClick={() => setActionType("create")}>Create New</button>
          {selectedEntity !== "users" && (
            <button onClick={() => setActionType("edit")}>Edit Existing</button>
          )}
          <button onClick={() => setActionType("delete")}>Delete</button>
        </div>
        </div>
      )}

      {actionType === "delete" && (
        <div>
          <input
            type="text"
            placeholder={`Enter ${selectedEntity} ID to delete`}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

 {actionType !== "" && actionType !== "delete" && (
  <form onSubmit={handleFormSubmit}>
    {renderFormFields()}
    <button type="submit">
      {actionType === "create" ? "Create" : "Update"}
    </button>
  </form>
 )}
    </div>
  );
};

export default AdminPage;
