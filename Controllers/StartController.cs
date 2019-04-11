using System;
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
        public async Task<IActionResult> Get(int id)
        {
            var starts = await dataContext.Starts.Where(rc => rc.RaceId == id).ToArrayAsync();
            return Ok(starts.Select(c => new StartModel(c)));
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Add(int id, [FromBody] StartModel start)
        {
            if (start == null) return BadRequest("Start not posted");
            var race = await dataContext.Races.FindAsync(id);
            if (race == null) return NotFound();
            var entity = start.UpdateEntity(
                new Start { Race = race, RaceId = race.Id }
            );
            dataContext.Starts.Add(entity);
            await dataContext.SaveChangesAsync();
            return await Get(id);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] StartModel start)
        {
            if (start == null) return BadRequest("Start not set");
            var entity = await dataContext.Starts.FindAsync(start.Id);
            if (entity == null) return NotFound();
            var raceId = entity.RaceId;
            start.UpdateEntity(entity);
            dataContext.Starts.Update(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await dataContext.Starts.FindAsync(id);
            if (entity == null) return NotFound();
            int raceId = entity.RaceId;
            dataContext.Starts.Remove(entity);
            await dataContext.SaveChangesAsync();
            return await Get(raceId);
        }
    }

    public class StartModel
    {
        public StartModel() { }
        public StartModel(Start start)
        {
            this.Id = start.Id;
            this.Name = start.Name;
            this.PlannedStart = start.PlannedStart;
            this.RealStart = start.RealStart;
            this.End = start.End;
        }

        internal Start UpdateEntity(Start start)
        {
            start.Id = Id;
            start.Name = Name;
            start.PlannedStart = PlannedStart;
            start.RealStart = RealStart;
            start.End = End;
            return start;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? PlannedStart { get; set; }
        public DateTime? RealStart { get; set; }
        public DateTime? End { get; set; }
    }
}