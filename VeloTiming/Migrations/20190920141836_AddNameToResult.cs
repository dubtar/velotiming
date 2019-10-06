using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class AddNameToResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Results",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Results");
        }
    }
}
