import React from 'react';
import { motion } from 'motion/react';
import { ConverterCategory } from '../constants';
import { cn } from '../utils';

import { useLanguage } from '../LanguageContext';

interface CategoryCardProps {
  category: ConverterCategory;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isActive, onClick }) => {
  const { t } = useLanguage();
  const Icon = category.icon;
  const categoryTranslation = (t.categories as any)[category.id] || { name: category.name, desc: category.description };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 border cursor-pointer",
        isActive 
          ? "border-brand-primary bg-brand-primary text-bg-darker shadow-lg shadow-brand-primary/20" 
          : "border-white/5 bg-white/5 hover:border-brand-primary/30 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
          isActive ? "bg-bg-darker/10 text-bg-darker" : "bg-brand-primary/10 text-brand-primary group-hover:scale-110"
        )}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-base font-bold truncate",
            isActive ? "text-bg-darker" : "text-white"
          )}>{categoryTranslation.name}</h3>
          <p className={cn(
            "text-xs font-medium truncate",
            isActive ? "text-bg-darker/60" : "text-slate-400"
          )}>
            {categoryTranslation.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
