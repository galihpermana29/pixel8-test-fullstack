package repository

import (
	"fmt"
	"time"

	"github.com/galihpermana29/pixel8labs-technical/database"
	"github.com/galihpermana29/pixel8labs-technical/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	FindUserByUsername(username string) (*model.User, error)
	Save(user model.User) (*model.User, error)
	SaveVisitor(visitor model.Visitor) (*model.Visitor, bool, error)
	UpdateUser(user model.User) (*model.User, error)
	FindVisitorsByUserId(userId uint) ([]model.Visitor, error)
}

type userRepository struct {
	db *gorm.DB
}

func (*userRepository) FindUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := database.Database.Where("username=?", username).Find(&user).Error
	if err != nil {
			return &model.User{}, err
	}
	return &user, nil
}

func (*userRepository) Save(user model.User) (*model.User, error) {
	err := database.Database.Create(&user).Error
	if err != nil {
			return &model.User{}, err
	}
	return &user, nil
}

func (*userRepository) UpdateUser(user model.User) (*model.User, error) {
	u := &model.User{}

	err := database.Database.Where("username=?", user.Username).First(&u).Error
	if err != nil {
			return &model.User{}, err
	}

	database.Database.Model(&model.User{}).Where("username=?", user.Username).Save(&user)
	database.Database.Model(&model.Visitor{}).Where("user_id = ? AND username = ?", u.ID, user.Visitor.Username).Update("updated_at", time.Now())
	
	return &user, nil
}

func (*userRepository) SaveVisitor(visitor model.Visitor) (*model.Visitor, bool, error) {
	user := &model.User{}

	if err := database.Database.Where("id=?", visitor.UserID).First(&user).Error; err != nil {
		user.ID = visitor.UserID
		user.Username = visitor.Username
		database.Database.Save(&user)
	}

	errFirst := database.Database.First(&visitor, "username=? AND user_id=?", visitor.Username, visitor.UserID).Error
	if errFirst != nil {
		err := database.Database.Create(&visitor).Error
		if err != nil {
				return &model.Visitor{}, false, err
		}
		return &visitor, true, nil
	}
	return &visitor, false, nil
}

func (*userRepository) FindVisitorsByUserId(userId uint) ([]model.Visitor, error) {
	visitors := []model.Visitor{}

	if err := database.Database.Model(&model.Visitor{}).Where("user_id=?", userId).Order("updated_at desc").Limit(3).Find(&visitors).Error; err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	return visitors, nil
}

func NewAuthRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		db:db,
	}
}
