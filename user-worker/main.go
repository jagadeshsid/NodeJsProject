package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// MongoDB connection setup
	clientOptions := options.Client().ApplyURI("mongodb://mongodb-service:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Ping the MongoDB server to check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// Background worker logic
	for {
		// Perform summary statistics calculations
		// For example, count of users in the database
		collection := client.Database("opikaDB").Collection("users")
		usersCount, err := collection.CountDocuments(context.Background(), bson.M{})
		if err != nil {
			log.Println(err)
		}

		// Log the statistics
		log.Printf("Total users: %d\n", usersCount)

		// Sleep for a specified duration before the next run
		time.Sleep(10 * time.Second) // Run every 24 hours
	}
}
