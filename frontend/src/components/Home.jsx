import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../contexts/authContext";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
    
  const handleGoToApp = () => {
    // Redirect based on plan status
    if (!currentUser.plan || currentUser.plan.status !== "active") {
      navigate("/plans"); // user has no active subscription
    } else {
      navigate("/dashboard"); // user has an active subscription
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar/Header */}
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {!currentUser ? (
          // Not logged in
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Task Manager ✅
            </h1>
            <p className="text-gray-600 max-w-xl mb-8">
              Organize your tasks, stay productive, and achieve your goals with ease.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </div>
          </>
        ) : (
          // Logged in
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome back, {currentUser.displayName || currentUser.email}!
            </h1>
            <p className="text-gray-600 max-w-xl mb-8">
              {(!currentUser.plan || currentUser.plan.status !== "active")
                ? "You haven't subscribed to a plan yet. Choose one to start managing your tasks."
                : ""}
            </p>
            <button
              onClick={handleGoToApp}
              className="px-6 py-3 rounded-2xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              {(!currentUser.plan || currentUser.plan.status !== "active")
                ? "Choose Plan"
                : "Go to Dashboard"}
            </button>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
