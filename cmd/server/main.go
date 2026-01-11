package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"example.com/alfabeauty-b2b/internal/config"
	"example.com/alfabeauty-b2b/internal/database"
	"example.com/alfabeauty-b2b/internal/handler"
	"example.com/alfabeauty-b2b/internal/repository"
	"example.com/alfabeauty-b2b/internal/repository/memory"
	"example.com/alfabeauty-b2b/internal/repository/postgres"
	"example.com/alfabeauty-b2b/internal/service"
)

func main() {
	// Best-effort local dev convenience. In containers/CI, env should be injected.
	_, _ = os.Stat(".env")
	_ = godotenv.Load()

	cfg, err := config.LoadFromEnv()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	var leadRepo repository.LeadRepository
	if cfg.DatabaseURL != "" && cfg.DatabaseURL != "__CHANGE_ME__" {
		db, err := database.OpenPostgres(cfg.DatabaseURL)
		if err != nil {
			log.Fatalf("database error: %v", err)
		}
		defer db.Close()

		leadRepo = postgres.NewLeadRepository(db)
		log.Printf("lead repository: postgres")
	} else {
		leadRepo = memory.NewLeadRepository()
		log.Printf("lead repository: memory")
	}
	leadSvc := service.NewLeadService(leadRepo)

	app := handler.NewApp(cfg, leadSvc)

	log.Printf("listening on %s", cfg.Addr())
	if err := app.Listen(cfg.Addr()); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}
