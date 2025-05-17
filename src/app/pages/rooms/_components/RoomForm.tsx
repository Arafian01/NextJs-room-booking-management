// src/app/rooms/_components/RoomForm.tsx
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import InputGroup from '@/components/FormElements/InputGroup';
import { TextAreaGroup } from '@/components/FormElements/InputGroup/text-area';
import { Select } from '@/components/FormElements/select';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface RoomFormData {
  name: string;
  capacity: number;
  price: number;
  categoryId: number;
  description: string;
}

interface RoomFormProps {
  /** If provided, form will load existing room and perform update */
  editingId?: number;
}

export function RoomForm({ editingId }: RoomFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<RoomFormData>({
    name: '',
    capacity: 0,
    price: 0,
    categoryId: 0,
    description: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load categories once
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('https://simaru.amisbudi.cloud/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, []);

  // If editing, load room data
  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const id= localStorage.getItem('idRoom');
        const name = localStorage.getItem('nameRoom');
        const categoryId = localStorage.getItem('categoryIdRoom');
        const price = localStorage.getItem('priceRoom');
        const capacity = localStorage.getItem('capacityRoom');
        const description = localStorage.getItem('descriptionRoom');
        setForm({
          name: name || '',
          capacity: Number(capacity) || 0,
          price: Number(price) || 0,
          categoryId: Number(categoryId) || 0,
          description: description || ''
        });
        // const res = await fetch(`/api/rooms?id=${editingId}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const json = await res.json();
        // console.log('Room data:', json.id);
        // console.log(editingId);
        //   setForm({
        //     name: json.name,
        //     capacity: json.capacity,
        //     price: json.price,
        //     categoryId: json.categoryId,
        //     description: json.description || ''
        //   });
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, [editingId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: ['capacity', 'price', 'categoryId'].includes(name) ? Number(value) : value
    }));
  };

  function validate() {
    const err: typeof errors = {};
    if (!form.name) err.name = 'Name is required';
    if (form.capacity <= 0) err.capacity = 'Capacity must be > 0';
    if (form.price < 0) err.price = 'Price cannot be negative';
    if (!form.categoryId) err.categoryId = 'Please select a category';
    if (!form.description) err.description = 'Description is required'; // uncomment if you want to make description required
    // description optional
    setErrors(err);
    return Object.keys(err).length === 0;
  } 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingId ? `/api/rooms?id=${editingId}` : '/api/rooms';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {  
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message||'Server error') ;
      sessionStorage.setItem('roomAlert', JSON.stringify({
        variant: 'success',
        title: editingId ? 'Room Updated' : 'Room Added',
        description: json.message || 'Operation successful.'
      }));

      router.push('/pages/rooms');
    } catch (e: any) {
      // setSubmitError(e.message);
      sessionStorage.setItem('roomAlert', JSON.stringify({
        variant: 'error',
        title: 'Error',
        description: e.message
      }));
      router.push('/pages/rooms');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="!p-6.5 rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {submitError  && <p className="text-red-500 mb-4">{submitError }</p>}

      <InputGroup
        label="Name"
        type="text"
        name="name"
        placeholder="Enter Name"
        className="mb-4.5"
        handleChange={handleChange}
        value={form.name}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <InputGroup
        label="Capacity"
        type="number"
        name="capacity"
        placeholder="Enter Capacity"
        className="mb-4.5"
        handleChange={handleChange}
        value={String(form.capacity)}
      />
      {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}

      <InputGroup
        label="Price"
        type="number"
        name="price"
        placeholder="Enter Price"
        className="mb-4.5"
        value={String(form.price)}
        handleChange={handleChange}
      />
      {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}

      <Select
        label="Category"
        name="categoryId"
        className="mb-4.5"
        placeholder="Select category"
        value={String(form.categoryId)}
        onChange={handleChange}
        items={categories.map(c => ({ label: c.name, value: String(c.id) }))}
      />
      {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}

      <TextAreaGroup
         label="Description"
        name="description"
        placeholder="Enter Description"
        className="mb-4.5"
        value={form.description}
        onChange={handleChange}
      />
      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}

      <div className="flex justify-end  space-x-4">
        <Link href="/pages/rooms" className="flex w-20 justify-center rounded-lg bg-red p-[13px] font-medium text-white hover:bg-opacity-90">
          Back
        </Link>
        <button type="submit" className="flex w-20 justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
          {editingId ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}
