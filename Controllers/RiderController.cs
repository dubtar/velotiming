using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloTiming.Data;

namespace VeloTiming.Controllers
{

    [Route("api/races/rider")]
    public class RiderController : Controller
    {
        private readonly DataContext dataContext;

        public RiderController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var categories = await dataContext.Riders.Where(rc => rc.RaceId == id).Include(r => r.Category).ToArrayAsync();
            if (categories == null) return NotFound();
            return Ok(categories.Select(c => new RiderModel(c)));
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Add(int id, [FromBody] RiderModel rider)
        {
            if (rider == null) return BadRequest("Category not posted");
            var race = await dataContext.Races.FindAsync(id);
            if (race == null) return NotFound();
            var entity = rider.UpdateEntity(
                new Rider { Race = race, RaceId = race.Id },
                dataContext
            );
            dataContext.Riders.Add(entity);
            await dataContext.SaveChangesAsync();
            return await Get(id);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] RiderModel category)
        {
            if (category == null) return BadRequest("Category not set");
            var entity = await dataContext.Riders.FindAsync(category.Id);
            if (entity == null) return NotFound();
            var raceId = entity.RaceId;
            category.UpdateEntity(entity, dataContext);
            dataContext.Riders.Update(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await dataContext.Riders.FindAsync(id);
            if (entity == null) return NotFound();
            int raceId = entity.RaceId;
            dataContext.Riders.Remove(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }
    }

    public class RiderModel
    {
        public RiderModel() { }
        public RiderModel(Rider rider)
        {
            this.Id = rider.Id;
            this.FirstName = rider.FirstName;
            this.LastName = rider.LastName;
            this.Sex = rider.Sex;
            this.YearOfBirth = rider.YearOfBirth;
            this.Category = rider.Category?.Code;
            this.CategoryName = rider.Category?.Name;
            this.City = rider.City;
            this.Team = rider.Team;
        }

        internal Rider UpdateEntity(Rider rider, DataContext dataContext)
        {
            rider.FirstName = FirstName;
            rider.LastName = LastName;
            rider.Sex = Sex;
            rider.YearOfBirth = YearOfBirth;
            if (rider.RaceId <= 0) throw new Exception("Rider's race Id is not set");
            rider.Category = string.IsNullOrEmpty(Category) ? null :
                dataContext.RaceCategories.FirstOrDefault(c => c.RaceId == rider.RaceId && c.Code == Category);
            rider.City = City;
            rider.Team = Team;
            return rider;
        }
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Sex Sex { get; set; }
        public int YearOfBirth { get; set; }
        public string Category { get; set; }
        public string CategoryName { get; set; }
        public string City { get; set; }
        public string Team { get; set; }

    }
}