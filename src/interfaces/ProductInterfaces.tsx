export interface Producto {
    _id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen: string;
    disponibilidad: boolean;
    ventasTotales: number;
    ratingPromedio: number;
    numRevisiones: number;
    usuariosQueCalificaron: string[];
}

export interface ProductoResponse {
    ok: boolean;
    productos: Producto[];
}