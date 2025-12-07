using System.Linq.Expressions;

namespace HPCDSystem.Repository;

internal interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> FetchAllAsync();

    Task<T?> FetchOneAsync(Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    Task AddRangeAsync(IEnumerable<T> entities);

    Task DeleteAsync(T entity);

    Task DeleteRangeAsync(IEnumerable<T> entities);

    Task<List<T>> FetchTopAsync(int count);
    Task SaveChangesAsync();
}