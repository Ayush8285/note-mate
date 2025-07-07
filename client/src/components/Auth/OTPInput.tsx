import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const OTPInput: React.FC<Props> = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const showLabel = isFocused || value;

  return (
    <div className="relative w-full mb-6">
      <AnimatePresence>
        {showLabel && (
          <motion.label
            htmlFor="otp"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -4 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-3 px-1 text-xs ${
              isFocused ? "text-blue-600" : "text-gray-500"
            } bg-white z-10`}
          >
            OTP
          </motion.label>
        )}
      </AnimatePresence>

      <input
        id="otp"
        type={visible ? "text" : "password"}
        name="otp"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={showLabel ? "" : "OTP"}
        className="w-full bg-white border border-gray-300 rounded px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
      />

      <span
        className="absolute right-3 top-3 cursor-pointer text-gray-500"
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    </div>
  );
};

export default OTPInput;
