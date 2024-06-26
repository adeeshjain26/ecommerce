import React from "react";

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      onClick={() => onClick(product.id)}
      className="over h-64 group block rounded-lg p-2 shadow-sm bg-white shadow-indigo-100 hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1"
    >
      <div className="w-full h-32 mb-2 overflow-hidden rounded-md">
        <img
          alt={product.name}
          src={product.image}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="mt-1">
        <div>
          <h3 className="font-medium text-xl text-gray-900">{product.name}</h3>
          <div className="grid grid-cols-2">
            {" "}
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            <p className="text-lg font-semibold text-gray-700 right-0">
              ₹{product.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
