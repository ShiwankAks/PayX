import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { z } from 'zod'
import { authService } from "../api/authService";


// const API_URL = import.meta.env.VITE_API_URL ?? "";


const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters."),

    email: z.email("Enter a valid email address."),

    phone: z
        .string()
        .trim()
        .regex(/^[+]?[0-9\s-]{7,15}$/, "Enter a valid phone number."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
})

type FormValues = {
    username: string;
    email: string;
    phone: string;
    password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    username: "",
    email: "",
    phone: "",
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

function Signup() {
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>();

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

        const result = signupSchema.safeParse(values)
        if (!result.success) {
            const nextErrors: FormErrors = {}

            result.error.issues.forEach(issue => {
                const field = issue.path[0] as keyof FormValues
                nextErrors[field] = issue.message
            })

            setErrors(nextErrors)
            return
        }
        setErrors({})

        setLoading(true);
        try {
            const res = await authService.signup(values.email, values.password, values.username, values.phone)

            const data = res.data;

            // The backend returns a normal response for the "already exists" case,
            // so check both the HTTP status and the body.
            if (data.success === false || data.status >= 400) {
                throw new Error(data.message ?? "Something went wrong.");
            }

            setSuccess(data.message ?? "Account created successfully.");
            setValues(initialValues);
            // console.log(res.data)
        } catch (err: any) {
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
                        Create your account
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Start managing your money securely and effortlessly.
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

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className={labelClass}>
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="jane_doe"
                                    value={values.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                    aria-invalid={errors.username ? true : undefined}
                                    className={`${inputBase} ${errors.username ? inputError : inputNormal}`}
                                />
                                {errors.username && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

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

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className={labelClass}>
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    placeholder="+1 555 000 1234"
                                    value={values.phone}
                                    onChange={handleChange}
                                    disabled={loading}
                                    aria-invalid={errors.phone ? true : undefined}
                                    className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
                                />
                                {errors.phone && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
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
                                        autoComplete="new-password"
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
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </form>
                    )}

                    {
                        success ?
                            <p className="mt-6 text-center text-sm text-slate-600">You're all set!
                                <a href="/login"
                                    className="font-medium text-slate-900 hover:underline"
                                >Log in to your account
                                </a>
                            </p>
                            :
                            <p className="mt-6 text-center text-sm text-slate-600">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-medium text-slate-900 hover:underline"
                                >
                                    Log in
                                </a>
                            </p>
                    }

                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Your information is encrypted and securely handled.
                </p>
            </div>
        </div>
    );
}

export default Signup;
