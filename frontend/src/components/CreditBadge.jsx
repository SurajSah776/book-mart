import { FaCoins } from "react-icons/fa";

const CreditBadge = ({ credits }) => {
  return (
    <div className="flex items-center bg-[#e9ecef] text-[#3e78ed] px-3 py-1 rounded-full text-sm">
      <FaCoins className="mr-1 text-[#3e78ed]" />
      <span>{credits} Credits</span>
    </div>
  );
};

export default CreditBadge;
