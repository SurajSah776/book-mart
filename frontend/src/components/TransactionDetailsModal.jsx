import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const TransactionDetailsModal = ({
  transaction,
  onClose,
  onComplete,
  onReject,
  showStatus = false, // Add showStatus prop to control status display
}) => {
  if (!transaction) return null;
  // Logging details
  console.log(transaction);

  const { fromUser, toUser, book, transactionType, createdAt, amount, status } =
    transaction;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {transactionType === "credit"
              ? "Book Exchange Request"
              : "Book Purchase Request"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Book Image */}
            <div className="md:w-1/4">
              {book.image ? (
                <img
                  src={`http://localhost:5000${book.image}`}
                  alt={book.bookName}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="md:w-2/3 space-y-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {book.bookName}
                </h3>
                <p className="text-gray-600">by {book.authorName}</p>
              </div>

              {/* Request Details */}
              <div className="bg-gray-50 p-2 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Request Details
                </h4>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="text-gray-600 mr-2">Requested by:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {fromUser.username}
                    </span>
                  </li>

                  <li className="flex items-center">
                    <span className="text-gray-600 mr-2">Request Type:</span>
                    <span
                      className={`font-medium text-sm ${
                        transactionType === "credit"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {transactionType === "credit"
                        ? "Exchange (1 Credit)"
                        : `Purchase (₹${amount})`}
                    </span>
                  </li>

                  <li className="flex items-center">
                    <span className="text-gray-600 mr-2">Requested on:</span>
                    <span className="text-blue-600 text-sm">
                      {formatDate(createdAt)}
                    </span>
                  </li>
                </ul>
              </div>

              <h4 className="font-medium text-gray-700 mb-1">
                Contact Information
              </h4>

              {/* Contact Information */}
              <div className="flex gap-1 text-sm">
                {/* Requester Contact Information */}
                <div className="border-l-1 border-r-1 border-gray-400 p-2 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Buyer/Requester
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="text-gray-600 mr-2">Email:</span>
                      <a
                        href={`mailto:${fromUser.email}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {fromUser.email}
                      </a>
                    </li>

                    <li className="flex items-center">
                      <span className="text-gray-600 mr-2">Phone:</span>
                      <a
                        href={`tel:${fromUser.phone}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {fromUser.phone}
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Book Owner Contact Information */}
                <div className="border-l-1 border-r-1 border-gray-400 p-2 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Seller/Owner
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-gray-600 mr-2">Email:</span>
                      <a
                        href={`mailto:${toUser.email}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {toUser.email}
                      </a>
                    </li>

                    <li className="flex items-center">
                      <span className="text-gray-600 mr-2">Phone:</span>
                      <a
                        href={`tel:${toUser.phone}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {toUser.phone}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {book.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Pickup Location
                  </h4>
                  <p className="text-gray-700">{book.address}</p>
                </div>
              )}

              {book.paymentMethod && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    Payment Method
                  </h4>
                  <p className="text-gray-700">
                    {book.paymentMethod === "cash_on_delivery"
                      ? "Cash on Delivery"
                      : book.paymentMethod}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status */}
          {showStatus && status && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                status === "completed" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <h4 className="font-medium flex items-center">
                {status === "completed" ? (
                  <>
                    <FaCheckCircle className="mr-2 text-green-500" />
                    <span className="text-green-700">
                      Transaction Completed
                    </span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-2 text-red-500" />
                    <span className="text-red-700">Transaction Rejected</span>
                  </>
                )}
              </h4>
            </div>
          )}

          {/* Action Buttons - Only show if not viewing status */}
          {!showStatus && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => onReject(transaction._id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center"
              >
                <FaTimesCircle className="mr-2" />
                Reject Request
              </button>
              <button
                onClick={() => onComplete(transaction._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <FaCheckCircle className="mr-2" />
                Confirm Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
