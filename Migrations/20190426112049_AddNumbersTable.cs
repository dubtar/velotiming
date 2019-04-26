using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class AddNumbersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RiderRfid");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "Riders",
                newName: "NumberId");

            migrationBuilder.CreateTable(
                name: "Numbers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    NumberRfids = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Numbers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RaceNumber",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NumberId = table.Column<string>(nullable: true),
                    IsReturned = table.Column<bool>(nullable: false),
                    RaceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaceNumber", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RaceNumber_Numbers_NumberId",
                        column: x => x.NumberId,
                        principalTable: "Numbers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RaceNumber_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Riders_NumberId",
                table: "Riders",
                column: "NumberId");

            migrationBuilder.CreateIndex(
                name: "IX_RaceNumber_NumberId",
                table: "RaceNumber",
                column: "NumberId");

            migrationBuilder.CreateIndex(
                name: "IX_RaceNumber_RaceId",
                table: "RaceNumber",
                column: "RaceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RaceNumber");

            migrationBuilder.DropTable(
                name: "Numbers");

            migrationBuilder.DropIndex(
                name: "IX_Riders_NumberId",
                table: "Riders");

            migrationBuilder.RenameColumn(
                name: "NumberId",
                table: "Riders",
                newName: "Number");

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
                name: "IX_RiderRfid_RiderId",
                table: "RiderRfid",
                column: "RiderId");
        }
    }
}
