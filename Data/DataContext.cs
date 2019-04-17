using Microsoft.EntityFrameworkCore;

namespace VeloTiming.Data {
    public class DataContext: DbContext {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Race> Races { get; set; }
        public DbSet<RaceCategory> RaceCategories { get; set; }
        public DbSet<Start> Starts { get; set; }
        public DbSet<Rider> Riders { get; set; }
        public DbSet<RiderRfid> RiderRfid { get; set; }
    }
}