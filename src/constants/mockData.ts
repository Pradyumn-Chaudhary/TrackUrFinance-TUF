export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  note?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  // April 2026
  {
    id: "1",
    title: "Salary Monthly",
    amount: 5000,
    type: "income",
    category: "Salary",
    date: new Date(2026, 3, 6, 10, 0),
  },
  {
    id: "2",
    title: "Grocery Shopping",
    amount: 85.5,
    type: "expense",
    category: "Food",
    date: new Date(2026, 3, 5, 14, 30),
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: 15.99,
    type: "expense",
    category: "Entertainment",
    date: new Date(2026, 3, 4, 9, 15),
  },
  {
    id: "4",
    title: "Gas Station",
    amount: 45.0,
    type: "expense",
    category: "Transport",
    date: new Date(2026, 3, 3, 18, 45),
  },
  {
    id: "5",
    title: "Freelance Project",
    amount: 1200,
    type: "income",
    category: "Salary",
    date: new Date(2026, 3, 2, 11, 0),
  },
  {
    id: "6",
    title: "Gym Membership",
    amount: 30.0,
    type: "expense",
    category: "Health",
    date: new Date(2026, 3, 1, 8, 0),
  },
  {
    id: "7",
    title: "New Shoes",
    amount: 120.0,
    type: "expense",
    category: "Shopping",
    date: new Date(2026, 3, 10, 15, 0),
  },
  {
    id: "8",
    title: "Internet Bill",
    amount: 60.0,
    type: "expense",
    category: "Bills",
    date: new Date(2026, 3, 12, 10, 0),
  },

  // March 2026
  {
    id: "m1",
    title: "March Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
    date: new Date(2026, 2, 1, 10, 0),
  },
  {
    id: "m2",
    title: "Dinner Out",
    amount: 120.0,
    type: "expense",
    category: "Food",
    date: new Date(2026, 2, 15, 20, 0),
  },
  {
    id: "m3",
    title: "Uber Ride",
    amount: 25.0,
    type: "expense",
    category: "Transport",
    date: new Date(2026, 2, 18, 14, 0),
  },
  {
    id: "m4",
    title: "Phone Bill",
    amount: 45.0,
    type: "expense",
    category: "Bills",
    date: new Date(2026, 2, 5, 9, 0),
  },

  // February 2026
  {
    id: "f1",
    title: "Feb Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
    date: new Date(2026, 1, 1, 10, 0),
  },
  {
    id: "f2",
    title: "Groceries",
    amount: 150.0,
    type: "expense",
    category: "Food",
    date: new Date(2026, 1, 10, 12, 0),
  },
  {
    id: "f3",
    title: "Car Repair",
    amount: 450.0,
    type: "expense",
    category: "Transport",
    date: new Date(2026, 1, 20, 16, 0),
  },
];
