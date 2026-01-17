package infra

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:password@database:5432/react_flask_memo?sslmode=disable"
	}

	var err error
	for i := 0; i < 30; i++ {
		DB, err = sql.Open("postgres", dsn)
		if err == nil {
			if err = DB.Ping(); err == nil {
				log.Println("Connected to PostgreSQL successfully")
				return
			}
		}
		log.Printf("Waiting for DB... (attempt %d/30)", i+1)
		time.Sleep(2 * time.Second)
	}
	log.Fatal("Could not connect to database")
}
