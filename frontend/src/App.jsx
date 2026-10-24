import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

 
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const handleBuy = async (id, name) => {
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/purchase/${id}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Successfully purchased "${name}"!`, type: 'success' });
        fetchProducts();
      } else {
        setMessage({ text: data.message || 'Purchase failed.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Server error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Mini Product Inventory System
      </h2>

      
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md text-sm border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Products</h3>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No products available. You can add some via Postman using your Admin API Key.
        </p>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <strong className="text-gray-800 text-base">{product.name}</strong>
                <div className="text-sm text-gray-600 mt-1">
                  Price: <span className="font-medium text-gray-900">${product.price}</span> | Stock:{' '}
                  <span className="font-medium text-gray-900">{product.stock}</span>
                </div>
              </div>
              <button
                onClick={() => handleBuy(product._id, product.name)}
                disabled={product.stock === 0 || loading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Buy'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;