import React, { useState, useEffect } from 'react';

function App ()  {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [id, setId] = useState(null);
  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const jsonData = await response.json();
      setId(jsonData.id); // Set the ID state
      setMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('File upload failed');
    }
  };

  useEffect(() => {
    if (id) {
      const fetchImage = async () => {
        const form = new FormData();
        form.append("id", id);

        try {
          const response = await fetch('http://localhost:8000/uploads/', {
            method: "POST",
            body: form,
          });

          const data = await response.json();
          setImg(`data:image/jpeg;base64,${data.img}`);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };

      fetchImage();
    }
  }, [id]); // Dependency array ensures this runs only when 'id' changes

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>File:</label>
          <input type="file" name="file" onChange={handleChange} accept=".jpg, .jpeg" required />
        </div>
        <button type="submit">Upload</button>
      </form>
      {img && <img src={img} alt="Uploaded" />}
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
