package main

import (
	"database/sql"
	"fmt"
	"os"

	"example.com/alfabeauty-b2b/internal/obs"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func main() {
	obs.Init()

	if len(os.Args) < 2 {
		obs.Fatal("migrate_invalid_args", obs.Fields{"usage": fmt.Sprintf("%s <up|down|status>", os.Args[0])})
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" || dbURL == "__CHANGE_ME__" {
		obs.Fatal("migrate_invalid_config", obs.Fields{"reason": "DATABASE_URL_required"})
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		obs.Fatal("migrate_db_open_failed", obs.Fields{"error": err.Error()})
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		obs.Fatal("migrate_db_ping_failed", obs.Fields{"error": err.Error()})
	}

	if err := goose.SetDialect("postgres"); err != nil {
		obs.Fatal("migrate_set_dialect_failed", obs.Fields{"error": err.Error()})
	}

	cmd := os.Args[1]
	migrationsDir := "migrations"

	switch cmd {
	case "up":
		if err := goose.Up(db, migrationsDir); err != nil {
			obs.Fatal("migrate_up_failed", obs.Fields{"error": err.Error()})
		}
		fmt.Println("migrations applied")
	case "down":
		if err := goose.Down(db, migrationsDir); err != nil {
			obs.Fatal("migrate_down_failed", obs.Fields{"error": err.Error()})
		}
		fmt.Println("migration rolled back")
	case "status":
		if err := goose.Status(db, migrationsDir); err != nil {
			obs.Fatal("migrate_status_failed", obs.Fields{"error": err.Error()})
		}
	default:
		obs.Fatal("migrate_invalid_args", obs.Fields{"reason": "unknown_command", "cmd": cmd})
	}
}
