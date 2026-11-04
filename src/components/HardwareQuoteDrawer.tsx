import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { QuoteItem } from '../types/index.ts';
import { useSite } from '../context/SiteContext.tsx';

interface HardwareQuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToConsultation: () => void;
}

export const HardwareQuoteDrawer: React.FC<HardwareQuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToConsultation
}) => {
  const { formatPrice } = useSite();
  if (!isOpen) return null;

  const totalEstimate = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Equipment Quote Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close quote drawer"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your equipment quote is empty
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Browse our enterprise workstations, industrial scanners, edge gateways, and computer peripherals below to build your quotation.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{items.length} item{items.length > 1 ? 's' : ''} in quote</span>
                  <button
                    onClick={onClearCart}
                    className="hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          SKU: {item.product.sku}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Calculation */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {formatPrice(item.product.price)} ea
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Assurance notes */}
                <div className="pt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Includes enterprise warranty and pre-delivery burn-in testing.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Direct insured logistics and turnkey hardware staging available in Ghana.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Equipment Total:
                </span>
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(totalEstimate)}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToConsultation();
                }}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Submit Procurement RFQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Volume tier discounts automatically applied for orders exceeding 10 units.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
