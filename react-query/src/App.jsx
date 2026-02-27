import { useState } from "react";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  return (
    <div className="flex">
      <AddProduct />
      <ProductList onSelect={setSelectedProductId} />
      {selectedProductId && <ProductDetails id={selectedProductId} />}
    </div>
  );
}

export default App;
