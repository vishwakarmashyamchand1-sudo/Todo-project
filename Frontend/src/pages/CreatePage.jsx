import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !name.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const notePayload = { title, content, name, image };

      if (!navigator.onLine) {
        const pendingNotes = JSON.parse(localStorage.getItem("pendingNotes") || "[]");
        pendingNotes.push(notePayload);
        localStorage.setItem("pendingNotes", JSON.stringify(pendingNotes));
        toast.success("Note saved offline. Will sync automatically when internet returns.");
        navigate("/");
        return;
      }

      await api.post("/notes", notePayload);


      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Name of the Creator</span>
                  </label>
                  <input
                    type="text"
                    placeholder=" Enter Name"
                    className="input input-bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Capture Photo (Optional)</span>
                  </label>
                  <label className="btn btn-secondary w-full cursor-pointer">
                    📷 Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  </label>
                  {image && (
                    <div className="relative mt-2">
                      <img src={image} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg border border-base-300" />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-circle btn-error absolute top-6 right-2"
                        onClick={() => setImage("")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;