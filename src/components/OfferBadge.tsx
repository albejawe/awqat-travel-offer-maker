
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Heart, Zap } from 'lucide-react';

interface OfferBadgeProps {
  type: 'popular' | 'limited' | 'featured' | 'new' | 'discount';
  className?: string;
}

export const OfferBadge: React.FC<OfferBadgeProps> = ({ type, className = '' }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'popular':
        return {
          icon: <Star className="w-3 h-3 ml-1" />,
          text: 'الأكثر طلباً',
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'limited':
        return {
          icon: <Clock className="w-3 h-3 ml-1" />,
          text: 'عرض محدود',
          className: 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
        };
      case 'featured':
        return {
          icon: <Heart className="w-3 h-3 ml-1" />,
          text: 'مميز',
          className: 'bg-pink-500 hover:bg-pink-600 text-white'
        };
      case 'new':
        return {
          icon: <Zap className="w-3 h-3 ml-1" />,
          text: 'جديد',
          className: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'discount':
        return {
          icon: null,
          text: 'خصم خاص',
          className: 'bg-orange-500 hover:bg-orange-600 text-white'
        };
      default:
        return {
          icon: null,
          text: '',
          className: ''
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Badge className={`${config.className} ${className} flex items-center shadow-lg`}>
      {config.icon}
      {config.text}
    </Badge>
  );
};
