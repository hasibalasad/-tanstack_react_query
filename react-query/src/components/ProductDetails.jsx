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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div className="w-1/5">
      <h1 className="text-3xl my-2">Product details</h1>
      <div className="flex flex-col border bg-gray-100 p-1 text-md rounded ">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover h-24 w-24 border mx-auto"
        />
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>USD {product.price}</p>
        <p>{product.rating}/5</p>
      </div>
    </div>
  );
}
