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
	// MongoDB connection
	clientOptions := options.Client().ApplyURI("mongodb://mongodb-service:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	go backgroundWorker(client)

	select {}
}

func backgroundWorker(client *mongo.Client) {
	for {
		go calculateStatistics(client)

		time.Sleep(10 * time.Second) // Run every 24 hours
	}
}

func calculateStatistics(client *mongo.Client) {
	collection := client.Database("opikaDB").Collection("users")
	usersCount, err := collection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
		return
	}

	log.Printf("Total users: %d\n", usersCount)
}
