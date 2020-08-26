﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VeloTiming.Data;

namespace Velotiming.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.1");

            modelBuilder.Entity("VeloTiming.Data.Entry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("City")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Number")
                        .HasColumnType("TEXT");

                    b.Property<int?>("RaceId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Sex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Team")
                        .HasColumnType("TEXT");

                    b.Property<int>("YearOfBirth")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("RaceId");

                    b.ToTable("Entry");
                });

            modelBuilder.Entity("VeloTiming.Data.Mark", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Data")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsIgnored")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Lap")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Number")
                        .HasColumnType("TEXT");

                    b.Property<string>("NumberSource")
                        .HasColumnType("TEXT");

                    b.Property<int>("Place")
                        .HasColumnType("INTEGER");

                    b.Property<int>("StartId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("Time")
                        .HasColumnType("TEXT");

                    b.Property<string>("TimeSource")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("StartId");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("VeloTiming.Data.Number", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("NumberRfids")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Numbers");
                });

            modelBuilder.Entity("VeloTiming.Data.Race", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Races");
                });

            modelBuilder.Entity("VeloTiming.Data.RaceCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Code")
                        .HasColumnType("TEXT");

                    b.Property<int?>("MaxYearOfBirth")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("MinYearOfBirth")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("RaceId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Sex")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("RaceId");

                    b.ToTable("RaceCategories");
                });

            modelBuilder.Entity("VeloTiming.Data.RaceNumber", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsReturned")
                        .HasColumnType("INTEGER");

                    b.Property<string>("NumberId")
                        .HasColumnType("TEXT");

                    b.Property<int?>("RaceId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("NumberId");

                    b.HasIndex("RaceId");

                    b.ToTable("RaceNumber");
                });

            modelBuilder.Entity("VeloTiming.Data.Rider", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("City")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("NumberId")
                        .HasColumnType("TEXT");

                    b.Property<int>("RaceId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Sex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Team")
                        .HasColumnType("TEXT");

                    b.Property<int>("YearOfBirth")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("NumberId");

                    b.HasIndex("RaceId");

                    b.ToTable("Riders");
                });

            modelBuilder.Entity("VeloTiming.Data.Start", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("DelayMarksAfterStartMinutes")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsActive")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("PlannedStart")
                        .HasColumnType("TEXT");

                    b.Property<int>("RaceId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("RealStart")
                        .HasColumnType("TEXT");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("RaceId");

                    b.ToTable("Starts");
                });

            modelBuilder.Entity("VeloTiming.Data.StartCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("StartId")
                        .HasColumnType("INTEGER");

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

                    b.HasOne("VeloTiming.Data.Race", null)
                        .WithMany("Entries")
                        .HasForeignKey("RaceId");
                });

            modelBuilder.Entity("VeloTiming.Data.Mark", b =>
                {
                    b.HasOne("VeloTiming.Data.Start", "Start")
                        .WithMany()
                        .HasForeignKey("StartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("VeloTiming.Data.RaceCategory", b =>
                {
                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Categories")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("VeloTiming.Data.RaceNumber", b =>
                {
                    b.HasOne("VeloTiming.Data.Number", "Number")
                        .WithMany()
                        .HasForeignKey("NumberId");

                    b.HasOne("VeloTiming.Data.Race", null)
                        .WithMany("RaceNumbers")
                        .HasForeignKey("RaceId");
                });

            modelBuilder.Entity("VeloTiming.Data.Rider", b =>
                {
                    b.HasOne("VeloTiming.Data.RaceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("VeloTiming.Data.Number", "Number")
                        .WithMany()
                        .HasForeignKey("NumberId");

                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Riders")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("VeloTiming.Data.Start", b =>
                {
                    b.HasOne("VeloTiming.Data.Race", "Race")
                        .WithMany("Starts")
                        .HasForeignKey("RaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("VeloTiming.Data.StartCategory", b =>
                {
                    b.HasOne("VeloTiming.Data.RaceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VeloTiming.Data.Start", "Start")
                        .WithMany("Categories")
                        .HasForeignKey("StartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
