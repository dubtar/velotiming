﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VeloTiming.Data;

namespace veloTiming.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854");

            modelBuilder.Entity("VeloTiming.Data.Entry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CategoryId");

                    b.Property<string>("City");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<string>("Number");

                    b.Property<int?>("RaceId");

                    b.Property<int>("Sex");

                    b.Property<string>("Team");

                    b.Property<int>("YearOfBirth");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("RaceId");

                    b.ToTable("Entry");
                });

            modelBuilder.Entity("VeloTiming.Data.Race", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<int>("Type");

                    b.HasKey("Id");

                    b.ToTable("Races");
                });

            modelBuilder.Entity("VeloTiming.Data.RaceCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Code");

                    b.Property<int?>("MaxYearOfBirth");

                    b.Property<int?>("MinYearOfBirth");

                    b.Property<string>("Name");

                    b.Property<int>("RaceId");

                    b.Property<int>("Sex");

                    b.HasKey("Id");

                    b.HasIndex("RaceId");

                    b.ToTable("RaceCategories");
                });

            modelBuilder.Entity("VeloTiming.Data.Rider", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CategoryId");

                    b.Property<string>("City");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<int>("RaceId");

                    b.Property<int>("Sex");

                    b.Property<string>("Team");

                    b.Property<int>("YearOfBirth");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("RaceId");

                    b.ToTable("Riders");
                });

            modelBuilder.Entity("VeloTiming.Data.Start", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("End");

                    b.Property<string>("Name");

                    b.Property<DateTime?>("PlannedStart");

                    b.Property<int>("RaceId");

                    b.Property<DateTime?>("RealStart");

                    b.HasKey("Id");

                    b.HasIndex("RaceId");

                    b.ToTable("Starts");
                });

            modelBuilder.Entity("VeloTiming.Data.StartCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CategoryId");

                    b.Property<int?>("StartId");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("StartId");

                    b.ToTable("StartCategory");
                });

            modelBuilder.Entity("VeloTiming.Data.Entry", b =>
                {
                    b.HasOne("VeloTiming.Data.RaceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("VeloTiming.Data.Race")
                        .WithMany("Entries")
                        .HasForeignKey("RaceId");
                });

            modelBuilder.Entity("VeloTiming.Data.RaceCategory", b =>
                {
                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Categories")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("VeloTiming.Data.Rider", b =>
                {
                    b.HasOne("VeloTiming.Data.RaceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Riders")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("VeloTiming.Data.Start", b =>
                {
                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Starts")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("VeloTiming.Data.StartCategory", b =>
                {
                    b.HasOne("VeloTiming.Data.RaceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("VeloTiming.Data.Start", "Start")
                        .WithMany("Categories")
                        .HasForeignKey("StartId");
                });
#pragma warning restore 612, 618
        }
    }
}
