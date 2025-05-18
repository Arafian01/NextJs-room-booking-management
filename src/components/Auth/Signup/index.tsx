"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from "@/components/ui-elements/alert";
import Cookies from "js-cookie";
import api from "@/lib/api";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation)
      errs.password_confirmation = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      Cookies.set("accessToken", res.data.accessToken, {
        secure: true,
        sameSite: "strict",
      });
      router.push("/pages/rooms");
    } catch (e: any) {
      if (e.response?.data?.errors) {
        const apiFieldErrors: Record<string, string> = {};
        for (const key in e.response.data.errors) {
          apiFieldErrors[key] = e.response.data.errors[key][0];
        }
        setFieldErrors(apiFieldErrors);
      } else {
        setError(e.response?.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShowcaseSection title="Sign Up" className="!p-6.5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert
            variant="error"
            title="Registration Error"
            description={error}
          />
        )}

        <div>
          <InputGroup
            label="Name"
            name="name"
            type="text"
            placeholder="Enter full name"
            value={form.name}
            handleChange={handleChange}
            required
            className="mb-4.5"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <InputGroup
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            handleChange={handleChange}
            required
            className="mb-4.5"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <InputGroup
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            handleChange={handleChange}
            required
            className="mb-4.5"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <InputGroup
            label="Re-type Password"
            name="password_confirmation"
            type="password"
            placeholder="Re-type password"
            value={form.password_confirmation}
            handleChange={handleChange}
            required
            className="mb-5.5"
          />
          {fieldErrors.password_confirmation && (
            <p className="mt-1 text-sm text-red-500">
              {fieldErrors.password_confirmation}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="mt-4 text-center text-sm text-dark-4 dark:text-dark-6">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </ShowcaseSection>
  );
}
