import { useState } from "react";

const PostFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    listingType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      category: "",
      search: "",
      listingType: "",
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md my-4 border-1 border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Books
          </label>

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by book or author"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Condition
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Type
            </label>
            <select
              name="listingType"
              value={filters.listingType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Listings</option>
              <option value="Exchange">Exchange (Credit)</option>
              <option value="Buy">Buy</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFilters;
