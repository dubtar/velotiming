using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Controllers
{
    [Route("api")]
    public class MainController : Controller
    {
        private readonly IMainService raceService;
        public MainController(IMainService raceService)
        {
            this.raceService = raceService;
        }

        [HttpGet("race")]
        public RaceInfo GetCurrentRace()
        {
            return raceService.GetRaceInfo();
        }

        [HttpGet("marks")]
        public IEnumerable<Mark> GetMarks() 
        {

            return raceService.GetMarks();
        }
    }
}