export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ENUMS
type ServiceType = 'Puesta en Marcha' | 'Servicio Técnico' | 'Garantía';
type AssignmentStatus = 'abierto' | 'en_progreso' | 'cancelado' | 'finalizado';
type LibraryType = 'folder' | 'pdf' | 'video' | 'image' | 'link'; // NUEVO

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'coordinador' | 'mecanico'
          avatar_url: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'coordinador' | 'mecanico'
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'coordinador' | 'mecanico'
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      service_reports: {
        Row: {
          id: string
          technician_id: string
          client_name: string
          machine_model: string
          machine_serial: string | null
          type: ServiceType
          status: string
          checklist_data: Json
          photos: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          technician_id: string
          client_name: string
          machine_model: string
          machine_serial?: string | null
          type: ServiceType
          status?: string
          checklist_data: Json
          photos?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          technician_id?: string
          client_name?: string
          machine_model?: string
          machine_serial?: string | null
          type?: ServiceType
          status?: string
          checklist_data?: Json
          photos?: string[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reports_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      service_types: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      },
      assignments: {
        Row: {
          id: string
          technician_id: string
          service_type_id: string
          client_name: string
          client_location: string | null
          origin_location: string | null
          distance_km: number | null
          machine_model: string
          machine_serial: string | null
          notes: string | null
          status: AssignmentStatus
          assigned_at: string
          due_date: string | null
          finished_report_id: string | null
        }
        Insert: {
          id?: string
          technician_id: string
          service_type_id: string
          client_name: string
          client_location?: string | null
          origin_location?: string | null
          distance_km?: number | null
          machine_model: string
          machine_serial?: string | null
          notes?: string | null
          status?: AssignmentStatus
          assigned_at?: string
          due_date?: string | null
          finished_report_id?: string | null
        }
        Update: {
          id?: string
          technician_id?: string
          service_type_id?: string
          client_name?: string
          client_location?: string | null
          origin_location?: string | null
          distance_km?: number | null
          machine_model?: string
          machine_serial?: string | null
          notes?: string | null
          status?: AssignmentStatus
          assigned_at?: string
          due_date?: string | null
          finished_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_finished_report_id_fkey"
            columns: ["finished_report_id"]
            isOneToOne: false
            referencedRelation: "service_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      // 5. LIBRARY ITEMS (NUEVA TABLA FASE 8)
      library_items: {
        Row: {
          id: string
          name: string
          type: LibraryType
          url: string | null
          parent_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: LibraryType
          url?: string | null
          parent_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: LibraryType
          url?: string | null
          parent_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_items_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: 'coordinador' | 'mecanico'
      service_type: ServiceType
      assignment_status: AssignmentStatus
      library_type: LibraryType
    }
  }
}