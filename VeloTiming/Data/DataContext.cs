using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace VeloTiming.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Number> Numbers { get; set; }
        public DbSet<Race> Races { get; set; }
        public DbSet<RaceCategory> RaceCategories { get; set; }
        public DbSet<Rider> Riders { get; set; }
        public DbSet<Start> Starts { get; set; }

        public DbSet<Mark> Results {get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StartCategory>()
                .HasOne(sc => sc.Category)
                .WithMany().IsRequired();
            modelBuilder.Entity<StartCategory>()
                .HasOne(sc => sc.Start)
                .WithMany(s => s.Categories).IsRequired();
            modelBuilder.Entity<Mark>().Property(m => m.Data).HasConversion(
                v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                v => JsonConvert.DeserializeObject<IList<MarkData>>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })
            );
        }
    }
}