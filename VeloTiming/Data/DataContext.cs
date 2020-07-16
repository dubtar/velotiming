using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

        public DbSet<Mark> Results { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StartCategory>()
                .HasOne(sc => sc.Category)
                .WithMany().IsRequired();
            modelBuilder.Entity<StartCategory>()
                .HasOne(sc => sc.Start)
                .WithMany(s => s.Categories).IsRequired();
            modelBuilder.Entity<Mark>().Property(m => m.Data).HasConversion(
                v => JsonSerializer.Serialize(v, new JsonSerializerOptions { IgnoreNullValues = true }),
                v => JsonSerializer.Deserialize<IList<MarkData>>(v, new JsonSerializerOptions { IgnoreNullValues = true })
            ).Metadata.SetValueComparer(new ValueComparer<IList<MarkData>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => (IList<MarkData>)(c.Select(a => a.Copy()).ToList()))
            );

            // Apply local datetime kind to store as UTC and read as local back
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(v => v.ToUniversalTime(), v => DateTime.SpecifyKind(v, DateTimeKind.Utc).ToLocalTime());
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                        property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}