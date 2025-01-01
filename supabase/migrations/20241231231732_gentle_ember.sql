/*
  # Initial Schema for Personal Finance Tracker

  1. New Tables
    - `profiles`: User profiles linked to auth.users
    - `bank_accounts`: Bank account information
    - `categories`: Transaction categories
    - `subcategories`: Transaction subcategories
    - `transactions`: Financial transactions
    - `budgets`: Budget tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Link all tables to user profiles for data isolation

  3. Enums
    - `account_type`: Types of bank accounts
    - `transaction_type`: Types of transactions
*/

-- Create custom types
CREATE TYPE account_type AS ENUM ('savings', 'checking', 'credit', 'investment');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_number text NOT NULL,
  bsb text NOT NULL,
  account_name text NOT NULL,
  bank_name text NOT NULL,
  account_type account_type NOT NULL,
  balance decimal(12,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, account_number, bsb)
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type transaction_type NOT NULL,
  color text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name, type)
);

-- Create subcategories table
CREATE TABLE subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category_id, name)
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES bank_accounts(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  transaction_date date NOT NULL,
  narration text NOT NULL,
  original_description text,
  amount decimal(12,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  balance_after decimal(12,2) NOT NULL,
  tags text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE CASCADE,
  account_id uuid REFERENCES bank_accounts(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (start_date <= end_date),
  CHECK (amount >= 0)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own bank accounts"
  ON bank_accounts FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own categories"
  ON categories FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view subcategories of own categories"
  ON subcategories FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM categories
    WHERE categories.id = subcategories.category_id
    AND categories.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage subcategories of own categories"
  ON subcategories FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM categories
    WHERE categories.id = subcategories.category_id
    AND categories.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own budgets"
  ON budgets FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON subcategories
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();