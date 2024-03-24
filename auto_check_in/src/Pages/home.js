import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function Home() {
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUpload = async (event) => {
    console.log("text")
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    await axios
      .post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setUploadMessage("File uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  };

  return (
    <div className="homeContainer" style={{ backgroundColor: "blue", color: "white", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>This is the home page</h1>
      <Link to="/feed" style={{ color: "white" }}>Go to video feed</Link>
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2>Upload Images</h2>
        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={handleUpload} />
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
}
