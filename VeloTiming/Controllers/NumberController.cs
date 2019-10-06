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
        public IEnumerable<NumberModel> Get()
        {
            return numberService.GetAll();
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

        [HttpPost]
        public async Task<IActionResult> AddOrUpdate([FromBody] NumberModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Id))
                return BadRequest("Number not posted");
            await numberService.AddOrUpdate(model);
            return Ok(Get());
        }
    }
}