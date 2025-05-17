'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from '@/components/ui-elements/alert'

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' })); // Clear error for the field being edited
    setError(null); // Clear general error
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('https://simaru.amisbudi.cloud/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      
      if (!res.ok) {
        if (json.errors) {
          const apiFieldErrors: Record<string, string> = {};
          for (const key in json.errors) {
            apiFieldErrors[key] = Array.isArray(json.errors[key]) ? json.errors[key][0] : json.errors[key];
          }
          setFieldErrors(apiFieldErrors);
          throw new Error('Validation failed');
        }
        throw new Error(json.message || 'Registration failed');
      }
      localStorage.setItem('accessToken', json.accessToken);
      console.log(json.accessToken);
      console.log("user", json.user);
      router.push('/');
    } catch (e: any) {
      if (e.message !== 'Validation failed') setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShowcaseSection title="Sign Up Form" className="!p-6.5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error" title="Registration Error" description={error} />}

        <InputGroup
          label="Name"
          name="name"
          className="mb-4.5"
          type="text"
          placeholder="Enter full name"
          value={form.name}
          handleChange={handleChange}
          required
        />
        {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}

        <InputGroup
          label="Email"
          name="email"
          className="mb-4.5"
          type="email"
          placeholder="Enter email address"
          value={form.email}
          handleChange={handleChange}
          required
        />
        {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}

        <InputGroup
          label="Password"
          name="password"
          className="mb-4.5"
          type="password"
          placeholder="Enter password"
          value={form.password}
          handleChange={handleChange}
          required
        />
        {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}

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
        {fieldErrors.password_confirmation && <p className="text-sm text-red-500">{fieldErrors.password_confirmation}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </ShowcaseSection>
  );
}