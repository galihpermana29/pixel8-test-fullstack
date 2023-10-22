package service

import (
	"errors"
	"fmt"

	"github.com/galihpermana29/pixel8labs-technical/model"
	"github.com/galihpermana29/pixel8labs-technical/repository"
)


type userService struct {
	userRepository repository.UserRepository
}

type UserService interface {
	Login(input *model.AuthenticationInput)(*model.User, error) 
	UpdateCount(input *model.AuthenticationInput) (*model.User, error)
}

func (as *userService) GetVisitors(userID uint) ([]model.Visitor) {
	visitors, err := as.userRepository.FindVisitorsByUserId(userID) 
	if err != nil {
		fmt.Println(err.Error())
		
		return nil
	}

	return visitors
}

func (as *userService) UpdateCount(input *model.AuthenticationInput) (*model.User, error) {
	checkedUser, err := as.userRepository.FindUserByUsername(input.Username)

	if err != nil {
		return nil, errors.New("error while finding user") 
	}

	if checkedUser.ID != 0 {
		checkedUser.VisitorCounter = checkedUser.VisitorCounter + 1
		newUser, err := as.userRepository.UpdateUser(*checkedUser)
		if err != nil {
			return nil, errors.New("error while update user") 
		}

		return newUser,nil
	}
	user := model.User{
		Username: input.Username,
		VisitorCounter: 1,
	}

	valueFromRepo, err := as.userRepository.Save(user)

	if err != nil {
		return nil, errors.New("error while create new user")
	}
	
	return valueFromRepo, nil
}

func (as *userService) Login(input *model.AuthenticationInput) (*model.User, error) {
	var savedUser *model.User

	checkedUser, err := as.userRepository.FindUserByUsername(input.Username)
	if err != nil {
		return nil, errors.New("failed find user to db")
	}

	// if the user has been created in db
	if checkedUser.ID != 0 {
		var isNewVisitor bool
		// mekanisme update counter 

		visitor := &model.Visitor{}
		// save latest visitor profile (bukan guest -> kalo ngirim visitor)
		if input.Visitor.Username != "" {
			input.Visitor.UserID = checkedUser.ID

			v, isNew, err := as.userRepository.SaveVisitor(input.Visitor)
			if err != nil {
				return nil, errors.New("failed save visitor to likely when create visitor")
			}
			isNewVisitor = isNew
			visitor = v
		}

		if isNewVisitor {
			checkedUser.VisitorCounter = checkedUser.VisitorCounter + 1
			// }
			checkedUser.Visitor = *visitor

			newUser, err := as.userRepository.UpdateUser(*checkedUser)
			if err != nil {
				return nil, errors.New("failed update user with visitors")
			}

			newUser.Visitors = as.GetVisitors(checkedUser.ID)
			return newUser, nil
		}
		checkedUser.Visitors = as.GetVisitors(checkedUser.ID)

		return checkedUser, nil

	}
	// if the user not in db yet
	if checkedUser.ID == 0 {
		user := model.User{
			Username: input.Username,
			VisitorCounter: 1,
		}

		valueFromRepo, err := as.userRepository.Save(user)

		if input.Visitor.Username != "" {
			newVisitor := model.Visitor{
				UserID: valueFromRepo.ID,
				Username: input.Visitor.Username,
				AvatarUrl: input.Visitor.AvatarUrl,
			}
			visitor, _, _ := as.userRepository.SaveVisitor(newVisitor)

			valueFromRepo.Visitor = *visitor
		}

		if err != nil {
			return nil, errors.New("failed save user to db")
		}
		// mekanisme update counter
		savedUser = valueFromRepo
		savedUser.Visitors = as.GetVisitors(savedUser.ID)
	}
	
	return savedUser, nil
}

func NewAuthService(userRepo *repository.UserRepository) UserService {
	return &userService{
		userRepository:*userRepo,
	}
}