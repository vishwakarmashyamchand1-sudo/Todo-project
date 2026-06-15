import { Route, Routes } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import api from "./lib/axios";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  useEffect(() => {
    const syncPendingNotes = async () => {
      if (!navigator.onLine) return;
      
      const pendingNotes = JSON.parse(localStorage.getItem("pendingNotes") || "[]");
      if (pendingNotes.length === 0) return;

      let remainingNotes = [];
      let syncedCount = 0;

      for (const note of pendingNotes) {
        try {
          await api.post("/notes", note);
          syncedCount++;
        } catch (error) {
          console.error("Failed to sync note", note, error);
          remainingNotes.push(note);
        }
      }

      if (syncedCount > 0) {
        toast.success(`Successfully synced ${syncedCount} offline note(s) to database!`);
      }

      localStorage.setItem("pendingNotes", JSON.stringify(remainingNotes));
    };

    window.addEventListener("online", syncPendingNotes);
    
    // Attempt sync on mount in case app was closed while offline and reopened online
    syncPendingNotes();

    return () => window.removeEventListener("online", syncPendingNotes);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Option 2: Purple AI Style Background */}
      <div className="absolute inset-0 -z-10 h-full w-full min-h-screen bg-gradient-to-br from-[#a995c4] via-[#3b1d6e] to-[#0f0524]" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};
export default App;