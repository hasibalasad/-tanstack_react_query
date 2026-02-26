import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProductDetails({ id }) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: async ({ queryKey }) => {
      const response = await axios.get(
        `http://localhost:3000/${queryKey[0]}/${queryKey[1]}`,
      );
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="w-1/6 flex items-center justify-center border-l border-slate-100 h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="w-72 flex items-center justify-center border-l border-slate-100 p-6">
        <p className="text-red-400 text-sm text-center">{error.message}</p>
      </div>
    );

  const stars = Math.round(product.rating);

  return (
    <aside className="w-2/6 border-l border-slate-100 bg-white flex flex-col h-screen sticky top-0">
      {/* Top label */}
      <div className="px-6 pt-8 pb-4 border-b border-slate-100">
        <p className="text-xs tracking-widest text-indigo-500 uppercase font-semibold">
          Product Details
        </p>
      </div>

      {/* Image */}
      <div className="relative bg-linear-to-br from-slate-50 to-slate-100 mx-6 mt-6 rounded-2xl overflow-hidden h-52 flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 px-6 pt-5 flex-1 overflow-y-auto">
        <div>
          <h2
            className="text-xl font-black text-slate-900 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {product.title}
          </h2>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < stars ? "text-amber-400" : "text-slate-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-400 ml-1">
              {product.rating}/5
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Price badge */}
        <div className="mt-auto pb-6">
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-slate-500 text-sm">Price</span>
            <span className="text-2xl font-black text-indigo-600">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
