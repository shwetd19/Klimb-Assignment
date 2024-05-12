import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:3000/candidates/upload/", formData);

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-4xl">Add Excel File</h1>
      </div>
      <div className="rounded-lg border-black border-2 p-10">
        <h1 className="text-3xl mb-5">Add candidates to database</h1>
        <div>
          <form className="upload" onSubmit={handleSubmit}>
            <input
              type="file"
              name="uploadFile"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
            <input
              className="border-black hover:bg-slate-200 rounded-lg p-2"
              type="submit"
              value="Upload"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
