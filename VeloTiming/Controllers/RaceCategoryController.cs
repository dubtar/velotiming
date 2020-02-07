using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloTiming.Data;

namespace VeloTiming.Controllers
{
    [Route("api/races/category")]
    public class RaceCategoryController : Controller
    {
        private readonly DataContext dataContext;

        public RaceCategoryController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var categories = await dataContext.RaceCategories.Where(rc => rc.RaceId == id).ToArrayAsync();
            if (categories == null) return NotFound();
            return Ok(categories.Select(c => new RaceCategoryModel(c)));
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Add(int id, [FromBody] RaceCategoryModel category)
        {
            var race = await dataContext.Races.FindAsync(id);
            if (race == null) return NotFound();
            if (category == null) return BadRequest("Category not posted");
            var entity = category.UpdateEntity(new RaceCategory());
            entity.Race = race;
            dataContext.RaceCategories.Add(entity);
            await dataContext.SaveChangesAsync();
            return Ok(entity.Id);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] RaceCategoryModel category)
        {
            if (category == null) return BadRequest("Category not set");
            var entity = await dataContext.RaceCategories.FindAsync(category.Id);
            if (entity == null) return NotFound();
            category.UpdateEntity(entity);
            dataContext.RaceCategories.Update(entity);
            await dataContext.SaveChangesAsync();
            return Ok(new RaceCategoryModel(entity));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await dataContext.RaceCategories.FirstOrDefaultAsync(rc => rc.Id == id);
            if (entity == null) return NotFound();
            // do not allow if any rider has that category
            if (dataContext.Riders.Any(r => r.Category.Id == id))
                return BadRequest("Есть гонщики с данной категорией");
            int raceId = entity.RaceId;
            dataContext.RaceCategories.Remove(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }
    }
    public class RaceCategoryModel
    {
        public RaceCategoryModel() { }
        public RaceCategoryModel(RaceCategory cat)
        {
            this.Id = cat.Id;
            this.Name = cat.Name;
            this.Code = cat.Code;
            this.Sex = cat.Sex;
            this.MinYearOfBirth = cat.MinYearOfBirth;
            this.MaxYearOfBirth = cat.MaxYearOfBirth;
        }

        public RaceCategory UpdateEntity(RaceCategory entity)
        {
            entity.Name = Name;
            entity.Code = Code;
            entity.Sex = Sex;
            entity.MinYearOfBirth = MinYearOfBirth;
            entity.MaxYearOfBirth = MaxYearOfBirth;
            return entity;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public Sex Sex { get; set; }
        public int? MinYearOfBirth { get; set; }
        public int? MaxYearOfBirth { get; set; }
    }
}