using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AssetBridge.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAgentExecutionRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AgentExecutionRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RunId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IncidentId = table.Column<int>(type: "integer", nullable: false),
                    AssetCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AssetName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Objective = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    RequiredSpecialization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    InputPayload = table.Column<string>(type: "text", nullable: true),
                    RetrievedRagDocs = table.Column<string>(type: "text", nullable: true),
                    ImmediateSafetyActions = table.Column<string>(type: "text", nullable: true),
                    ToolCallsAudit = table.Column<string>(type: "text", nullable: true),
                    ExecutionPlan = table.Column<string>(type: "text", nullable: true),
                    ExecutionDurationMs = table.Column<long>(type: "bigint", nullable: false),
                    ExecutedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentExecutionRecords", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgentExecutionRecords");
        }
    }
}
