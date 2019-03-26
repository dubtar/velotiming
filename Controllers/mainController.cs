using System;
using Microsoft.AspNetCore.Mvc;

namespace VeloTiming.Controllers
{
    [Route("api")]
    public class MainController : Controller
    {
        [HttpGet("")]
        public IActionResult GetCurrentRace()
        {
            // временная заглушка
            return Ok(new { name = "Пробная гонка", date = DateTime.Now.Date });
        }
    }
}