import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCreators, setAllCreators] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  const fetchNotes = async (searchName = "") => {
    try {
      setLoading(true);
      const url = searchName ? `/notes?name=${searchName}` : "/notes";
      const res = await api.get(url);
      console.log(res.data);
      setNotes(res.data);
      try {
        localStorage.setItem("cachedNotes", JSON.stringify(res.data));
        console.log("Saving notes:", res.data);
        console.log("LocalStorage:", localStorage.getItem("cachedNotes"));
      } catch (cacheError) {
        console.warn("Cache save failed (Quota Exceeded):", cacheError);
      }
      
      if (!searchName) {
        const uniqueCreators = [...new Set(res.data.map(n => n.name).filter(Boolean))];
        setAllCreators(uniqueCreators);
      }
      setIsRateLimited(false);
    } catch (error) {
      console.log("Error fetching notes", error);
      console.log("Entered catch block");

      const cachedNotes = localStorage.getItem("cachedNotes");
      console.log("Cached Notes:", cachedNotes);
      
      if (cachedNotes) {
        setNotes(JSON.parse(cachedNotes));
        toast.success("Offline Mode - Turn on Data for latest notes");
        return;
      }

      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") === "true") {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && searchQuery === "" && !loading && <NotesNotFound />}

        {(!isRateLimited) && (
          <div className="mb-8 flex justify-center gap-2 relative z-50">
            <div className="relative w-full max-w-md">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search notes by creator name..."
                className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-primary focus:outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setShowSuggestions(false)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowSuggestions(false);
                    fetchNotes(searchQuery);
                  }
                }}
              />
              {showSuggestions && searchQuery.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden z-50">
                  {allCreators
                    .filter((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((creator, idx) => (
                       <li 
                         key={idx}
                         className="px-4 py-3 text-white hover:bg-primary/20 cursor-pointer border-b border-gray-700 last:border-b-0"
                         onMouseDown={(e) => {
                           e.preventDefault();
                           setSearchQuery(creator);
                           setShowSuggestions(false);
                           fetchNotes(creator);
                         }}
                       >
                         {creator}
                       </li>
                  ))}
                  {allCreators.filter((c) => c.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <li className="px-4 py-3 text-gray-400 italic">No matching names found</li>
                  )}
                </ul>
              )}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowSuggestions(false);
                fetchNotes(searchQuery);
              }}
              disabled={loading}
            >
              Search
            </button>
          </div>
        )}

        {notes.length === 0 && searchQuery !== "" && !loading && (
          <div className="text-center text-base-content/70 py-10 text-lg font-medium">
            No notes found for "{searchQuery}"
          </div>
        )}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;