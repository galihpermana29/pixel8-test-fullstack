package main

import (
	"fmt"
	"log"
	"time"

	"github.com/galihpermana29/pixel8labs-technical/controller"
	"github.com/galihpermana29/pixel8labs-technical/database"
	"github.com/galihpermana29/pixel8labs-technical/model"
	"github.com/galihpermana29/pixel8labs-technical/repository"
	"github.com/galihpermana29/pixel8labs-technical/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main (){
	loadEnv()
	loadDatabase()
	serveApplication()
}

func loadDatabase() {
	database.Connect()
	database.Database.AutoMigrate(&model.User{})
	database.Database.AutoMigrate(&model.Visitor{})
}

func loadEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
			log.Fatal("Error loading .env file")
	}
}

func serveApplication() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "POST"},
		AllowHeaders:     []string{"Origin","Content-Type", "Content-Length"," Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))

	authRepository := repository.NewAuthRepository(database.Database)
	authService := service.NewAuthService(&authRepository)
	AuthController := controller.NewAuthController(&authService)

	publicRoutes := router.Group("/auth")
	publicRoutes.POST("/login", AuthController.Login)
	publicRoutes.POST("/update-count", AuthController.UpdateCount)

	router.Run(":8000")
	fmt.Println("Server running on port 8000")
}