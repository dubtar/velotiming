using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace VeloTiming.Data
{
    public class Start
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? PlannedStart { get; set; }
        public DateTime? RealStart { get; set; }
        public DateTime? End { get; set; }
        public int RaceId { get; set; }
        [ForeignKey("RaceId")]
        public virtual Race Race { get; set; }
        public virtual ICollection<StartCategory> Categories { get; set; }
        public bool IsActive { get; set; }
    }

    public class StartCategory 
    {
        public int Id { get; set; }
        public virtual RaceCategory Category { get; set; }
        public virtual Start Start { get; set; }
    }
}