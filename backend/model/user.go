package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint `gorm:"primarykey"`
	Username string `gorm:"size:255;not null;unique" json:"username"`
	Visitor Visitor `gorm:"foreignKey:UserID" json:"visitor"`
	VisitorCounter int64 `json:"visitor_counter"`
	Visitors []Visitor `json:"latest_visitors"`
	Timestamp
}

type Visitor struct {
	UserID	uint `json:"user_id"`
	Username string `json:"username"`
	AvatarUrl string `json:"avatar_url"`
	Timestamp
}

type AuthenticationInput struct {
	Username string `json:"username" binding:"required"`
	Visitor Visitor `json:"visitor"`
}

type Timestamp struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

