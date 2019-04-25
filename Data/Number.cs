using System.ComponentModel.DataAnnotations;

namespace VeloTiming.Data 
{
    public class Number
    {
        [Key]
        public string Id { get; set; }

        // space-separated list of rfids (список кодов меток через пробел)
        public virtual string NumberRfids { get; set; }
    }
}