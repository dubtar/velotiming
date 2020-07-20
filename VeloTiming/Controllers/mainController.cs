using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Controllers
{
    [ApiController]
    [Route("api")]
    public class MainController : ControllerBase
    {
        private readonly IMainService mainService;
        private readonly DataContext dataContext;

        public MainController(IMainService mainService, DataContext dataContext)
        {
            this.mainService = mainService;
            this.dataContext = dataContext;
        }

        [HttpPost("startRun/{startId}")]
        public async Task<ActionResult<int>> StartRun(int startId)
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace == null) return BadRequest("No Active Start");
            if (currentRace.StartId != startId) return BadRequest("Other start is active");
            var start = await dataContext.Starts.FindAsync(startId);
            if (start == null) return BadRequest($"Start not found by Id '{startId}");
            if (start.RealStart == null)
            {
                start.RealStart = DateTime.Now;
                await dataContext.SaveChangesAsync();
                mainService.StartRun(start.RealStart.Value);
            }
            return Ok(startId);
        }

        [HttpPost("setActive/{startId}")]
        public async Task<ActionResult<int>> SetActiveStart(int startId)
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace != null && currentRace.StartId == startId) return Ok(startId);

            try
            {
                DeactivateAllActiveStarts();
                var start = await dataContext.Starts.FindAsync(startId);
                start.IsActive = true;

                await dataContext.SaveChangesAsync();
                await mainService.SetActiveStart(start, await MainService.BuildNumbersDictionary(dataContext, start.Id));
                return Ok(startId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"Start not found by id: {startId}");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deactivate")]
        public async Task Deactivate()
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace != null)
            {
                DeactivateAllActiveStarts();
                await dataContext.SaveChangesAsync();
                await mainService.SetActiveStart(null, null);
            }
        }

        private void DeactivateAllActiveStarts()
        {
            foreach (var activeStart in dataContext.Starts.Where(s => s.IsActive))
            {
                activeStart.IsActive = false;
                activeStart.End = DateTime.Now;
            }
        }

        [HttpGet("race")]
        public ActionResult<CurrentRaceDto> GetCurrentRace()
        {
            var race = mainService.GetRaceInfo();
            var response = race == null ? null :
            new CurrentRaceDto
            {
                RaceName = race.RaceName,
                StartName = race.StartName,
                StartId = race.StartId,
                Start = race.Start
            };
            return Ok(response);
        }

        [HttpGet("marks")]
        public ActionResult<MarkDto[]> GetMarks()
        {
            return Ok(mainService.GetMarks().Select(m => new
            MarkDto(m)
            ));
        }
    }

    public class MarkDto
    {
        public MarkDto(Mark m)
        {
            Id = m.Id;
            CreatedOn = m.CreatedOn;
            Time = m.Time;
            Number = m.Number;
            Name = m.Name;
            TimeSource = m.TimeSource;
            NumberSource = m.NumberSource;
            Lap = m.Lap;
            Place = m.Place;
        }

        public string Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? Time { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public string TimeSource { get; set; }
        public string NumberSource { get; set; }
        public int Lap { get; set; }
        public int Place { get; set; }
    }

    public class CurrentRaceDto
    {
        public string RaceName { get; set; }
        public string StartName { get; set; }
        public int StartId { get; set; }
        public DateTime? Start { get; set; }
    }
}