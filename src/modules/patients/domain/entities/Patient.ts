export interface Patient {
  PacienteID?: string;
  UsuarioID?: string;
  DNI: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  email: string;
  Estado?: string;
  password?: string;
  entidad_id?: number;
}
