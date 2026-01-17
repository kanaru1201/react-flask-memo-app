package repository

import "react-flask-memo-app/backend-go/domain/model"

type UserRepository interface {
	Create(user *model.User) error
	FindByUsername(username string) (*model.User, error)
	FindByID(id int) (*model.User, error)
	Exists(username string) (bool, error)
}

type MemoRepository interface {
	Create(memo *model.Memo) error
	FindAllByOwnerID(ownerID int) ([]model.Memo, error)
	Update(memo *model.Memo) error
	Delete(id, ownerID int) error
}
