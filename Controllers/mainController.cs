using System;
using System.Collections.Generic;
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
        }

        [HttpPost("setActive")]
        public async Task<IActionResult> SetActiveStart(int startId)
        {
            try
            {
                await mainService.SetActiveStart(startId);
                return Ok();
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