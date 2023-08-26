import { Types } from 'mongoose';

abstract class CrudRepository<T> {
  public abstract findAll(): Promise<T[]>;
  public abstract findById(id: string | Types.ObjectId): Promise<T>;
  public abstract save(data: T): Promise<T>;
  public abstract update(data: T): Promise<T>;
  public abstract delete(id: string | Types.ObjectId): Promise<void>;
}

export default CrudRepository;
