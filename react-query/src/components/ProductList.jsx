import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function ProductList({ onSelect, selectedId }) {
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const fetchProducts = async (object) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products?_page=${object.queryKey[1]}&_per_page=12`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: fetchProducts,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (id) =>
      await axios.delete(`http://localhost:3000/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  function handleDelete(event, id) {
    event.stopPropagation();
    mutation.mutate(id);
  }

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm tracking-widest uppercase">
            Loading products
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm">
          {error.message}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col flex-wrap px-6 w-4/6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-widest text-indigo-500 uppercase font-semibold mb-1">
          Catalogue
        </p>
        <h1
          className="text-4xl font-black text-slate-900"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-1px" }}
        >
          All Products
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {products?.data.length} items available in this page
        </p>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.data &&
          products?.data.map((product) => {
            const isSelected = selectedId === product.id;
            return (
              <li
                key={product.id}
                onClick={() => onSelect(product.id)}
                className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02]"
                      : "border-transparent hover:border-slate-200 hover:shadow-md"
                  }
                `}
              >
                {/* Image */}
                <div className="relative bg-slate-100 overflow-hidden h-44">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.thumbnail}
                    alt={product.title}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-500/10" />
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 rounded-full font-semibold">
                      Selected
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {product.title}
                    </p>
                    <p className="text-indigo-600 font-bold text-sm mt-0.5">
                      ${product.price}
                    </p>
                  </div>
                  <button
                    className="text-white bg-indigo-500 px-3 py-1.5 rounded hover:bg-indigo-600 duration-300"
                    onClick={(event) => handleDelete(event, product.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
      </ul>

      {/* Pagination */}
      <div className="flex flex-col flex-1 mx-auto">
        <div className="flex-1"></div>
        <div className="flex justify-center h-4">
          <button
            className="px-4  text-sm font-semibold text-indigo-500 bg-indigo-50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <button
            className="px-4 text-sm font-semibold text-indigo-500 bg-indigo-50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!products?.next}
            onClick={() => setPage(products.next)}
          >
            <span className="px-4 mr-8 text-sm font-semibold text-indigo-500 bg-indigo-50 ">
              {page}
            </span>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
