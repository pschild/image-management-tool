export interface IDtoFactory<E, D> {
    toDto(entity: E): D | Promise<D>;
    toDtos(entities: E[]): D[] | Promise<D[]>;
}
