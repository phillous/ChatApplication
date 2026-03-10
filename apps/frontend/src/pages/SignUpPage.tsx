import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LockIcon, MailIcon, UserIcon, LoaderIcon, EyeIcon, EyeOffIcon, MessagesSquareIcon } from "lucide-react";
import { Link } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  [key: string]: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signup, isSigningUp } = useAuthStore();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center font-sans">
      <div className="relative w-full max-w-6xl md:max-h-screen h-[720px]">
        <div className="w-full flex flex-col-reverse md:flex-row-reverse h-full">

          {/* FORM COLUMN */}
          <div className="md:w-1/2 flex items-center justify-center px-8 pt-2">
            <div className="w-full max-w-md">

              {/* HEADING */}
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/25 shadow-lg shadow-cyan-500/10">
                  <MessagesSquareIcon className="w-7 h-7 text-cyan-400" strokeWidth={1.75} />
                </div>
                <h2 className="text-[1.6rem] font-semibold tracking-tight text-slate-700 mb-1">
                  Create an account
                </h2>
                <p className="text-slate-500 text-sm tracking-wide">
                  Join and start chatting in seconds
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* FULL NAME */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-black placeholder-slate-600 text-sm outline-none transition-all
                        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                        ${errors.fullName ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-800 hover:border-slate-700"}`}
                    />
                  </div>
                  {errors.fullName && (
                    <Alert variant="destructive" className="py-1.5 px-3 bg-red-500/8 border-red-500/25">
                      <AlertDescription className="text-xs text-red-400">{errors.fullName}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Email
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@gmail.com"
                      className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-black placeholder-slate-600 text-sm outline-none transition-all
                        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                        ${errors.email ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-800 hover:border-slate-700"}`}
                    />
                  </div>
                  {errors.email && (
                    <Alert variant="destructive" className="py-1.5 px-3 bg-red-500/8 border-red-500/25">
                      <AlertDescription className="text-xs text-red-400">{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-10 text-black placeholder-slate-600 text-sm outline-none transition-all
                        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                        ${errors.password ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-800 hover:border-slate-700"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <Alert variant="destructive" className="py-1.5 px-3 bg-red-500/8 border-red-500/25">
                      <AlertDescription className="text-xs text-red-400">{errors.password}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-md py-2.5 text-sm tracking-wide transition-colors mt-2 shadow-lg shadow-cyan-500/20 hover:cursor-pointer "
                >
                  {isSigningUp ? (
                    <>
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sign In
                </Link>
              </p>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <p className="text-center text-sm font-medium text-slate-400 mb-3">
                  Chat with friends & family — anytime, anywhere
                </p>
                <div className="flex justify-center gap-2">
                  {["Free", "Easy Setup", "Encrypted"].map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-blue-400/70 border text-white tracking-wide"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ILLUSTRATION - RIGHT SIDE */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center">
            <div className="text-center">
              <img
                src="/login.jpg"
                alt="People using mobile devices"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignUpPage;