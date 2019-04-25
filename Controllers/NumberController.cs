using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VeloTiming.Data;
using VeloTiming.Services;

namespace VeloTiming.Controllers
{
    [Route("api/number")]
    public class NumberController : Controller
    {
        private readonly INumberService numberService;

        public NumberController(INumberService numberService)
        {
            this.numberService = numberService;
        }

        [HttpGet]
        public async Task<IEnumerable<NumberModel>> Get()
        {
            var numbers = await numberService.GetAll();
            return numbers.Select(n => new NumberModel(n));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await numberService.DeleteNumber(id);
                return Ok(Get());
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class NumberModel
    {
        public NumberModel() { }
        public NumberModel(Number entity)
        {
            Id = entity.Id;
            Rfids = entity.NumberRfids?.Split(' ') ?? new string[0];
        }
        public string Id { get; set; }
        public string[] Rfids { get; set; }
    }
}