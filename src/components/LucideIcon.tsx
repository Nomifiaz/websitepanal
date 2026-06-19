import React from 'react';
import * as Lucide from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, className = '', size = 16 }) => {
  // Map string name to Lucide components
  // First clean up names if they are written in lowercase or with dashes
  const getIconComponent = (iconName: string) => {
    // Standardize naming
    const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    switch (normalized) {
      case 'layoutdashboard': return Lucide.LayoutDashboard;
      case 'package': return Lucide.Package;
      case 'packagesearch': return Lucide.PackageSearch;
      case 'shoppingcart': return Lucide.ShoppingCart;
      case 'users': return Lucide.Users;
      case 'usersearch': return Lucide.UserSearch;
      case 'piechart': return Lucide.PieChart;
      case 'settings': return Lucide.Settings;
      case 'chevrondown': return Lucide.ChevronDown;
      case 'menu': return Lucide.Menu;
      case 'plus': return Lucide.Plus;
      case 'search': return Lucide.Search;
      case 'arrowupright': return Lucide.ArrowUpRight;
      case 'pencil': return Lucide.Pencil;
      case 'trash':
      case 'trash2': return Lucide.Trash2;
      case 'x': return Lucide.X;
      case 'alerttriangle': return Lucide.AlertTriangle;
      case 'checkcircle2':
      case 'checkcircle': return Lucide.CheckCircle2;
      case 'alertcircle': return Lucide.AlertCircle;
      case 'info': return Lucide.Info;
      case 'arrowright': return Lucide.ArrowRight;
      case 'receipt': return Lucide.Receipt;
      case 'dollarsign': return Lucide.DollarSign;
      case 'ticket': return Lucide.Ticket;
      case 'tag': return Lucide.Tag;
      case 'percent': return Lucide.Percent;
      case 'upload': return Lucide.Upload;
      case 'calendar': return Lucide.Calendar;
      case 'lock': return Lucide.Lock;
      case 'mail': return Lucide.Mail;
      case 'user': return Lucide.User;
      case 'eye': return Lucide.Eye;
      case 'eyeoff': return Lucide.EyeOff;
      case 'logout': return Lucide.LogOut;
      
      // Category Specific icons
      case 'lamp': return Lucide.Lamp;
      case 'armchair': return Lucide.Armchair;
      case 'bookmark': return Lucide.Bookmark;
      case 'watch': return Lucide.Watch;
      case 'headphones': return Lucide.Headphones;
      case 'radio': return Lucide.Radio;
      case 'speaker': return Lucide.Speaker;
      case 'wind': return Lucide.Wind;
      case 'camera': return Lucide.Camera;
      case 'footprints': return Lucide.Footprints;
      case 'flower2':
      case 'flower': return Lucide.Flower2;
      case 'shirt': return Lucide.Shirt;
      case 'dumbbell': return Lucide.Dumbbell;
      case 'circledot': return Lucide.CircleDot;
      case 'coffee': return Lucide.Coffee;
      case 'shoppingbasket': return Lucide.ShoppingBasket;
      case 'gem': return Lucide.Gem;
      case 'bookopen': return Lucide.BookOpen;
      
      default:
        return Lucide.Package; // fallback
    }
  };

  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} size={size} />;
};
