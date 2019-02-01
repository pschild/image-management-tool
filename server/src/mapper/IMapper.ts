export interface IMapper<E, D> {
    map(entity: E): D | Promise<D>;
    mapAll(entities: E[]): D[] | Promise<D[]>;
}
