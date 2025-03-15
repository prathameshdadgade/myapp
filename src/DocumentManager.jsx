
import React, { useState, useEffect } from "react";
import "./DocumentManager.css";

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(savedDocuments);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocument = () => {
    if (!docName || !docDescription || !docFile) {
      alert("Please fill all fields and upload a file.");
      return;
    }
    const newDocuments = [...documents, { docName, docDescription, docFile }];
    setDocuments(newDocuments);
    localStorage.setItem("documents", JSON.stringify(newDocuments));
    setDocName("");
    setDocDescription("");
    setDocFile(null);
  };

  const handleEditDocument = (index) => {
    setEditingIndex(index);
    setDocName(documents[index].docName);
    setDocDescription(documents[index].docDescription);
    setDocFile(documents[index].docFile); // Preserve existing file
  };

  const handleUpdateDocument = () => {
    if (editingIndex === null) return;
    const updatedDocuments = [...documents];
    updatedDocuments[editingIndex] = {
      docName,
      docDescription,
      docFile: docFile || documents[editingIndex].docFile, // Retain old file if not changed
    };
    setDocuments(updatedDocuments);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setDocName("");
    setDocDescription("");
    setDocFile(null);
    setEditingIndex(null);
  };

  const handleDeleteDocument = (index) => {
    const filteredDocuments = documents.filter((_, i) => i !== index);
    setDocuments(filteredDocuments);
    localStorage.setItem("documents", JSON.stringify(filteredDocuments));
  };

  return (
    <div className="document-manager">
      <h2>Document Manager</h2>
      <input
        type="text"
        placeholder="Document Name"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
      />
      <textarea
        placeholder="Document Description"
        value={docDescription}
        onChange={(e) => setDocDescription(e.target.value)}
      />
      <input type="file" accept=".pdf,.jpeg,.png" onChange={handleFileChange} />
      {editingIndex === null ? (
        <button className="upload-btn" onClick={handleAddDocument}>Upload</button>
      ) : (
        <button className="update-btn" onClick={handleUpdateDocument}>Update</button>
      )}
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            <h3>{doc.docName}</h3>
            <p>{doc.docDescription}</p>

            <div className="file-preview">
              {doc.docFile?.startsWith("data:image") ? (
                <img src={doc.docFile} alt="Preview" className="preview-image" />
              ) : doc.docFile?.startsWith("data:application/pdf") ? (
                <embed src={doc.docFile} type="application/pdf" className="preview-pdf" />
              ) : null}
            </div>

            <a href={doc.docFile} target="_blank" rel="noopener noreferrer" download>
              View File
            </a>

            <div className="btn-group">
              <button className="edit-btn" onClick={() => handleEditDocument(index)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteDocument(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentManager;

