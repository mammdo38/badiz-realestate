'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

interface RentConverterProps {
  baseDeposit: number; // in Toman
  baseRent: number;    // in Toman
}

export const RentConverter: React.FC<RentConverterProps> = ({ baseDeposit, baseRent }) => {
  // Conversion factor: 3,000,000 rent per 100,000,000 deposit (0.03)
  const CONVERSION_RATE = 3000000 / 100000000;

  // Max deposit possible (Full mortgage)
  const maxDeposit = Math.round(baseDeposit + (baseRent / CONVERSION_RATE));
  const STEP = 50000000; // 50 Million Toman steps

  const [currentDeposit, setCurrentDeposit] = useState<number>(baseDeposit);

  useEffect(() => {
    setCurrentDeposit(baseDeposit);
  }, [baseDeposit, baseRent]);

  const deltaDeposit = currentDeposit - baseDeposit;
  const currentRent = Math.max(0, Math.round(baseRent - (deltaDeposit * CONVERSION_RATE)));
  const isFullMortgage = currentRent === 0;

  const handleReset = () => {
    setCurrentDeposit(baseDeposit);
  };

  const formatShort = (num: number) => {
    if (num >= 1000000000) {
      const b = num / 1000000000;
      return `${b % 1 === 0 ? b : b.toFixed(1)} میلیارد`;
    }
    return `${(num / 1000000).toLocaleString('fa-IR')} میلیون`;
  };

  // Calculate percentage for background gradient fill of the slider track (Left to Right)
  const percent = maxDeposit > 0 ? Math.min(100, Math.max(0, (currentDeposit / maxDeposit) * 100)) : 0;

  return (
    <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 my-4 space-y-3.5 select-none">
      {/* Custom Styles for Left-to-Right Slider Thumb & Track */}
      <style jsx>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          outline: none;
          direction: ltr !important;
          background: linear-gradient(to right, #ea580c 0%, #ea580c ${percent}%, #cbd5e1 ${percent}%, #cbd5e1 100%);
        }

        /* WebKit (Chrome, Safari, Edge, Opera) Thumb */
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #ea580c;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: grab;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.45);
        }

        .custom-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.25);
          border-color: #c2410c;
        }

        /* Firefox Thumb */
        .custom-slider::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #ea580c;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: grab;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.45);
        }

        .custom-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.25);
        }
      `}</style>

      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs shadow-orange-500/20">
            <Calculator size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-900 block truncate">
              محاسبه‌گر تبدیل رهن و اجاره
            </span>
            <span className="text-[10px] text-slate-500 font-medium block truncate">
              ۱۰۰ میلیون پیش ⇄ ۳ میلیون اجاره
            </span>
          </div>
        </div>

        {currentDeposit !== baseDeposit ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-black text-orange-600 hover:text-white bg-orange-100/80 hover:bg-[var(--color-orange)] px-3 py-1.5 rounded-xl border border-orange-300/80 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <RotateCcw size={13} className="transition-transform duration-300 hover:rotate-180" />
            <span>بازنشانی</span>
          </button>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 whitespace-nowrap">
            قیمت اصلی آگهی
          </span>
        )}
      </div>

      {/* Live Compact Values Grid */}
      <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        {/* Deposit Box */}
        <div className="flex flex-col justify-between min-h-[46px] overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold block whitespace-nowrap">مبلغ ودیعه (پیش)</span>
          <div className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden tabular-nums">
            <span className="text-sm font-black text-slate-900 leading-none">
              {formatShort(currentDeposit)}
            </span>
            <span className="text-[10px] font-normal text-slate-500 leading-none shrink-0">تومان</span>
          </div>
        </div>

        {/* Monthly Rent Box */}
        <div className="flex flex-col justify-between min-h-[46px] border-r border-slate-100 pr-2.5 overflow-hidden">
          <div className="flex items-center justify-between whitespace-nowrap gap-1">
            <span className="text-[10px] text-slate-400 font-bold">اجاره ماهانه</span>
            {isFullMortgage && (
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-200 shrink-0">
                رهن کامل ✨
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden tabular-nums">
            {currentRent > 0 ? (
              <>
                <span className="text-sm font-black text-[var(--color-orange)] leading-none">
                  {formatShort(currentRent)}
                </span>
                <span className="text-[10px] font-normal text-slate-500 leading-none shrink-0">تومان</span>
              </>
            ) : (
              <span className="text-xs font-black text-emerald-600 leading-none">بدون اجاره</span>
            )}
          </div>
        </div>
      </div>

      {/* Strict Left-to-Right Range Slider */}
      <div className="space-y-1.5 pt-1 touch-pan-x" dir="ltr">
        <input
          type="range"
          dir="ltr"
          min={0}
          max={maxDeposit}
          step={STEP}
          value={currentDeposit}
          onChange={(e) => setCurrentDeposit(Number(e.target.value))}
          className="custom-slider touch-action-pan-x"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5 whitespace-nowrap" dir="rtl">
          <span>۰ پیش (اجاره کامل)</span>
          <span className="text-orange-600 font-bold">اهرم را بکشید ↔</span>
          <span>{formatShort(maxDeposit)} (رهن کامل)</span>
        </div>
      </div>
    </div>
  );
};

export default RentConverter;
