import React from "react";
import {
  Banknote,
  Utensils,
  Tv,
  Car,
  Activity,
  ShoppingBag,
  Receipt,
  LucideProps,
} from "lucide-react-native";

export const getCategoryIcon = (category: string, props: LucideProps) => {
  switch (category) {
    case "Salary":
      return <Banknote {...props} />;
    case "Food":
      return <Utensils {...props} />;
    case "Entertainment":
      return <Tv {...props} />;
    case "Transport":
      return <Car {...props} />;
    case "Health":
      return <Activity {...props} />;
    case "Shopping":
      return <ShoppingBag {...props} />;
    case "Bills":
      return <Receipt {...props} />;
    default:
      return <ShoppingBag {...props} />;
  }
};
