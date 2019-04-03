using Microsoft.EntityFrameworkCore;

namespace VeloTiming.Data {
    public class DataContext: DbContext {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Race> Races { get; set; }
        public DbSet<RaceCategory> RaceCategories { get; set; }
    }
}