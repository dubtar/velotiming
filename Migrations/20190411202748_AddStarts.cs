using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class AddStarts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_Starts_RaceId",
                table: "Starts",
                column: "RaceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Starts");
        }
    }
}
