using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class AddResults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Results",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Time = table.Column<DateTime>(nullable: true),
                    TimeSource = table.Column<string>(nullable: true),
                    Number = table.Column<string>(nullable: true),
                    NumberSource = table.Column<string>(nullable: true),
                    IsIgnored = table.Column<bool>(nullable: false),
                    Data = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Results", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Results");
        }
    }
}
