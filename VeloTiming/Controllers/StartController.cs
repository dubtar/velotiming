using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloTiming.Data;

namespace VeloTiming.Controllers
{

    [Route("api/races/start")]
    public class StartController : Controller
    {
        private readonly DataContext dataContext;

        public StartController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StartDto[]>> Get(int id)
        {
            var starts = await dataContext.Starts.Where(rc => rc.RaceId == id).Include(r => r.Categories)
                .ThenInclude(rc => rc.Category).ToArrayAsync();
            return Ok(starts.Select(c => new StartDto(c)));
        }

        [HttpPost("{id}")]
        public async Task<ActionResult<StartDto[]>> Add(int id, [FromBody] StartDto start)
        {
            if (start == null) return BadRequest("Start not posted");
            var race = await dataContext.Races.FindAsync(id);
            if (race == null) return NotFound();
            var entity = start.UpdateEntity(
                new Start { Race = race, RaceId = race.Id }, dataContext
            );
            dataContext.Starts.Add(entity);
            await dataContext.SaveChangesAsync();
            return await Get(id);
        }

        [HttpPut]
        public async Task<ActionResult<StartDto[]>> Update([FromBody] StartDto start)
        {
            if (start == null) return BadRequest("Start not set");
            var entity = await dataContext.Starts.FindAsync(start.Id);
            if (entity == null) return NotFound();
            var raceId = entity.RaceId;
            start.UpdateEntity(entity, dataContext);
            dataContext.Starts.Update(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<StartDto[]>> Delete(int id)
        {
            var entity = await dataContext.Starts.FindAsync(id);
            if (entity == null) return NotFound();
            int raceId = entity.RaceId;
            dataContext.RemoveRange(entity.Categories);
            dataContext.Starts.Remove(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }

        [HttpGet("results/{id}")]
        public async Task<ActionResult<StartResultsDto>> GetResults(int id){
            var start = await dataContext.Starts.Include(s => s.Race).FirstOrDefaultAsync(s => s.Id == id);
            if (start == null) return NotFound();

            var marks = await dataContext.Results.Where(r => r.StartId == id).ToListAsync();
            var result = new StartResultsDto {
                Race = new RaceDto(start.Race),
                Start = new StartDto(start),
                Results = marks.Select(m => new MarkDto(m)).ToArray()
            }; 
            return Ok(result);
        }
    }

    public class StartDto
    {
        public StartDto() { }
        public StartDto(Start start)
        {
            this.Id = start.Id;
            this.Name = start.Name;
            this.PlannedStart = start.PlannedStart;
            this.RealStart = start.RealStart;
            this.End = start.End;
            this.Categories = start.Categories?.Select(c => new RaceCategoryDto(c.Category)).ToArray() ?? new RaceCategoryDto[0];
            this.DelayMarksAfterStartMinutes = start.DelayMarksAfterStartMinutes; 
        }

        internal Start UpdateEntity(Start start, DataContext dataContext)
        {
            start.Id = Id;
            start.Name = Name;
            start.PlannedStart = PlannedStart;
            start.RealStart = RealStart;
            start.End = End;
            start.DelayMarksAfterStartMinutes = DelayMarksAfterStartMinutes;
            #region update Categories list
            if (start.Categories == null)
                start.Categories = new List<StartCategory>();
            var toAdd = Categories.Where(c => !start.Categories.Any(sc => sc.Category.Id == c.Id)).ToArray();
            var toRemove = start.Categories.Where(sc => !Categories.Any(c => c.Id == sc.Category.Id)).ToArray();
            foreach (var cat in toRemove)
                start.Categories.Remove(cat);
            foreach (var cat in toAdd)
                start.Categories.Add(new StartCategory
                {
                    Start = start,
                    Category = dataContext.RaceCategories.First(rc => rc.Id == cat.Id)
                });
            #endregion
            return start;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? PlannedStart { get; set; }
        public DateTime? RealStart { get; set; }
        public DateTime? End { get; set; }
        public RaceCategoryDto[] Categories { get; set; } = new RaceCategoryDto[0];
        public int DelayMarksAfterStartMinutes { get; set; }
    }

    public class StartResultsDto
    {
        public RaceDto Race {get; set;}
        public StartDto Start {get; set;}
        public MarkDto[] Results {get; set;}
    }
}