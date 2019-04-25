using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VeloTiming.Data;

namespace VeloTiming.Services 
{
    public interface INumberService
    {
        Task<Number> GetNumberByRfid(string rfidId);
        Task<IEnumerable<Number>> GetAll();
        Task DeleteNumber(string id);
    }
    public class NumberService: INumberService
    {
        private readonly DataContext dataContext;

        public NumberService(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task DeleteNumber(string id)
        {
            var number = await dataContext.Numbers.FindAsync(id);
            if (number == null) throw new KeyNotFoundException($"Number {id} not found");

            dataContext.Remove(number);
            await dataContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Number>> GetAll()
        {
            return await dataContext.Numbers.ToArrayAsync();
        }

        public async Task<Number> GetNumberByRfid(string rfidId)
        {
            return await dataContext.Numbers.FirstOrDefaultAsync(n => n.NumberRfids.Contains(rfidId) );
        }
    }
}