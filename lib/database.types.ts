export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Definición de Tipos para los ENUMS (Coincidentes con SQL)
type ServiceType = 'Puesta en Marcha' | 'Servicio Técnico' | 'Garantía';
type AssignmentStatus = 'abierto' | 'en_progreso' | 'cancelado' | 'finalizado';

export interface Database {
  public: {
    Tables: {
      // 1. PROFILES
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
      // 2. SERVICE_REPORTS
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
      // 3. SERVICE_TYPES
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
      // 4. ASSIGNMENTS (ACTUALIZADA CON MAPAS)
      assignments: {
        Row: {
          id: string
          technician_id: string
          service_type_id: string
          client_name: string
          client_location: string | null
          // NUEVOS CAMPOS FASE 4
          origin_location: string | null
          distance_km: number | null
          // FIN NUEVOS CAMPOS
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
          // NUEVOS CAMPOS FASE 4
          origin_location?: string | null
          distance_km?: number | null
          // FIN NUEVOS CAMPOS
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
          // NUEVOS CAMPOS FASE 4
          origin_location?: string | null
          distance_km?: number | null
          // FIN NUEVOS CAMPOS
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
    }
  }
}