using System.ComponentModel.DataAnnotations.Schema;

namespace VeloTiming.Data
{
    public class RiderRfid
    {
        public int Id { get; set; }
        public string RfidId { get; set; }
        [ForeignKey("Rider")]
        public int RiderId { get; set; }

        public virtual Rider Rider { get; set; }
    }
}