export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          id: string
          user_id: string
          account_number: string
          bsb: string
          account_name: string
          bank_name: string
          account_type: 'savings' | 'checking' | 'credit' | 'investment'
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_number: string
          bsb: string
          account_name: string
          bank_name: string
          account_type: 'savings' | 'checking' | 'credit' | 'investment'
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_number?: string
          bsb?: string
          account_name?: string
          bank_name?: string
          account_type?: 'savings' | 'checking' | 'credit' | 'investment'
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}