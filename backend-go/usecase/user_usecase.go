package usecase

import (
	"errors"

	"golang.org/x/crypto/bcrypt"

	"react-flask-memo-app/backend-go/domain/model"
	"react-flask-memo-app/backend-go/domain/repository"
)

type UserUsecase interface {
	Signup(username, password string) error
	Login(username, password string) (*model.User, error)
	GetMe(userID int) (*model.User, error)
}

type userUsecase struct {
	repo repository.UserRepository
}

func NewUserUsecase(repo repository.UserRepository) UserUsecase {
	return &userUsecase{repo}
}

func (u *userUsecase) Signup(username, password string) error {
	exists, err := u.repo.Exists(username)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("username is already taken")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user, err := model.NewUser(username, string(hashed))
	if err != nil {
		return err
	}

	return u.repo.Create(user)
}

func (u *userUsecase) Login(username, password string) (*model.User, error) {
	user, err := u.repo.FindByUsername(username)
	if err != nil {
		return nil, errors.New("invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid username or password")
	}

	return user, nil
}

func (u *userUsecase) GetMe(userID int) (*model.User, error) {
	return u.repo.FindByID(userID)
}
