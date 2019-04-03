﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VeloTiming.Data;

namespace veloTiming.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20190403195529_RaceCategories")]
    partial class RaceCategories
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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
#pragma warning restore 612, 618
        }
    }
}
