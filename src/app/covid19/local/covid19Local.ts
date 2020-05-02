export class Region {
  name?: string;
  totalConfirmados?: number;
  nuevosConfirmados?: number;
  totalMuertos: number;
  nuevosMuertos?: number;
  totalRecuperados: number;
  nuevosRecuperados?: number;
}

export class NombrePaises {
  name?: string;
}

export class Recuperados {
  fechaRecuperados?: Date;
  totalRecuperados: number;
}

export class Pais {
  name?: string;
  totalConfirmados?: number;
  nuevosConfirmados?: number;
  totalMuertos: number;
  nuevosMuertos?: number;
  totalRecuperados: number;
}
