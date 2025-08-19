import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDeleteFile = async (file: FSItem) => {
    if (!window.confirm(`Delete file "${file.name}"?`)) return;

    try {
      await fs.delete(file.path);
      await kv.flush();
      await loadFiles(); // force page refresh
    } catch (err) {
      console.error(`Failed to delete ${file.name}:`, err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ This will delete ALL files and app data. Proceed?"))
      return;

    try {
      await Promise.all(files.map((file) => fs.delete(file.path))); // wait for all deletes
      await kv.flush();
      await loadFiles(); // ✅ refresh list after wipe
    } catch (err) {
      console.error("Failed to wipe data:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="p-2">
        <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
                <p>Authenticated as: {auth.user?.username}</p>
            </nav>
            
      <div className="p-1">
        
      </div>

      <h2 className="mt-6 mb-2 font-semibold">Existing files:</h2>
      <div className="flex flex-col gap-4">
        {files.length === 0 && <p>No files found.</p>}
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-row gap-15 items-center p-2 rounded-md"
          >
            <p>{file.name}</p>
            <button
              className="bg-red-400 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 flex items-center justify-center"
              onClick={() => handleDeleteFile(file)}
            >
              <img
                src="/icons/delete.svg"
                alt="Delete"
                className="w-5 h-5 invert"
              />
            </button>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
            onClick={handleDeleteAll}
          >
            Wipe All App Data
          </button>
        </div>
      )}
    </div>
  );
};

export default WipeApp;
