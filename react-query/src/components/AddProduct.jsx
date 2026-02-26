import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    price: "",
    rating: "",
    thumbnail: "",
  });
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (newProduct) => {
      const response = await axios.post(
        "http://localhost:3000/products",
        newProduct,
      );
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log(context);
    },

    // onMutate: () => {
    //   return "eta onSuccess er context er moddhe pabo";
    // },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const newProduct = {
      ...inputs,
      id: crypto.randomUUID().toString(),
    };
    if (newProduct.title.length < 1) {
      setError("Title is required");
      return;
    }
    if (newProduct.description.length < 1) {
      setError("Description is required");
      return;
    }
    if (newProduct.price.length < 1) {
      setError("Price is required");
      return;
    }
    if (newProduct.rating.length < 1 || Number(newProduct.rating) > 5) {
      setError("Rating is required and should be between 0 to 5");
      return;
    }

    mutate(newProduct);
    setInputs({
      title: "",
      description: "",
      price: "",
      rating: "",
      thumbnail: "",
    });
    setError(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  return (
    <aside className="w-1/6 border-r border-slate-100 bg-white flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b border-slate-100">
        <p className="text-xs tracking-widest text-indigo-500 uppercase font-semibold">
          New Entry
        </p>
        <h1
          className="text-2xl font-black text-slate-900 mt-0.5"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Add Product
        </h1>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4 px-6 pt-6 pb-6 flex-1 overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Wireless Headphones"
            className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            value={inputs.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Description
          </label>
          <textarea
            placeholder="Brief product description..."
            name="description"
            rows={3}
            onChange={handleChange}
            value={inputs.description}
            className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Price & Rating  */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                $
              </span>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                onChange={handleChange}
                value={inputs.price.toString()}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-7 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rating
            </label>
            <div className="relative">
              <input
                type="text"
                name="rating"
                placeholder="Default 0.0"
                min={0}
                max={5}
                step={0.1}
                value={inputs.rating}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs">
                /5
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Thumbnail URL
          </label>
          <input
            type="text"
            name="thumbnail"
            placeholder="https://..."
            onChange={handleChange}
            value={inputs.thumbnail}
            className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3 rounded-xl transition-all duration-150 text-sm tracking-wide shadow-md shadow-indigo-200"
          onClick={handleSubmit}
        >
          + Add Product
        </button>
      </form>
    </aside>
  );
}
