using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class MarkChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Lap",
                table: "Results",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Place",
                table: "Results",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lap",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "Place",
                table: "Results");
        }
    }
}
