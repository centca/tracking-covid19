export class Pais {
  pais?: string;
  fecha?: string;
  totalConfirmados: number;
  nuevosConfirmados?: number;
  totalMuertos: number;
  nuevosMuertos?: number;
  totalRecuperados: number;
  nuevosRecuperados?: number;
}

export class Confirmados {
  fechaConfirmados?: Date;
  totalConfirmados: number;
}

export class Recuperados {
  fechaRecuperados?: Date;
  totalRecuperados: number;
}
