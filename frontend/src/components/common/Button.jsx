import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  fullWidth = false
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all cursor-pointer select-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#1456D9] hover:bg-[#0F45B3] text-white shadow-sm shadow-[#1456D9]/20",
    secondary: "bg-[#0B1B33] hover:bg-[#122849] text-white shadow-sm",
    outline: "bg-white border border-[#E4E7EC] hover:bg-[#F5F7FB] text-[#172033]",
    ghost: "bg-transparent hover:bg-slate-100 text-[#667085] hover:text-[#172033]",
    danger: "bg-[#EF4444] hover:bg-rose-600 text-white shadow-sm shadow-[#EF4444]/20",
    success: "bg-[#12B981] hover:bg-emerald-600 text-white shadow-sm shadow-[#12B981]/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs md:text-sm",
    lg: "px-6 py-3.5 text-sm md:text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
