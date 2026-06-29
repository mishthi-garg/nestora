/**
 * Auth.jsx — Full Supabase auth flow
 * Screens: Login · Sign Up · Forgot Password · Verify OTP
 *
 * Usage:
 *   import Auth from "./Auth";
 *   import { supabase } from "./supabaseClient";
 *   <Auth supabase={supabase} onAuthenticated={(session) => ...} />
 *
 * The component is self-contained — it manages its own screen state.
 * When auth succeeds it calls onAuthenticated(session) so the parent
 * can swap to the main app.
 */

import { useState } from "react";

// ─── tiny shared primitives ───────────────────────────────────────────────────

function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-700 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full bg-[rgb(40,20,9)] text-white rounded-lg py-2.5 text-sm font-medium
                 hover:bg-[rgb(60,35,20)] disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors cursor-pointer"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function GhostButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="text-sm text-yellow-700 hover:underline cursor-pointer bg-transparent border-none p-0"
    >
      {children}
    </button>
  );
}

function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-[rgb(245,250,240)] border-[rgb(122,139,105)] text-[rgb(80,100,65)]",
  };
  return (
    <div className={`rounded-lg border text-sm px-3 py-2 ${styles[type]}`}>
      {message}
    </div>
  );
}

// Decorative seedling / leaf mark that matches the maternal health theme
function BrandMark() {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="w-12 h-12 rounded-full bg-[rgb(253,246,237)] border-2 border-yellow-700 flex items-center justify-center">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="rgb(133,79,11)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V12" />
          <path d="M12 12C12 12 7 10 7 5a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 5-5 7-5 7z" />
        </svg>
      </div>
    </div>
  );
}

// ─── individual screens ───────────────────────────────────────────────────────

function LoginScreen({ supabase, onAuthenticated, onGoSignUp, onGoForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    onAuthenticated(data.session);
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <BrandMark />
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[rgb(40,20,9)]">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue your journey</p>
      </div>

      <Alert type="error" message={error} />

      <Input
        label="Email"
        id="login-email"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm text-gray-700">Password</label>
          <GhostButton type="button" onClick={onGoForgot}>Forgot password?</GhostButton>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-yellow-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
      </div>

      <PrimaryButton loading={loading}>Sign in</PrimaryButton>

      <p className="text-center text-sm text-gray-500">
        No account?{" "}
        <GhostButton type="button" onClick={onGoSignUp}>Create one</GhostButton>
      </p>
    </form>
  );
}

function SignUpScreen({ supabase, onGoLogin, onGoVerify }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function passwordStrength(pw) {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { label: "Too short", color: "bg-red-400" },
      { label: "Weak", color: "bg-red-400" },
      { label: "Fair", color: "bg-yellow-400" },
      { label: "Good", color: "bg-yellow-600" },
      { label: "Strong", color: "bg-green-500" },
    ];
    return { score, ...levels[score] };
  }

  const strength = passwordStrength(password);

  async function handleSignUp(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    onGoVerify(email);
  }

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <BrandMark />
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[rgb(40,20,9)]">Create account</h1>
        <p className="text-sm text-gray-500 mt-1">Your support system starts here</p>
      </div>

      <Alert type="error" message={error} />

      <Input
        label="Full name"
        id="signup-name"
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        id="signup-email"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="text-sm text-gray-700">Password</label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-yellow-700"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        {password && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : "bg-gray-200"}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500 min-w-[40px]">{strength.label}</span>
          </div>
        )}
      </div>

      <Input
        label="Confirm password"
        id="signup-confirm"
        type="password"
        placeholder="Re-enter your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        error={confirm && password !== confirm ? "Passwords don't match" : ""}
        required
      />

      <PrimaryButton loading={loading}>Create account</PrimaryButton>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <GhostButton type="button" onClick={onGoLogin}>Sign in</GhostButton>
      </p>
    </form>
  );
}

function ForgotPasswordScreen({ supabase, onGoLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setSent(true);
  }

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-4">
      <BrandMark />
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[rgb(40,20,9)]">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">
          {sent ? "Check your inbox" : "Enter your email and we'll send a link"}
        </p>
      </div>

      {sent ? (
        <>
          <div className="rounded-lg bg-[rgb(245,250,240)] border border-[rgb(122,139,105)] text-[rgb(80,100,65)] text-sm px-4 py-3">
            A reset link was sent to <strong>{email}</strong>. Check your spam folder if you don't see it within a minute.
          </div>
          <PrimaryButton type="button" onClick={onGoLogin}>Back to sign in</PrimaryButton>
        </>
      ) : (
        <>
          <Alert type="error" message={error} />
          <Input
            label="Email"
            id="forgot-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <PrimaryButton loading={loading}>Send reset link</PrimaryButton>
          <p className="text-center text-sm text-gray-500">
            <GhostButton type="button" onClick={onGoLogin}>← Back to sign in</GhostButton>
          </p>
        </>
      )}
    </form>
  );
}

function VerifyOTPScreen({ supabase, email, onAuthenticated, onGoLogin }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  function handleDigit(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  // Handle paste of full 6-digit code
  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      e.preventDefault();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) { setError("Enter the full 6-digit code."); return; }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    setLoading(false);
    if (authError) { setError("Invalid or expired code. Try again."); return; }
    onAuthenticated(data.session);
  }

  async function handleResend() {
    setResent(false);
    await supabase.auth.resend({ type: "signup", email });
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <BrandMark />
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[rgb(40,20,9)]">Check your email</h1>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to <span className="font-medium text-[rgb(40,20,9)]">{email}</span>
        </p>
      </div>

      <Alert type="error" message={error} />
      {resent && <Alert type="success" message="A new code was sent." />}

      {/* OTP digit inputs */}
      <div className="flex justify-center gap-2.5 my-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg
                       focus:outline-none focus:border-yellow-700 focus:ring-1 focus:ring-yellow-700
                       text-[rgb(40,20,9)]"
          />
        ))}
      </div>

      <PrimaryButton loading={loading}>Verify email</PrimaryButton>

      <p className="text-center text-sm text-gray-500">
        Didn't get it?{" "}
        <GhostButton type="button" onClick={handleResend}>Resend code</GhostButton>
      </p>
      <p className="text-center">
        <GhostButton type="button" onClick={onGoLogin}>← Back to sign in</GhostButton>
      </p>
    </form>
  );
}

// ─── root Auth component ──────────────────────────────────────────────────────

/**
 * Screens: "login" | "signup" | "forgot" | "verify"
 */
export default function Auth({ supabase, onAuthenticated }) {
  const [screen, setScreen] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");

  const shell = (
    <div className="min-h-screen bg-[rgb(253,246,237)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-yellow-200 shadow-sm p-6 sm:p-8">
        {screen === "login" && (
          <LoginScreen
            supabase={supabase}
            onAuthenticated={onAuthenticated}
            onGoSignUp={() => setScreen("signup")}
            onGoForgot={() => setScreen("forgot")}
          />
        )}
        {screen === "signup" && (
          <SignUpScreen
            supabase={supabase}
            onGoLogin={() => setScreen("login")}
            onGoVerify={(email) => { setPendingEmail(email); setScreen("verify"); }}
          />
        )}
        {screen === "forgot" && (
          <ForgotPasswordScreen
            supabase={supabase}
            onGoLogin={() => setScreen("login")}
          />
        )}
        {screen === "verify" && (
          <VerifyOTPScreen
            supabase={supabase}
            email={pendingEmail}
            onAuthenticated={onAuthenticated}
            onGoLogin={() => setScreen("login")}
          />
        )}
      </div>
    </div>
  );

  return shell;
}
