import React from 'react';
import type { PricingPlan } from '../types';
import { CheckIcon } from './icons/Icons';

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
  return (
    <div className={`relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col ${plan.isPopular ? 'border-4 border-orange-500' : 'border-4 border-transparent'}`}>
      {plan.isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-center text-gray-800">{plan.name}</h3>
        <p className="mt-2 text-center text-gray-500">{plan.description}</p>
        <div className="mt-6 text-center">
          <span className="text-5xl font-extrabold text-gray-900">
            UGX {plan.price.toLocaleString()}
          </span>
          <span className="text-lg font-medium text-gray-500">/{plan.duration.split(' ')[1]}</span>
        </div>
        <ul className="mt-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <button
          onClick={() => onSelect(plan)}
          className={`w-full text-lg font-bold py-3 px-6 rounded-full transition duration-300 ${plan.isPopular ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
