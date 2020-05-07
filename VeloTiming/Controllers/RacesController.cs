using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;

namespace VeloTiming.Controllers
{
    [Route("api/races")]
    public class RacesController : Controller
    {
        private readonly DataContext dataContext;

        public RacesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        [HttpGet]
        public IEnumerable<RaceDto> GetRaces()
        {
            return dataContext.Races.AsEnumerable().Select(r => new RaceDto(r));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<RaceDto>> Get(int id)
        {
            var race = await dataContext.Races.FindAsync(id);
            if (race == null) return NotFound();
            return Ok(new RaceDto(race));
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateRace([FromBody]RaceDto race)
        {
            if (race == null)
                return BadRequest("Race not set");
            if (!race.IsValid())
                return BadRequest(race.Errrors());
            var entity = race.UpdateEntity(new Race());
            var added = dataContext.Races.Add(entity);
            await dataContext.SaveChangesAsync();
            return Ok(entity.Id);
        }

        [HttpPut()]
        public async Task<ActionResult<RaceDto>> UpdateRace([FromBody]RaceDto race)
        {
            if (race == null || !race.IsValid())
                return BadRequest(race?.Errrors());
            var entity = await dataContext.Races.FindAsync(race.Id);
            if (entity == null) return NotFound();

            dataContext.Races.Update(race.UpdateEntity(entity));
            await dataContext.SaveChangesAsync();
            return Ok(new RaceDto(entity));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteRace(int id)
        {
            var entity = await dataContext.Races.FindAsync(id);
            if (entity == null) return NotFound();
            dataContext.Races.Remove(entity);
            await dataContext.SaveChangesAsync();
            return Ok(true);
        }
    }

    public class RaceDto
    {
        public RaceDto() { }
        public RaceDto(Race race)
        {
            Id = race.Id;
            Name = race.Name;
            Description = race.Description;
            Date = race.Date;
            Type = race.Type;
        }
        public Race UpdateEntity(Race race)
        {
            race.Name = Name;
            race.Description = Description;
            race.Date = Date;
            race.Type = Type;
            return race;
        }
        private void Validate()
        {
            errors.Clear();
            if (string.IsNullOrWhiteSpace(Name)) errors.Add("Название не указано");
            if (Date.Year < 2000 || Date.Year > 2100) errors.Add("Дата не указана");
        }
        #region Validation
        private List<string> errors = new List<string>();
        public bool IsValid()
        {
            Validate();
            return errors.Count == 0;
        }
        public string Errrors()
        {
            return string.Join(", ", errors);
        }
        #endregion
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public RaceType Type { get; set; }
    }
}