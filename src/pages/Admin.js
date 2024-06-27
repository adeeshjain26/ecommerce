import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/dialogue/ConfirmationDialog";

const AdminPage = () => {
  const navigate = useNavigate();
  const { addProduct, editProduct, removeProduct, products } =
    useContext(ProductContext);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    price: 0,
    images: [],
    description: "",
    brand: "",
    colors: [],
    sizes: [],
    details: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
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
    setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
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
        return {
          ...prevFormData,
          sizes: prevFormData.sizes.filter((size) => size !== value),
        };
      }
    });
  };

  const handleDetailsChange = (e, index) => {
    const { value } = e.target;
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const handleAddDetail = () => {
    setFormData({ ...formData, details: [...formData.details, ""] });
  };

  const handleRemoveDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        imageFiles.forEach((file, index) => {
          formDataToSend.append("images", file); // Ensure 'images' field is used
        });
      } else {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      }
    });
    setDialog({ isOpen: true, action: "submit", product: formDataToSend });
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
      if (product.get("id")) {
        await editProduct(product.get("id"), product);
      } else {
        await addProduct(product);
      }
      setFormData({
        id: null,
        name: "",
        category: "",
        price: 0,
        images: [],
        description: "",
        brand: "",
        colors: [],
        sizes: [],
        details: [],
      });
      setImageFiles([]);
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
    <div className="flex flex-col items-center justify-center bg-timberwolf p-4">
      <h2 className="text-3xl font-bold mb-6">Product Management</h2>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-1/2 bg-white overflow-y-auto h-screen rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center border-b last:border-b-0 py-2 text-lg"
              >
                <div>
                  <span className="font-semibold">{product.name}</span> -{" "}
                  {product.category} - ₹{product.price}
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-slate-900 hover:text-red-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-900 hover:text-slate-900"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:w-1/2 bg-white overflow-y-auto max-h-screen rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            {formData.id ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Product Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block flex-1 border-0 bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg"
                    placeholder="Enter Product Name"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Brand Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="block flex-1 border-0 bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg"
                    placeholder="Enter Brand Name"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Categories
              </label>
              <div className="mt-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="block flex-1 border-0 bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg"
                    placeholder="Enter Product Price"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Colors
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="colors"
                  value={formData.colors.join(", ")}
                  onChange={handleColorsChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                  placeholder="Enter colors separated by commas"
                />
              </div>
            </div>

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

            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                  rows={4}
                  placeholder="Enter Product Description"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Details
              </label>
              <div className="mt-2 space-y-2">
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex items-center">
                    <textarea
                      name="details"
                      value={detail}
                      onChange={(e) => handleDetailsChange(e, index)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                      rows={2}
                      placeholder="Enter Product Detail"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDetail}
                >
                  <p className="text-xl text-black flex justify-center items-center" >+</p> 

                </button>
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-lg font-medium leading-6 text-gray-900">
                Product Images
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  name="imageFiles"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  multiple
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <div className="mt-2 space-y-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="flex items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Product Image ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {formData.id ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        message={`Are you sure you want to ${
          dialog.action === "submit" ? "add/update" : dialog.action
        } this product?`}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default AdminPage;
