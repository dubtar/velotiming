using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public async Task<IActionResult> Add(int id, RaceCategoryModel category)
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RaceCategoryModel category)
        {
            var entity = await dataContext.RaceCategories.FindAsync(id);
            if (entity == null) return NotFound();
            if (category == null) return BadRequest("Category not set");
            category.UpdateEntity(entity);
            dataContext.RaceCategories.Update(entity);
            await dataContext.SaveChangesAsync();
            return Ok(new RaceCategoryModel(entity));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await dataContext.RaceCategories.FindAsync(id);
            if (entity == null) return NotFound();
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
        [Required]
        public string Name { get;  set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public Sex Sex { get; set; }
        public int? MinYearOfBirth { get; set; }
        public int? MaxYearOfBirth { get; set; }
    }
}