
using System.Linq.Expressions;
using HPCDSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Repository;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly ApplicationDbContext dbContext;

    internal DbSet<T> dbSet;

    public Repository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
        this.dbSet = dbContext.Set<T>();
    }


    public async Task AddAsync(T entity)
    {
        await dbSet.AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await dbSet.AddRangeAsync(entities);
    }

    public async Task DeleteAsync(T entity)
    {
        dbSet.Remove(entity);
        await SaveChangesAsync();
    }

    public async Task DeleteRangeAsync(IEnumerable<T> entities)
    {
        dbSet.RemoveRange(entities);
        await SaveChangesAsync();
    }

    public async Task<IEnumerable<T>> FetchAllAsync()
    {
        return await dbSet.ToListAsync();
    }

    public async Task<T?> FetchOneAsync(Expression<Func<T, bool>> predicate)
    {
        return await dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task<List<T>> FetchTopAsync(int count)
    {
        return await dbSet.Take(count).ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }
}