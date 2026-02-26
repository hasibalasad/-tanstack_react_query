import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProductList({ onSelect, selectedId }) {
  const fetchProducts = async (object) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/${object.queryKey[0]}`,
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
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: false,
  });

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
    <div className="flex flex-col flex-wrap px-6 py-8 overflow-y-auto w-4/6">
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
          {products?.length} items available
        </p>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products &&
          products.map((product) => {
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
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Selected
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-white">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-indigo-600 font-bold text-sm mt-0.5">
                    ${product.price}
                  </p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
