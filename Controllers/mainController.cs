using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Controllers
{
    [Route("api")]
    public class MainController : Controller
    {
        private readonly IMainService mainService;
        private readonly DataContext dataContext;

        public MainController(IMainService mainService, DataContext dataContext)
        {
            this.mainService = mainService;
            this.dataContext = dataContext;
        }

        [HttpPost("startRun/{startId}")]
        public IActionResult StartRun(int startId)
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace == null) return BadRequest("No Active Start");
            if (currentRace.StartId != startId) return BadRequest("Other start is active");
            mainService.StartRun();
            return Ok(startId);
        }

        [HttpPost("setActive/{startId}")]
        public async Task<IActionResult> SetActiveStart(int startId)
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace != null && currentRace.StartId == startId) return Ok(startId);

            try
            {
                DeactivateAllActiveStarts();
                var start = await dataContext.Starts.FindAsync(startId);
                start.IsActive = true;

                await dataContext.SaveChangesAsync();
                await mainService.SetActiveStart(start);
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
                await mainService.SetActiveStart(null);
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
        public RaceInfo GetCurrentRace()
        {
            return mainService.GetRaceInfo();
        }

        [HttpGet("marks")]
        public IEnumerable<Mark> GetMarks()
        {

            return mainService.GetMarks();
        }
    }
}