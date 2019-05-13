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
        Task<NumberModel> GetNumberByRfid(string rfidId);
        IEnumerable<NumberModel> GetAll();
        Task DeleteNumber(string id);
        Task AddOrUpdate(NumberModel number);
    }
    public class NumberService : INumberService
    {
        private readonly DataContext dataContext;

        public NumberService(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddOrUpdate(NumberModel number)
        {
            number.Id = number.Id.Trim();
            Number entity = await dataContext.Numbers.FirstOrDefaultAsync(n => n.Id == number.Id);
            if (entity == null)
                dataContext.Add(entity = new Number());
            number.UpdateEntity(entity);
            // remove rfids from others if found
            string[] rfids = number.Rfids ?? new string[0];
            if (rfids.Length > 0) {
                foreach(string rfid in rfids) 
                {
                    var found = await dataContext.Numbers.Where(n => n.Id != number.Id && n.NumberRfids.Contains(rfid)).ToArrayAsync();
                    foreach(var n in found)
                    {
                        n.NumberRfids = n.NumberRfids.Replace(rfid, "").Replace("  ", " ");
                    }
                }
            }
            await dataContext.SaveChangesAsync();
        }

        public async Task DeleteNumber(string id)
        {
            var number = await dataContext.Numbers.FindAsync(id);
            if (number == null) throw new KeyNotFoundException($"Number {id} not found");

            dataContext.Remove(number);
            await dataContext.SaveChangesAsync();
        }

        public IEnumerable<NumberModel> GetAll()
        {
            return dataContext.Numbers.OrderBy(n => n.Id).Select(n => new NumberModel(n));
        }

        public async Task<NumberModel> GetNumberByRfid(string rfidId)
        {
            var number = await dataContext.Numbers.FirstOrDefaultAsync(n => n.NumberRfids.Contains(rfidId));
            return number == null ? null : new NumberModel(number);
        }
    }

    public class NumberModel
    {
        public NumberModel() { }
        public NumberModel(Number entity)
        {
            Id = entity.Id;
            Rfids = entity.NumberRfids?.Split(' ', StringSplitOptions.RemoveEmptyEntries) ?? new string[0];
        }
        public string Id { get; set; }
        public string[] Rfids { get; set; }

        internal Number UpdateEntity(Number number)
        {
            number.Id = Id;
            number.NumberRfids = string.Join(' ', Rfids ?? new string[0]);
            return number;
        }
    }
}