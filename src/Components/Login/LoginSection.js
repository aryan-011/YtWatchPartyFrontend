import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../SnackBar";
import axios from "axios";
import { motion } from "framer-motion";
import { LockClosedIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

const AuthSection = ({ setAuth }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  // Get current location to handle redirect_url
  const { showSnackbar } = useSnackbar();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const handleAuth = async (data) => {
    setLoading(true);
    try {
      const endpoint = isSignIn ? "/auth/login" : "/auth/signup";
      const payload = isSignIn
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

      const response = await axios.post(`${baseURL}${endpoint}`, payload, { withCredentials: true });

      if (response.status === 200) {
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("id", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        setAuth(true);

        // Check if there's a redirect URL, otherwise navigate to home
        const params = new URLSearchParams(location.search);
        const redirectUrl = params.get("redirect_url") || "/";
        navigate(redirectUrl);

        showSnackbar({ message: "Successfully logged in", useCase: "success" });
      }
    } catch (error) {
      showSnackbar({
        message: error.response?.data?.message || "Error occurred. Please try again",
        useCase: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              {isSignIn ? "Welcome Back!" : "Create Account"}
            </h2>
            <form onSubmit={handleSubmit(handleAuth)} className="space-y-6">
              {!isSignIn && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: !isSignIn })}
                      className="pl-10 w-full py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    {...register("email", { required: true })}
                    className="pl-10 w-full py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    {...register("password", { required: true })}
                    className="pl-10 w-full py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    isSignIn ? "Sign In" : "Sign Up"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {isSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthSection;