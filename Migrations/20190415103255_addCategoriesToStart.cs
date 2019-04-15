using Microsoft.EntityFrameworkCore.Migrations;

namespace veloTiming.Migrations
{
    public partial class addCategoriesToStart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StartCategory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CategoryId = table.Column<int>(nullable: true),
                    StartId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StartCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StartCategory_RaceCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "RaceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StartCategory_Starts_StartId",
                        column: x => x.StartId,
                        principalTable: "Starts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StartCategory_CategoryId",
                table: "StartCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StartCategory_StartId",
                table: "StartCategory",
                column: "StartId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StartCategory");
        }
    }
}
