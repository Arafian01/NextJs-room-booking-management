"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import Link from "next/link";
import api from "@/lib/api";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

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
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    capacity: 0,
    price: 0,
    categoryId: 0,
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RoomFormData, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        if (editingId) {
          // const res = await api.get(`/rooms/${editingId}`);
          // const room = res.data;
          //get cookies
          const name = Cookies.get("nameRoom");
          const categoryId = Cookies.get("categoryIdRoom");
          const price = Cookies.get("priceRoom");
          const capacity = Cookies.get("capacityRoom");
          const description = Cookies.get("descriptionRoom");
          setFormData({
            name: name || "",
            capacity: Number(capacity) || 0,
            price: Number(price) || 0,
            categoryId: Number(categoryId) || 0,
            description: description || "",
          });
        } else {
          setFormData({
            name: searchParams.get("name") || "",
            capacity: Number(searchParams.get("capacity")) || 0,
            price: Number(searchParams.get("price")) || 0,
            categoryId: Number(searchParams.get("categoryId")) || 0,
            description: searchParams.get("description") || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [editingId, searchParams]);

  function validate(formData: FormData): boolean {
    const err: typeof errors = {};
    const name = formData.get("name") as string;
    const capacity = Number(formData.get("capacity"));
    const price = Number(formData.get("price"));
    const categoryId = Number(formData.get("categoryId"));

    if (!name.trim()) err.name = "Name is required";
    if (capacity <= 0) err.capacity = "Capacity must be greater than 0";
    if (price < 0) err.price = "Price cannot be negative";
    if (!categoryId) err.categoryId = "Please select a category";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "price" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (!validate(formData)) return;

    try {
      const payload = {
        name: formData.get("name") as string,
        capacity: Number(formData.get("capacity")),
        price: Number(formData.get("price")),
        categoryId: Number(formData.get("categoryId")),
        description: formData.get("description") as string,
      };

      const url = editingId ? `/rooms/${editingId}` : "/rooms";
      const method = editingId ? "put" : "post";
      const res = await api[method](url, payload);

      sessionStorage.setItem(
        "roomAlert",
        JSON.stringify({
          variant: "success",
          title: editingId ? "Room Updated" : "Room Added",
          description: res.data.message || "Operation successful.",
        }),
      );
      router.push("/pages/rooms");
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Operation failed.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5"
    >
      {submitError && <p className="mb-4 text-red-500">{submitError}</p>}

      <InputGroup
        label="Name"
        type="text"
        name="name"
        placeholder="Enter Name"
        className="mb-4.5"
        value={formData.name}
        handleChange={handleChange}
      />

      <InputGroup
        label="Capacity"
        type="number"
        name="capacity"
        placeholder="Enter Capacity"
        className="mb-4.5"
        value={String(formData.capacity)}
        handleChange={handleChange}
      />

      <InputGroup
        label="Price"
        type="number"
        name="price"
        placeholder="Enter Price"
        className="mb-4.5"
        value={String(formData.price)}
        handleChange={handleChange}
      />

      <Select
        label="Category"
        className="mb-4.5"
        placeholder="Select category"
        value={String(formData.categoryId)}
        items={categories.map((c) => ({ label: c.name, value: String(c.id) }))}
        name="categoryId"
        onChange={handleChange}
        error={errors.categoryId}
      />

      <TextAreaGroup
        label="Description"
        name="description"
        placeholder="Enter Description"
        className="mb-4.5"
        defaultValue={formData.description}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-4">
        <Link
          href="/pages/rooms"
          className="flex w-20 justify-center rounded-lg bg-red-500 p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Back
        </Link>
        <button
          type="submit"
          className="flex w-20 justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
