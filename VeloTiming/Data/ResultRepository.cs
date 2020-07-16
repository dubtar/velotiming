using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace VeloTiming.Data
{
    public interface IResultRepository
    {
        Task AddOrUpdateResult(Mark result);
    }

    public class ResultRepository : IResultRepository
    {
        private readonly DataContext dataContext;

        public ResultRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddOrUpdateResult(Mark result)
        {
            bool exists = await dataContext.Results.AnyAsync(r => r.Id == result.Id);
            if (exists)
                dataContext.Update(result);
            else
                dataContext.Add(result);
            await dataContext.SaveChangesAsync();
        }
    }
}