using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VeloTiming.Data
{

    public class Race
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<Entry> Entries { get; set; }
        public virtual ICollection<RaceCategory> Categories { get; set; }
        public virtual ICollection<Rider> Riders { get; set; }

        public virtual ICollection<Start> Starts { get; set; }

        public virtual ICollection<RaceNumber> RaceNumbers { get; set; }
    }

    public class RaceNumber 
    {
        public int Id { get; set; }

        [ForeignKey("Number")]
        public string NumberId { get; set; }
        public virtual Number Number { get; set; }
        public bool IsReturned { get; set; }
    }
}