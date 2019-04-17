using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace VeloTiming.Data
{
    public class Rider 
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Sex Sex { get; set; }
        public int YearOfBirth { get; set; }
        public string City { get; set; }
        public string Team { get; set; }

        public virtual RaceCategory Category { get; set; }
        public int RaceId { get; set; }

        [ForeignKey("RaceId")]
        public virtual Race Race { get; set; }

        public virtual ICollection<RiderRfid> Rfids { get; set; }
    }
}