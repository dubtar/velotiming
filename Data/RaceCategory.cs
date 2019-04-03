using System.ComponentModel.DataAnnotations.Schema;

namespace VeloTiming.Data
{
    public class RaceCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public Sex Sex { get; set; }
        public int? MinYearOfBirth { get; set; }
        public int? MaxYearOfBirth { get; set; }

        [ForeignKey("Race")]
        public int RaceId { get; set; }
        public virtual Race Race { get; set; }
    }

    public enum Sex
    {
        Male = 'M', Female = 'F'
    }
}