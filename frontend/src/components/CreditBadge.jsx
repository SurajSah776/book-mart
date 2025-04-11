import { FaCoins } from "react-icons/fa";

const CreditBadge = ({ credits }) => {
  return (
    <div className="flex items-center bg-gray-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
      <FaCoins className="mr-1" />
      <span>{credits} Credits</span>
    </div>
  );
};

export default CreditBadge;
