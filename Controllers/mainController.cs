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

        [HttpPost("setActive/{startId}")]
        public async Task<IActionResult> SetActiveStart(int startId)
        {
            var currentRace = mainService.GetRaceInfo();
            if (currentRace != null && currentRace.StartId == startId) return Ok(startId);

            // clear old start
            foreach (var activeStart in dataContext.Starts.Where(s => s.IsActive))
            {
                activeStart.IsActive = false;
                activeStart.End = DateTime.Now;
            }

            try
            {
                var start = await dataContext.Starts.FindAsync(startId);
                start.IsActive = true;

                mainService.SetActiveStart(start);
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