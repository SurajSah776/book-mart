import { useState } from "react";

function TermsAndConditions() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <div className="">
        {/* Terms and Conditions */}
        <p className="text-sm text-gray-400 mt-4">
          By using our platform, you agree to our
          <button
            onClick={() => setShowTerms(true)}
            className="accent hover:secondary cursor-pointer underline ml-1"
          >
            Terms & Conditions
          </button>
          .
        </p>
      </div>

      {/* Popup for Terms & Conditions */}
      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/95">
          <div className="background p-5 max-w-lg w-full rounded-lg shadow-lg relative opacity-100">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-2 right-3 text-gray-700 hover:text-gray-700 text-3xl hover:scale-110 hover:cursor-pointer"
            >
              &times;
            </button>
           
            {/* Terms and Conditions Text */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-color mb-4">
                Terms & Conditions
              </h2>

              <p className="text-gray-700 text-md">
                Welcome to BookExchange. By using our platform, you agree to the
                following terms:               
              </p>
              <ul className="list-disc text-gray-700 text-sm text-left mt-2 pl-6 flex flex-col gap-1">
                <li>Books exchanged must comply with community guidelines.</li>
                <li>
                  Users are responsible for the condition of books they send and receive.
                </li>
                <li>
                  Credits earned are non-transferable and cannot be exchanged for money.
                </li>
                <li>
                  BookExchange reserves the right to suspend accounts violating our
                  policies.
                </li>
              </ul>

              <p className="text-gray-700 text-md mt-2">
                For more details, contact our support team.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TermsAndConditions;
