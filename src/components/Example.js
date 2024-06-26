import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";

const AdminPage = () => {
  const navigate = useNavigate();
  const { addProduct, editProduct, removeProduct, products } =
    useContext(ProductContext);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    price: 0,
    image: "",
    description: "",
    brand: "",
    colors: [],
    sizes: [],
    details: "",
  });
  const [dialog, setDialog] = useState({
    isOpen: false,
    action: null,
    product: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorsChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      colors: value.split(",").map((color) => color.trim()),
    });
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      if (checked) {
        return { ...prevFormData, sizes: [...prevFormData.sizes, value] };
      } else {
        return { ...prevFormData, sizes: prevFormData.sizes.filter((size) => size !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialog({ isOpen: true, action: "submit", product: formData });
  };

  const handleEdit = (product) => {
    setDialog({ isOpen: true, action: "edit", product });
  };

  const handleDelete = (productId) => {
    setDialog({ isOpen: true, action: "delete", product: { id: productId } });
  };

  const handleDialogConfirm = async () => {
    const { action, product } = dialog;
    setDialog({ isOpen: false, action: null, product: null });

    if (action === "submit") {
      if (product.id) {
        await editProduct(product.id, product);
      } else {
        await addProduct(product);
      }
      setFormData({
        id: null,
        name: "",
        category: "",
        price: 0,
        image: "",
        description: "",
        brand: "",
        colors: [],
        sizes: [],
        details: "",
      });
      navigate("/shop");
    } else if (action === "edit") {
      setFormData(product);
    } else if (action === "delete") {
      await removeProduct(product.id);
      navigate("/shop");
    }
  };

  const handleDialogCancel = () => {
    setDialog({ isOpen: false, action: null, product: null });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields here */}
      <div className="sm:col-span-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Available Sizes
        </label>
        <div className="mt-2">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                checked={formData.sizes.includes(size)}
                onChange={handleSizeChange}
                className="form-checkbox"
              />
              <span className="ml-2">{size}</span>
            </label>
          ))}
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminPage;
