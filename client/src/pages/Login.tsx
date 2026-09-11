import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { z } from 'zod'
import { authService } from "../api/authService";
import {  useNavigate } from "react-router-dom";


const loginSchema = z.object({
    email: z.email("Enter a valid email address."),

    password: z
        .string(),
})

type FormValues = {
    email: string;
    password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    email: "",
    password: "",
};

// Shared Tailwind classes so we don't repeat the input styling on every field.
const inputBase =
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 " +
    "shadow-sm transition-colors focus:outline-none focus:ring-2";
const inputNormal =
    "border-slate-300 focus:border-slate-500 focus:ring-slate-200";
const inputError = "border-red-400 focus:border-red-500 focus:ring-red-200";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function Login() {
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate()

    // Update a field's value and clear its error as the user types.
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setServerError(null);
        setSuccess(null);

        const result = loginSchema.safeParse(values)
        if (!result.success) {
            const nextErrors: FormErrors = {}

            result.error.issues.forEach(issue=>{
                const field = issue.path[0] as keyof FormValues
                nextErrors[field] = issue.message
            })

            setErrors(nextErrors)
            return
        }
        setErrors({})

        setLoading(true);
        try {
            const res = await authService.login(values.email,values.password)


            const data =  res.data;

            // The backend returns a normal response for failures like a bad
            // password, so check both the body flags and the token presence.
            if (data.success === false || data.status >=400 || !data.token) {
                throw new Error(data.message ?? "Something went wrong.");
            }

            // Store the JWT for authenticated requests later on.
            localStorage.setItem("token", data.token);
            navigate("/")
            setSuccess(data.message ?? "Logged in successfully.");
            setValues(initialValues);
        } catch (err:any) {
            setServerError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md">
                {/* Product name */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                        P
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                        PayWallet
                    </span>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Welcome back
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Log in to access your wallet and manage your money.
                    </p>

                    {success ? (
                        <div
                            role="status"
                            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                        >
                            {success}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                            {serverError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    {serverError}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    aria-invalid={errors.email ? true : undefined}
                                    className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password with show/hide toggle */}
                            <div>
                                <label htmlFor="password" className={labelClass}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="At least 8 characters"
                                        value={values.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        aria-invalid={errors.password ? true : undefined}
                                        className={`${inputBase} pr-16 ${errors.password ? inputError : inputNormal}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-pressed={showPassword}
                                        className="absolute inset-y-0 right-0 mr-2 my-auto h-fit rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {loading ? "Logging in..." : "Log in"}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Your information is encrypted and securely handled.
                </p>
            </div>
        </div>
    );
}

export default Login;
