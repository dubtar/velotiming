using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;

namespace VeloTiming.Controllers {
    [Route("api/races")]
    public class RacesController : Controller
    {
        private readonly DataContext dataContext;

        public RacesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        [HttpGet]
        public IEnumerable<RaceDto> GetRaces() {
            return dataContext.Races.AsEnumerable().Select(r => new RaceDto(r));
        }
    }

    public class RaceDto {
        public RaceDto(Race race)
        {
            Id = race.Id;
            Name = race.Name;
        }
        public int Id { get; set; }
        public string Name { get; set; }
    }
}