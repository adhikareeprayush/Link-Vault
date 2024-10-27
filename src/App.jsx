import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '', link: '' });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      const copyBtn = document.querySelector('.copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.disabled = true;

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.disabled = false;
      }, 2000);
    });
  }

  const handleAlert = (message, type, link = '') => {
    setAlert({ show: true, message, type, link });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      handleAlert('Please select a file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://file.io', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.success) {
        console.log(result);

        const link = result.link;
        const message = (
          <div className="alert-content">
            <div>File uploaded successfully!</div>
            <div className="link-container">
              <a href={link} target="_blank" rel="noopener noreferrer" className="alert-link">
                {link}
              </a>
              <button
                className="copy-btn"
                onClick={() => handleCopyLink(link)}
              >
                Copy
              </button>
            </div>
          </div>
        );
        handleAlert(message, 'success', link);

        // Clear the file input
        setFile(null);
        e.target.reset();
      } else {
        handleAlert('File upload failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      handleAlert('Network error. Please check your connection.', 'error');
    }
  }

  return (
    <div className='App'>
      {alert.show && (
        <div className={`alert ${alert.type}`}>
          <div className="alert-main">
            {alert.message}
          </div>
          <button
            className="alert-close"
            onClick={() => setAlert({ show: false, message: '', type: '', link: '' })}
          >
            ×
          </button>
        </div>
      )}

      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="input-grp">
            <label htmlFor="file">Upload File</label>
            <input type="file" id="file" onChange={handleFileChange} />
          </div>

          <div className="input-grp">
            <button type="submit">Upload</button>
          </div>
        </form>
      </div>

      <span className="note">
        Share files up to 2 GB,
        Hourly upload limit: 4 GB,
        Files auto-deleted after 1 download
      </span>
    </div>
  )
}

export default App