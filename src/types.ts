/**
 * Definiciones de Tipos TypeScript del Proyecto Escolar
 */

export interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  precio: string;
  descripcion: string;
}

export interface RedesSociales {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface InformacionNegocio {
  nombre: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horario: string;
  redesSociales: RedesSociales;
}
