import React, { useState } from "react";
import { LucideIcon } from "./LucideIcon";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";

interface AuthScreenProps {
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  // UX switches
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg("Please provide your display name.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up API call
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role,
          }),
        });

        const json = await response.json();
        if (response.ok && json.success) {
          setSuccessMsg("Account generated successfully! Signing you in now...");
          
          // Auto log them in
          const loginResp = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              password: password.trim(),
            }),
          });
          
          const loginJson = await loginResp.json();
          if (loginResp.ok && loginJson.success) {
            setTimeout(() => {
              onAuthSuccess(loginJson.user, loginJson.token);
            }, 800);
          } else {
            setErrorMsg(loginJson.message || "Failed to auto-sign in.");
          }
        } else {
          setErrorMsg(json.message || "Sign up was unsuccessful.");
        }
      } else {
        // Log in API call
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        });

        const json = await response.json();
        if (response.ok && json.success) {
          onAuthSuccess(json.user, json.token);
        } else {
          setErrorMsg(json.message || "Invalid credentials provided.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B0C0F] flex items-center justify-center p-4">
      {/* Container widget */}
      <div className="w-full max-w-[950px] bg-white dark:bg-[#111216] rounded-[24px] border border-gray-150/80 dark:border-gray-800/60 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
        
        {/* Left column - graphic brand panel */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gray-950 dark:bg-white text-white dark:text-gray-950 relative overflow-hidden">
          {/* Semicircle styling pattern in corner */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 dark:bg-black/[0.03] translate-x-12 -translate-y-12"></div>
          <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-white/5 dark:bg-black/[0.03]"></div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 text-gray-950 dark:text-white flex items-center justify-center font-black text-sm">
              E
            </span>
            <span className="font-extrabold tracking-wider text-sm uppercase">Ecomora Control</span>
          </div>

          <div className="my-auto space-y-4 relative z-10">
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Intuitive management panel for web agencies.
            </h1>
            <p className="text-gray-400 dark:text-gray-600 text-sm leading-relaxed max-w-sm">
              Formulate real-time checkout vouchers, structure retail departments, and manage global inventory records gracefully.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600 relative z-10 font-bold tracking-widest uppercase">
            <span>SECURE AUTH PORTAL</span>
            <span>•</span>
            <span>API v1.0.4</span>
          </div>
        </div>

        {/* Right column - dynamic forms */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Tab switchers */}
            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`text-lg font-extrabold pb-1.5 border-b-2 transition-all cursor-pointer ${
                  !isSignUp
                    ? "border-gray-950 dark:border-white text-gray-950 dark:text-white"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="btn-tab-signin"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`text-lg font-extrabold pb-1.5 border-b-2 transition-all cursor-pointer ${
                  isSignUp
                    ? "border-gray-950 dark:border-white text-gray-950 dark:text-white"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                id="btn-tab-signup"
              >
                Sign Up
              </button>
            </div>

            {/* Error & Success elements */}
            <AnimatePresence mode="popLayout">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-xl text-xs font-semibold border border-rose-100 dark:border-rose-955 mb-4 flex items-start gap-2"
                  id="auth-error-alert"
                >
                  <LucideIcon name="alertcircle" size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs font-semibold border border-emerald-100 dark:border-emerald-955 mb-4 flex items-start gap-2"
                  id="auth-success-alert"
                >
                  <LucideIcon name="checkcircle" size={14} className="shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                        Display Name
                      </label>
                      <div className="relative mt-1.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <LucideIcon name="user" size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white/40"
                          id="signup-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                        Intended Role
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setRole("user")}
                          className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            role === "user"
                              ? "bg-gray-950 text-white dark:bg-white dark:text-gray-955 border-gray-950 dark:border-white shadow-xs"
                              : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          User
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("admin")}
                          className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            role === "admin"
                              ? "bg-gray-950 text-white dark:bg-white dark:text-gray-955 border-gray-950 dark:border-white shadow-xs"
                              : "border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LucideIcon name="mail" size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white/40"
                    id="auth-email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => alert("Please sign up for a new account with your matching credentials to continue, or write 'password123' as prefilled password on our demo accounts.")}
                      className="text-[10px] uppercase font-bold tracking-widest text-[#5c6070] dark:text-[#9ea3bd] hover:opacity-85"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LucideIcon name="lock" size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white/40"
                    id="auth-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                  >
                    <LucideIcon name={showPassword ? "eyeoff" : "eye"} size={14} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-950 dark:bg-white text-white dark:text-gray-950 py-3 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition shadow-xs mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="btn-auth-submit"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white dark:border-gray-950/20 dark:border-t-gray-950 rounded-full animate-spin"></span>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Access Terminal"
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-gray-400 font-semibold">
              {!isSignUp ? (
                <p>
                  Don't have an authentication account?{" "}
                  <button
                    onClick={toggleAuthMode}
                    className="text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
                  >
                    Generate and register one here
                  </button>
                </p>
              ) : (
                <p>
                  Already have access credentials?{" "}
                  <button
                    onClick={toggleAuthMode}
                    className="text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer"
                  >
                    Use sign in credentials
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
