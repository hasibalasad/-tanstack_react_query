import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProductList() {
  const fetchProducts = async (object) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/${object.queryKey[0]}`, //queryKey[0] = "products"
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
    // staleTime: 2000,
    // refetchInterval: 1000,
  });

  if (isLoading) return <div>Fetching Products...</div>;
  if (error)
    return <div>Error occurred fetching Products... {error.message}</div>;
  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h1 className="text-3xl my-2">Product list</h1>
      <ul className="flex flex-wrap justify-center items-center">
        {products &&
          products.map((product) => (
            <li
              key={product.id}
              className="flex flex-col items-center m-2 border rounded-sm"
            >
              <img
                className="object-cover h-64 w-96 rounded-sm"
                src={product.thumbnail}
                alt={product.title}
              />
              <p className="text-xl my-3">{product.title}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
