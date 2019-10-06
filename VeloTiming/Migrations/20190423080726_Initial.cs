using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Races",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Races", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RaceCategories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    Sex = table.Column<int>(nullable: false),
                    MinYearOfBirth = table.Column<int>(nullable: true),
                    MaxYearOfBirth = table.Column<int>(nullable: true),
                    RaceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaceCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RaceCategories_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Starts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    PlannedStart = table.Column<DateTime>(nullable: true),
                    RealStart = table.Column<DateTime>(nullable: true),
                    End = table.Column<DateTime>(nullable: true),
                    RaceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Starts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Starts_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Entry",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    YearOfBirth = table.Column<int>(nullable: false),
                    Team = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    CategoryId = table.Column<int>(nullable: true),
                    Number = table.Column<string>(nullable: true),
                    Sex = table.Column<int>(nullable: false),
                    RaceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Entry_RaceCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "RaceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Entry_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Riders",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Number = table.Column<string>(nullable: true),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Sex = table.Column<int>(nullable: false),
                    YearOfBirth = table.Column<int>(nullable: false),
                    City = table.Column<string>(nullable: true),
                    Team = table.Column<string>(nullable: true),
                    CategoryId = table.Column<int>(nullable: true),
                    RaceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Riders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Riders_RaceCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "RaceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Riders_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StartCategory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CategoryId = table.Column<int>(nullable: false),
                    StartId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StartCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StartCategory_RaceCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "RaceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StartCategory_Starts_StartId",
                        column: x => x.StartId,
                        principalTable: "Starts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RiderRfid",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RfidId = table.Column<string>(nullable: true),
                    RiderId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiderRfid", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RiderRfid_Riders_RiderId",
                        column: x => x.RiderId,
                        principalTable: "Riders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entry_CategoryId",
                table: "Entry",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Entry_RaceId",
                table: "Entry",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_RaceCategories_RaceId",
                table: "RaceCategories",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_RiderRfid_RiderId",
                table: "RiderRfid",
                column: "RiderId");

            migrationBuilder.CreateIndex(
                name: "IX_Riders_CategoryId",
                table: "Riders",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Riders_RaceId",
                table: "Riders",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_StartCategory_CategoryId",
                table: "StartCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StartCategory_StartId",
                table: "StartCategory",
                column: "StartId");

            migrationBuilder.CreateIndex(
                name: "IX_Starts_RaceId",
                table: "Starts",
                column: "RaceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Entry");

            migrationBuilder.DropTable(
                name: "RiderRfid");

            migrationBuilder.DropTable(
                name: "StartCategory");

            migrationBuilder.DropTable(
                name: "Riders");

            migrationBuilder.DropTable(
                name: "Starts");

            migrationBuilder.DropTable(
                name: "RaceCategories");

            migrationBuilder.DropTable(
                name: "Races");
        }
    }
}
