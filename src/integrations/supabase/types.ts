export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crowdfunding_investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          investor_id: string
          project_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          investor_id: string
          project_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          investor_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crowdfunding_investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crowdfunding_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crowdfunding_projects: {
        Row: {
          created_at: string
          creator_id: string
          current_amount: number
          description: string
          end_date: string
          goal_amount: number
          id: string
          image_url: string | null
          location: string
          property_type: string
          title: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          current_amount?: number
          description: string
          end_date: string
          goal_amount: number
          id?: string
          image_url?: string | null
          location: string
          property_type: string
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          current_amount?: number
          description?: string
          end_date?: string
          goal_amount?: number
          id?: string
          image_url?: string | null
          location?: string
          property_type?: string
          title?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          investor_id: string
          property_id: string
          tokens: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          investor_id: string
          property_id: string
          tokens: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          investor_id?: string
          property_id?: string
          tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "investments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          blockchain_verified: boolean | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          location: string
          owner_id: string
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          blockchain_verified?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location: string
          owner_id: string
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          blockchain_verified?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string
          owner_id?: string
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
