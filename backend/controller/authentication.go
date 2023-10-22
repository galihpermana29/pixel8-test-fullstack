package controller

import (
	"net/http"

	"github.com/galihpermana29/pixel8labs-technical/model"
	"github.com/galihpermana29/pixel8labs-technical/service"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService service.UserService
}

func (as *UserController) Login(context *gin.Context) {
	var input *model.AuthenticationInput

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := as.userService.Login(input)
	
	if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

	context.JSON(http.StatusOK, gin.H{"data": user})
} 

func (as *UserController) UpdateCount(context *gin.Context){
	var input *model.AuthenticationInput
	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := as.userService.UpdateCount(input)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"data": user})
}


func NewAuthController(us *service.UserService) UserController {
	return UserController{
		userService: *us,
	}
}