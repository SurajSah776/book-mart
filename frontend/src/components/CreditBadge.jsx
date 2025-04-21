import { FaCoins } from "react-icons/fa";

const CreditBadge = ({ credits }) => {
  return (
    <div className="flex items-center background bg-gray-200 accent px-3 py-1 rounded-full text-sm">
      <FaCoins className="mr-1 accent" />
      <span>{credits} Credits</span>
    </div>
  );
};

export default CreditBadge;
