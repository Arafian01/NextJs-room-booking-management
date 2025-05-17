'use client';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputGroup from '@/components/FormElements/InputGroup';
import { TextAreaGroup } from '@/components/FormElements/InputGroup/text-area';
import { Select } from '@/components/FormElements/select';
import Link from 'next/link';
import api from '@/lib/api';

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
  editingId?: number;
}

export function RoomForm({ editingId }: RoomFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialForm, setInitialForm] = useState<RoomFormData>({
    name: '',
    capacity: 0,
    price: 0,
    categoryId: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (e: any) {
        console.error('Failed to fetch categories:', e);
      }
    }
    fetchCategories();
  }, []);

  // Load room data for editing
  useEffect(() => {
    const name = searchParams.get('name') || '';
    const capacity = Number(searchParams.get('capacity')) || 0;
    const price = Number(searchParams.get('price')) || 0;
    const categoryId = Number(searchParams.get('categoryId')) || 0;
    const description = searchParams.get('description') || '';

    if (editingId) {
      async function fetchRoom() {
        try {
          const res = await api.get(`/rooms/${editingId}`);
          const room = res.data.data;
          setInitialForm({
            name: room.name,
            capacity: room.capacity,
            price: room.price,
            categoryId: room.categoryId,
            description: room.description || '',
          });
        } catch (e: any) {
          console.error('Failed to fetch room:', e);
        }
      }
      fetchRoom();
    } else {
      setInitialForm({ name, capacity, price, categoryId, description });
    }
  }, [editingId, searchParams]);

  function validate(formData: FormData): boolean {
    const err: typeof errors = {};
    const name = formData.get('name') as string;
    const capacity = Number(formData.get('capacity'));
    const price = Number(formData.get('price'));
    const categoryId = Number(formData.get('categoryId'));
    const description = formData.get('description') as string;

    if (!name) err.name = 'Name is required';
    if (capacity <= 0) err.capacity = 'Capacity must be > 0';
    if (price < 0) err.price = 'Price cannot be negative';
    if (!categoryId) err.categoryId = 'Please select a category';
    // Description optional
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (!validate(formData)) return;

    try {
      const payload = {
        name: formData.get('name') as string,
        capacity: Number(formData.get('capacity')),
        price: Number(formData.get('price')),
        categoryId: Number(formData.get('categoryId')),
        description: formData.get('description') as string,
      };

      const url = editingId ? `/rooms/${editingId}` : '/rooms';
      const method = editingId ? 'put' : 'post';
      const res = await api[method](url, payload);
      sessionStorage.setItem('roomAlert', JSON.stringify({
        variant: 'success',
        title: editingId ? 'Room Updated' : 'Room Added',
        description: res.data.message || 'Operation successful.',
      }));
      router.push('/pages/rooms');
    } catch (e: any) {
      sessionStorage.setItem('roomAlert', JSON.stringify({
        variant: 'error',
        title: 'Error',
        description: e.response?.data?.message || 'Operation failed.',
      }));
      router.push('/pages/rooms');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="!p-6.5 rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {submitError && <p className="text-red-500 mb-4">{submitError}</p>}

      <InputGroup
        label="Name"
        type="text"
        name="name"
        placeholder="Enter Name"
        className="mb-4.5"
        defaultValue={initialForm.name}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <InputGroup
        label="Capacity"
        type="number"
        name="capacity"
        placeholder="Enter Capacity"
        className="mb-4.5"
        defaultValue={String(initialForm.capacity)}
      />
      {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}

      <InputGroup
        label="Price"
        type="number"
        name="price"
        placeholder="Enter Price"
        className="mb-4.5"
        defaultValue={String(initialForm.price)}
      />
      {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}

      <Select
        label="Category"
        className="mb-4.5"
        placeholder="Select category"
        defaultValue={String(initialForm.categoryId)}
        items={categories.map(c => ({ label: c.name, value: String(c.id) }))}
        name="categoryId"
      />
      {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}

      <TextAreaGroup
        label="Description"
        name="description"
        placeholder="Enter Description"
        className="mb-4.5"
        defaultValue={initialForm.description}
      />
      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}

      <div className="flex justify-end space-x-4">
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