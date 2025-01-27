import React, { useState, useEffect } from "react";
import axios from "./axiosInstance";
//import { jwtDecode } from 'jwt-decode';
import './AdminPage.css';



const AdminPage = ({ token }) => {
  const [selectedEntity, setSelectedEntity] = useState("");
  const [formData, setFormData] = useState({});
  const [actionType, setActionType] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [userId, setUserId] = useState(null);

  // extract the user id from the JWT 
  // useEffect(() => {
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token); // decode the jwt
  //       setUserId(decoded.userId); // extract the user id 
  //     } catch (error) {
  //       console.error("Invalid token", error);
  //     }
  //   }
  // }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { "user-id": userId };
      let response;
      console.log(formData);

      if (actionType === "create") {
        response = await axios.post(`/api/${selectedEntity}`, formData, { headers });
      } else if (actionType === "edit") {
        response = await axios.patch(`/api/${selectedEntity}/${formData.id}`, formData, { headers });
      }


      alert(response.data.message || `${selectedEntity} action completed successfully`);
    } catch (error) {
      console.error(error);


      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const headers = { "user-id": userId };
      const response = await axios.delete(`/api/${selectedEntity}/${deleteId}`, { headers });


      alert(response.data.message || `${selectedEntity} deleted successfully`);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred while deleting");
      }
    }
  };

  const renderFormFields = () => {
    if (selectedEntity === "users") {
      return (
        <div className="form1">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          />
          <input
            type="text"
            placeholder="fullName"
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, passWord: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, picture: e.target.files[0] })}
          />
        </div>
      );
    } else if (selectedEntity === "categories") {
      return (
        <div className="form1">
          {actionType === "edit" && (
            <input
              type="text"
              placeholder="Category ID"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          )}
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
        </div>
      );
    } else if (selectedEntity === "movies") {
      return (
        <div className="form1">
          {actionType === "edit" && (
            <input
              type="text"
              placeholder=" MOVIE ID"
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          )}
          <input
            type="text"
            placeholder="Movie Title"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter category ID"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                e.preventDefault();
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  categories: [...(prevFormData.categories || []), e.target.value],
                }));
                e.target.value = '';
              }
            }}
          />
          <textarea
            placeholder="Description"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => {
              setFormData({ ...formData, video: e.target.files[0] });
            }}
          />
        </div>
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
            {selectedEntity !== "users" && (
        <button onClick={() => setActionType("delete")}>Delete</button>
      )}
          </div>
        </div>
      )}

      {actionType === "delete" && (
        <div className="delete-section">
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
          <div className="render-form">{renderFormFields()}</div>
          <button type="submit">
            {actionType === "create" ? "Create" : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPage;
